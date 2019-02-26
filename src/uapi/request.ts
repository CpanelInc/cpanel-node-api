import {
    snakeCase
} from 'lodash';

import * as Perl from '../utils/perl';

import {
    SortDirection,
    SortType,
} from '../utils/sort';

import {
    FilterOperator
} from '../utils/filter';

import {
    IArgument,
} from '../utils/argument';

import {
    IPager
} from '../utils/pager';

import {
    GenerateRule,
    Request,
    IRequest,
} from '../request';

import {
    HttpVerb,
} from '../http/verb';

import {
    RequestInfo,
} from '../interchange';

import {
    ArgumentSerializationRule,
    argumentSerializationRules
} from '../argument-serializer-rules';

import {
    IArgumentEncoder,
    JsonArgumentEncoder,
    WwwFormUrlArgumentEncoder,
} from '../utils/encoders'


export class UapiRequest extends Request {

    /**
     * Build a fragment of the parameter list based on the list of name/value pairs.
     *
     * @param  {IArgument[]}      params  Parameters to serialize.
     * @param  {IArgumentEncoder} encoder Encoder to use to serialize the each parameter.
     * @return {string}                   Fragment with the serialized parameters
     */
    private _build(params: IArgument[], encoder: IArgumentEncoder): string {
        let fragment = '';
        params.forEach((arg, index, array) => {
            const isLast: boolean = index === array.length - 1;
            fragment += encoder.encode(arg.name, arg.value, isLast);
        });
        return encoder.separatorStart +
               fragment +
               encoder.separatorEnd;
    }

    /**
     * Generates the arguments for the request.
     *
     * @param  {IArgument[]} params List of parameters to adjust based on the sort rules in the Request.
     */
    private _generateArguments(params: IArgument[]): void {
        this.arguments.forEach(argument => params.push(argument));
    }

    /**
     * Generates the sort parameters for the request.
     *
     * @param  {IArgument[]} params List of parameters to adjust based on the sort rules in the Request.
     */
    private _generateSorts(params: IArgument[]): void {
        this.sorts.forEach((sort, index) => {
            if(index === 0) {
                params.push({ name: 'api.sort', value: Perl.fromBoolean(true) })
            }
            params.push({ name: 'api.sort_column_' + index,  value: sort.column });
            params.push({ name: 'api.sort_reverse_' + index, value: Perl.fromBoolean(sort.direction !== SortDirection.Ascending) });
            params.push({ name: 'api.sort_method_' + index,  value: snakeCase(SortType[sort.type]) });
        });
    }

    /**
     * Lookup the correct name for the filter operator
     *
     * @param {FilterOperator} operator
     * @returns {string}
     */
    private _lookupFilterOperator(operator: FilterOperator): string {
        switch(operator) {
            case FilterOperator.GreaterThanUnlimited:
                return "gt_handle_unlimited";
            case FilterOperator.GreaterThan:
                return "gt";
            case FilterOperator.LessThanUnlimited:
                return "lt_handle_unlimited";
            case FilterOperator.LessThan:
                return "lt";
            case FilterOperator.NotEqual:
                return "ne";
            case FilterOperator.Equal:
                return "eq";
            case FilterOperator.Defined:
                return "defined";
            case FilterOperator.Undefined:
                return "undefined";
            case FilterOperator.Matches:
                return "matches";
            case FilterOperator.Ends:
                return "ends";
            case FilterOperator.Begins:
                return "begins";
            case FilterOperator.Contains:
                return "contains";
            default:
                const key = FilterOperator[operator];
                throw new Error(`Unrecoginzed FilterOperator ${key} for UAPI`)
        }
    }

    /**
     * Generate the filter parameters if any.
     *
     * @param  {IArgument[]} params List of parameters to adjust based on the filter rules provided.
     */
    private _generateFilters(params: IArgument[]) : void {
        this.filters.forEach((filter, index) => {
            params.push({ name: 'api.filter_column_' + index,  value: filter.column });
            params.push({ name: 'api.filter_type_' + index,  value: this._lookupFilterOperator(filter.operator) });
            params.push({ name: 'api.filter_term_' + index, value: filter.value });
        });
    }

    /**
     * In UAPI we request the starting record not the starting page. This translates
     * the page and page size into the correct starting record.
     */
    private _traslatePageToStart(pager: IPager) {
        return ((pager.page - 1) * pager.pageSize) + 1;
    }

    /**
     * Generate the pager request parameters if any.
     *
     * @param  {IArgument[]} params List of parameters to adjust based on the pagination rules.
     */
    private _generatePagination(params: IArgument[]): void {
        if (!this.usePager) {
            return;
        }

        let allPages = this.pager.all();
        params.push({
            name: 'api.paginate',
            value: Perl.fromBoolean(true),
        });
        params.push({
            name: 'api.paginate_start',
            value: allPages ? -1 : this._traslatePageToStart(this.pager)
        });
        if(!allPages) {
            params.push({
                name: 'api.paginate_size',
                value: this.pager.pageSize
            });
        }
    }

    /**
     * Generate any additional parameters from the configuration data.
     *
     * @param  {IArgument[]} params List of parameter to adjust based on the configuration.
     */
    private _generateConfiguration(params: IArgument[]): void {
        if (this.config && this.config['analytics']) {
            params.push({
                name: 'api.analytics',
                value: Perl.fromBoolean(this.config.analytics)
            });
        }
    }

    /**
     * Create a new uapi request.
     *
     * @param {IRequest} init   Optional request object used to initialize this object.
     */
    constructor(init?: IRequest ) {
        super(init);
    }

    /**
     * Generate the interchange object that has the pre-encoded
     * request using UAPI formatting.
     *
     * @param  {HttpVerb}    verb
     * @param  {IArgumentEncoder}    [encoder] optional parameter encoder if you don't want to use the default encoder
     * @return {RequestInfo} Request information ready to be used by a remoting layer
     */
    generate(rule? : GenerateRule): RequestInfo {

        // Needed for or pure js clients since they don't get the compiler checks
        if(!this.namespace) {
            throw new Error('You must define a namespace for the uapi call before you generate a request');
        }
        if(!this.method) {
            throw new Error('You must define a method for the uapi call before you generate a request');
        }

        if (!rule) {
            rule = {
                verb: HttpVerb.POST,
                encoder: this.config.json ?
                    new JsonArgumentEncoder() :
                    new WwwFormUrlArgumentEncoder(),
            };
        }

        if(!rule.encoder) {
            rule.encoder = this.config.json ?
                new JsonArgumentEncoder() :
                new WwwFormUrlArgumentEncoder();
        }

        const argumentRule: ArgumentSerializationRule = argumentSerializationRules.getRule(rule.verb);

        let info = {
            headers: [
                {
                    name: 'Content-Type',
                    value: rule.encoder.contentType,
                }
            ],
            url: [
                '',
                'execute',
                this.namespace,
                this.method
            ].map(encodeURIComponent).join('/'),
            body: '',
        };

        let params: IArgument[] = [];
        this._generateArguments(params);
        this._generateSorts(params);
        this._generateFilters(params);
        this._generatePagination(params);
        this._generateConfiguration(params);

        let encoded = this._build(params, rule.encoder);

        if (argumentRule.dataInBody) {
            info['body'] = encoded;
        } else {
            info['url'] += encoded;
        }

        return info as RequestInfo;
    }
}
