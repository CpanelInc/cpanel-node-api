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


type EncodeMethod = (item: IArgument, last: boolean) => string;
type ExpandMethod = (item: any, index:number, last: boolean) => string;

export class UapiRequest extends Request {

    /**
     * Build a fragment of the parameter list based on the list of name/value pairs.
     *
     * @param  {IArgument[]}  list   Parameters to add
     * @param  {EncodeMethod} encode Helper function to pass the name/value to the encoder.
     * @return {string}              Fragment with the serialized parameters
     */
    private _buildFragment(list: IArgument[], encode: EncodeMethod): string {
        let fragment = '';
        list.forEach((arg, index, array) => {
            const isLast: boolean = index === array.length - 1;
            fragment += encode(arg, isLast);
        });
        return fragment;
    }

    /**
     * Expand the list of parameters based on the list of things passed. This will generate
     * index parameter entries for each object in the original list based on the rule provided
     * in the expand helper method.
     *
     * @param  {any[]}        list   Objects that get expanded. In our case probably Sort[] or Filter[].
     * @param  {ExpandMethod} expand Expand each item in the list into a list of name/value pairs and encode them into a fragment.
     * @return {string}              Fragment with the serialized parameters.
     */
    private _index(list: any[], expand: ExpandMethod): string {
        let fragment = '';
        list.forEach((arg, index, array) => {
            const isLast: boolean = index === array.length - 1;
            fragment += expand(arg, index, isLast);
        });
        return fragment;
    }

    /**
     * Generates the arguments for the request.
     *
     * @param  {ArgumentSerializationRule} rule
     * @return {string}
     */
    private _generateArguments(encoder: IArgumentEncoder): string {
        return this._buildFragment(
            this.arguments,
            (arg: any, isLast: boolean) => {
                return encoder.encode(arg.name, arg.value, isLast)
            }
        );
    }

    /**
     * Generates the arguments for the request.
     *
     * @param  {ArgumentSerializationRule} rule
     * @return {string}
     */
    private _generateSorts(encoder: IArgumentEncoder): string {
        return this._index(
            this.sorts,
            (arg: any, index: number, isLastSort: boolean) => {
                var sorts = [
                    { name: 'api.sort_column_' + index,  value: arg.column },
                    { name: 'api.sort_reverse_' + index, value: Perl.fromBoolean(arg.direction !== SortDirection.Ascending) },
                    { name: 'api.sort_method_' + index,  value: snakeCase(SortType[arg.type]) },
                ];
                if(index === 0) {
                    sorts.unshift({ name: 'api.sort', value: Perl.fromBoolean(true) })
                }
                return this._buildFragment(sorts, (arg: any, isLast: boolean) => {
                    return encoder.encode(arg.name, arg.value, isLastSort && isLast)
                });
            }
        );
    }

    /**
     * Lookup the correct name for the filter operator
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
     * @param  {IArgumentEncoder} encoder
     * @return {string}
     */
    private _generateFilters(encoder: IArgumentEncoder) : string {
        return this._index(
            this.filters,
            (arg: any, index: number, isLastFilter: boolean) => {
                return this._buildFragment([
                    { name: 'api.filter_column_' + index,  value: arg.column },
                    { name: 'api.filter_type_' + index,  value: this._lookupFilterOperator(arg.operator) },
                    { name: 'api.filter_term_' + index, value: arg.value },
                ], (arg: any, isLast: boolean) => {
                    return encoder.encode(arg.name, arg.value, isLastFilter && isLast)
                });
            }
        );
    }

    /**
     * In UAPI we request the starting record not the starting page. This translates
     * the page and page size into the correct starting record.
     */
    private _traslatePageToStart(pager: IPager) {
        return ((pager.page - 1) * pager.pageSize) + 1;
    }

    /**
     * Generate the pager request parameters if any
     * @param  {IArgumentEncoder} encoder
     * @return {string}
     */
    private _generatePagination(encoder: IArgumentEncoder): string {
        let allPages = this.pager.all();
        let params: IArgument[] = [
            {
                name: 'api.paginate',
                value: Perl.fromBoolean(true),
            },
            {
                name: 'api.paginate_start',
                value: allPages ? -1 : this._traslatePageToStart(this.pager)
            },
        ];

        if (!allPages) {
            params.push({
                name: 'api.paginate_size',
                value: this.pager.pageSize
            });
        }

        return this._buildFragment(
            params,
            (arg: any, isLast: boolean) => {
                return encoder.encode(arg.name, arg.value, isLast)
            }
        );
    }

    /**
     * Generate any additional parameters from the configuration data.
     *
     * @param  {IArgumentEncoder} encoder
     * @return {string}
     */
    private _generateConfiguration(encoder: IArgumentEncoder): string {
        let params: IArgument[] = [];
        if (this.config && this.config['analytics']) {
            params.push({
                name: 'api.analytics',
                value: Perl.fromBoolean(this.config.analytics)
            });
        }
        return this._buildFragment(
            params,
            (arg: any, isLast: boolean) => {
                return encoder.encode(arg.name, arg.value, isLast)
            }
        );
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
                encoder: this.config.json ? new JsonArgumentEncoder() : new WwwFormUrlArgumentEncoder(),
            }
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

        let params:string[] = [];
        if(this.arguments.length) {
            params.push(this._generateArguments(rule.encoder));
        }

        if(this.sorts.length) {
            params.push(this._generateSorts(rule.encoder));
        }

        if(this.filters.length) {
            params.push(this._generateFilters(rule.encoder));
        }

        if (this.usePager) {
            params.push(this._generatePagination(rule.encoder));
        }

        let encoded;
        if (encoded = this._generateConfiguration(rule.encoder)) {
            params.push(encoded);
        }

        let allArgs = rule.encoder.separatorStart +
                      params.join(rule.encoder.recordSeparator) +
                      rule.encoder.separatorEnd;

        if (argumentRule.dataInBody) {
            info['body'] = allArgs;
        } else {
            info['url'] += allArgs;
        }

        return info as RequestInfo;
    }
}
