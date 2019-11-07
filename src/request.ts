import { IArgument, Argument } from "./utils/argument";
import { IFilter, Filter } from "./utils/filter";
import { IPager, Pager } from "./utils/pager";
import { ISort, Sort } from "./utils/sort";
import { RequestInfo } from "./interchange";
import { IArgumentEncoder } from "./utils/encoders";
import { HttpVerb } from "./http/verb";

/**
 * Rule used to convert a request to the interchange format
 */
export interface GenerateRule {

    /**
     * Http verb
     */
    verb:     HttpVerb | string;

    /**
     * Specific Argument Encoder
     */
    encoder:  IArgumentEncoder;
}

/**
 * Other top level options for the construction of the request.
 */
export interface IRequestConfiguration {

    /**
     * Enable analytics for the request
     */
    analytics?: boolean;

    /**
     * Encode the arguments as a JSON object
     */
    json?:      boolean;
}

/**
 * Interface for developers that just want to pass a object literal
 */
export interface IRequest {

    /**
     * Namespace where the api call lives
     */
    namespace?: string;

    /**
     * Method name of the api call.
     */
    method: string;

    /**
     * Optional list of arguments for the api call. You can use types
     *   * Argument or IArgument
     */
    arguments?: IArgument[];

    /**
     * Optional list of sort rules to pass to the api call.
     */
    sorts?: ISort[];

    /**
     * Optional list of filter rules to pass to the api call.
     */
    filters?: IFilter[];

    /**
     * Optional list of column to include with the response to the api call.
     */
    columns?: string[];

    /**
     * Optional pager rule to pass to the api.
     */
    pager?: IPager;

    /**
     * Optional additional configuration for the request.
     */
    config?: IRequestConfiguration;
}

/**
 * Extra information about the request that generates the request.
 */
export interface IRequestMeta {

    /**
     * Request object that generated the RequestInfo object.
     * @type {Request}
     */
    request: Request;
}

/**
 * Extra information about the batch request that generates the request.
 */
export interface IBatchRequestMeta {

    /**
     * List of abstract request objects that make up the batch that generated the RequestInfo object.
     */
    requests: Request[];
}

/**
 * Abstract base class for all Request object. Developers should
 * create a subclass of this that implements the generate() method.
 */
export abstract class Request {

    /**
     * Namespace where the api call lives
     * @type {string}
     */
    public namespace: string = "";

    /**
     * Method name of the api call.
     * @type {string}
     */
    public method: string = "";

    /**
     * Optional list of arguments for the api call.
     * @type {IArgument[]}
     */
    public arguments: IArgument[] = [];

    /**
     * Optional list of sort rules to pass to the api call.
     */
    public sorts: Sort[] = [];

    /**
     * Optional list of filter rules to pass to the api call.
     */
    public filters: Filter[] = [];

    /**
     * Optional list of column to include with the response to the api call.
     */
    public columns: string[] = [];

    /**
     * Optional pager rule to pass to the api.
     */
    public pager: Pager = new Pager();


    private _usePager: boolean = false;

    /**
     * Use the pager only if true.
     */
    public get usePager(): boolean {
        return this._usePager;
    }

    /**
     * Default configuration object.
     */
    private defaultConfig: IRequestConfiguration = {
        analytics: false,
        json: false,
    }

    /**
     * Optional configuration information
     */
    public config: IRequestConfiguration = this.defaultConfig;

    /**
     * Create a new request.
     *
     * @param init   Optional request object used to initialize this object.
     */
    constructor(init?: IRequest ) {
        if (init) {
            this.method = init.method;
            if (init.namespace) {
                this.namespace = init.namespace;
            }

            if (init.arguments) {
                init.arguments.forEach((argument) => {
                    this.addArgument(argument);
                });
            }

            if (init.sorts) {
                init.sorts.forEach((sort) => {
                    this.addSort(sort);
                });
            }

            if (init.filters) {
                init.filters.forEach((filter) => {
                    this.addFilter(filter);
                });
            }

            if (init.columns) {
                init.columns.forEach(column => this.addColumn(column));
            }

            if (init.pager) {
                this.paginate(init.pager);
            }

            if (init.config) {
                this.config = init.config;
            } else {
                this.config = this.defaultConfig;
            }
        }
    }

    /**
     * Add an argument to the request.
     *
     * @param argument
     * @return Updated Request object.
     */
    addArgument(argument: IArgument): Request {
        if (argument instanceof Argument) {
            this.arguments.push(argument);
        } else {
            this.arguments.push(new Argument(argument.name, argument.value));
        }
        return this;
    }

    /**
     * Add sorting rule to the request.
     *
     * @param sort Sort object with sorting information.
     * @return Updated Request object.
     */
    addSort(sort: ISort): Request {
        if (sort instanceof Sort) {
            this.sorts.push(sort);
        } else {
            this.sorts.push(new Sort(sort.column, sort.direction, sort.type));
        }
        return this;
    }

    /**
     * Add a filter to the request.
     *
     * @param filter Filter object with filter information.
     * @return Updated Request object.
     */
    addFilter(filter: IFilter): Request {
        if (filter instanceof Filter) {
            this.filters.push(filter);
        } else {
            this.filters.push(new Filter(filter.column, filter.operator, filter.value));
        }
        return this;
    }

    /**
     * Add a column to include in the request. Not if no columns are specified, all columns are retrieved.
     *
     * @param name Name of a column
     * @return Updated Request object.
     */
    addColumn(column: string): Request {
        this.columns.push(column);
        return this;
    }

    /**
     * Set the pager setting for the request.
     *
     * @param pager Pager object with pagination information.
     * @return Updated Request object.
     */
    paginate(pager: IPager): Request {
        if (pager instanceof Pager) {
            this.pager = pager;
        } else {
            this.pager = new Pager(pager.page, pager.pageSize || 20);
        }
        this._usePager = true;
        return this;
    }

    /**
     * Generate the request interchange information. Note: This method is abstract and
     * must be implemented in derived request generators.
     *
     * @param Rule used to create the interchange. If not provided, implementations
     *                               should select the rule to use.
     * @return Interchange data.
     */
    abstract generate(rule?: GenerateRule): RequestInfo;
}
