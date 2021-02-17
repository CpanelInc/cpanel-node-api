// MIT License
//
// Copyright 2021 cPanel L.L.C.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

import {
    snakeCase
} from "lodash";

import * as Perl from "../utils/perl";

import {
    SortDirection,
    SortType
} from "../utils/sort";

import {
    FilterOperator
} from "../utils/filter";

import {
    IArgument
} from "../utils/argument";

import {
    IPager
} from "../utils/pager";

import {
    GenerateRule,
    Request,
    IRequest
} from "../request";

import {
    HttpVerb
} from "../http/verb";

import {
    RequestInfo
} from "../interchange";

import {
    CpanelApiTokenHeader,
    CpanelApiTokenMismatchError,
    Headers,
    Header
} from "../utils/headers";

import {
    ArgumentSerializationRule,
    argumentSerializationRules
} from "../argument-serializer-rules";

import {
    IArgumentEncoder,
    JsonArgumentEncoder,
    WwwFormUrlArgumentEncoder
} from "../utils/encoders";
import _ from "lodash";

/**
 * Type of response format for WHM API 1. The data can be requested to be sent back
 * either in JSON format or XML format.
 */
export enum WhmApiType {

	/**
	 * Json-Api request
	 */
    JsonApi = "json-api",

	/**
	 * Xml-Api request
	 */
    XmlApi = "xml-api",
}

export class WhmApiRequest extends Request {

    /**
     * The API output format the request should be generated for.
     */
    public apiType: WhmApiType = WhmApiType.JsonApi;

    /**
     * Add a custom http header to the request
     *
     * @param name Name of a column
     * @return Updated Request object.
     */
    addHeader(header: Header): Request {
        if (header instanceof CpanelApiTokenHeader) {
            throw new  CpanelApiTokenMismatchError("A CpanelApiTokenHeader cannot be used on a WhmApiRequest");
        }
        super.addHeader(header);
        return this;
    }

    /**
     * Build a fragment of the parameter list based on the list of name/value pairs.
     *
     * @param params  Parameters to serialize.
     * @param encoder Encoder to use to serialize the each parameter.
     * @return Fragment with the serialized parameters
     */
    private _build(params: IArgument[], encoder: IArgumentEncoder): string {
        let fragment = "";
        params.forEach((arg, index, array) => {
            const isLast: boolean = index === array.length - 1;
            fragment += encoder.encode(arg.name, arg.value, isLast);
        });
        return encoder.separatorStart +
            fragment +
            encoder.separatorEnd;
    }

    /**
     * Convert from a number into a string that WHM API v1 will sort
     * in the same order as the numbers; e.g.: 26=>"za", 52=>"zza", ...
     * @method  _make_whm_api_fieldspec_from_number
     * @private
     * @param num Index of sort item
     * @return letter combination for the index of the sort item.
     */
    private _make_whm_api_fieldspec_from_number(num: number): string {
        let left = _.padStart("", Math.floor(num / 26), "z");
        return left + "abcdefghijklmnopqrstuvwxyz".charAt(num % 26);
    };

    /**
     * Generates the arguments for the request.
     *
     * @param params List of parameters to adjust based on the sort rules in the Request.
     */
    private _generateArguments(params: IArgument[]): void {

        // For any WHM Api call the api version must be specified as an argument. It is required.
        // Adding it first before everything.
        let apiVersionParam: IArgument = { name: "api.version", value: 1 };
        params.push(apiVersionParam);
        this.arguments.forEach(argument => params.push(argument));
    }

    /**
     * Generates the sort parameters for the request.
     *
     * @param params List of parameters to adjust based on the sort rules in the Request.
     */
    private _generateSorts(params: IArgument[]): void {
        this.sorts.forEach((sort, index) => {
            if (index === 0) {
                params.push({ name: "api.sort.enable", value: Perl.fromBoolean(true) });
            }

            let sortPrefix: string = `api.sort.${this._make_whm_api_fieldspec_from_number(index)}`;

            params.push({ name: `${sortPrefix}.field`, value: sort.column });
            params.push({ name: `${sortPrefix}.reverse`, value: Perl.fromBoolean(sort.direction !== SortDirection.Ascending) });
            params.push({ name: `${sortPrefix}.method`, value: snakeCase(SortType[sort.type]) });
        });
    }

    /**
     * Lookup the correct name for the filter operator
     *
     * @param operator Type of filter operator to use to filter the items
     * @returns The string counter part for the filter operator.
     * @throws Will throw an error if an unrecognized FilterOperator is provided.
     */
    private _lookupFilterOperator(operator: FilterOperator): string {
        switch (operator) {
            case FilterOperator.GreaterThanUnlimited:
                return "gt_handle_unlimited";
            case FilterOperator.GreaterThan:
                return "gt";
            case FilterOperator.LessThanUnlimited:
                return "lt_handle_unlimited";
            case FilterOperator.LessThan:
                return "lt";
            case FilterOperator.Equal:
                return "eq";
            case FilterOperator.Begins:
                return "begins";
            case FilterOperator.Contains:
                return "contains";
            default:
                const key = FilterOperator[operator];
                throw new Error(`Unrecoginzed FilterOperator ${key} for WHM API 1`);
        }
    }

    /**
     * Generate the filter parameters if any.
     *
     * @param params List of parameters to adjust based on the filter rules provided.
     */
    private _generateFilters(params: IArgument[]): void {
        this.filters.forEach((filter, index) => {
            if (index === 0) {
                params.push({ name: "api.filter.enable", value: Perl.fromBoolean(true) });
                params.push({ name: "api.filter.verbose", value: Perl.fromBoolean(true) });
            }

            let filterPrefix: string = `api.filter.${this._make_whm_api_fieldspec_from_number(index)}`;
            params.push({ name: `${filterPrefix}.field`, value: filter.column });
            params.push({ name: `${filterPrefix}.type`, value: this._lookupFilterOperator(filter.operator) });
            params.push({ name: `${filterPrefix}.arg0`, value: filter.value });
        });
    }

    /**
     * In UAPI we request the starting record not the starting page. This translates
     * the page and page size into the correct starting record.
     *
     * @param pager Object containing pager settings.
     */
    private _translatePageToStart(pager: IPager) {
        return ((pager.page - 1) * pager.pageSize) + 1;
    }

    /**
     * Generate the pager request parameters if any.
     *
     * @param params List of parameters to adjust based on the pagination rules.
     */
    private _generatePagination(params: IArgument[]): void {
        if (!this.usePager) {
            return;
        }

        let allPages = this.pager.all();
        params.push({ name: "api.chunk.enable", value: Perl.fromBoolean(true) });
        params.push({ name: "api.chunk.verbose", value: Perl.fromBoolean(true) });
        params.push({
            name: "api.chunk.start",
            value: allPages ? -1 : this._translatePageToStart(this.pager)
        });
        if (!allPages) {
            params.push({
                name: "api.chunk.size",
                value: this.pager.pageSize
            });
        }
    }

    /**
     * Create a new uapi request.
     *
     * @param init Optional request object used to initialize this object.
     */
    constructor(apiType: WhmApiType, init?: IRequest) {
        super(init);

        // Needed for or pure js clients since they don't get the compiler checks
        if (apiType != WhmApiType.JsonApi && apiType != WhmApiType.XmlApi) {
            throw new Error("You must define the API type for the whmapi call before you generate a request.");
        } else {
            this.apiType = apiType;
        }

        if (!this.method) {
            throw new Error("You must define a method for the whmapi call before you generate a request");
        }
    }

    /**
     * Generate the interchange object that has the pre-encoded
     * request using UAPI formatting.
     *
     * @param rule Optional parameter to specify a specific Rule we want the Request to be generated for.
     * @return {RequestInfo} Request information ready to be used by a remoting layer
     */
    generate(rule?: GenerateRule): RequestInfo {
        if (!rule) {
            rule = {
                verb: HttpVerb.POST,
                encoder: this.config.json ?
                    new JsonArgumentEncoder() :
                    new WwwFormUrlArgumentEncoder(),
            };
        }

        if (!rule.encoder) {
            rule.encoder = this.config.json ?
                new JsonArgumentEncoder() :
                new WwwFormUrlArgumentEncoder();
        }

        const argumentRule: ArgumentSerializationRule = argumentSerializationRules.getRule(rule.verb);

        let info = {
            headers: new Headers([
                {
                    name: "Content-Type",
                    value: rule.encoder.contentType,
                }
            ]),
            url: [
                "",
                this.apiType,
                this.method
            ].map(encodeURIComponent).join("/"),
            body: "",
        };

        let params: IArgument[] = [];
        this._generateArguments(params);
        this._generateSorts(params);
        this._generateFilters(params);
        this._generatePagination(params);

        let encoded = this._build(params, rule.encoder);

        if (argumentRule.dataInBody) {
            info["body"] = encoded;
        } else {
            if (rule.verb === HttpVerb.GET) {
                info["url"] += `?${encoded}`;
            } else {
                info["url"] += encoded;
            }
        }

        this.headers.forEach(header => {
            info.headers.push({
                name: header.name,
                value: header.value
            });
        });

        return info;
    }
}
