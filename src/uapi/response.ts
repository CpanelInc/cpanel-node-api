import {
    IMetaData
} from "../metadata";

import {
    MessageType,
    Response,
    ResponseOptions
} from "../response";

/**
 * This class will extract the available meta data from the UAPI format into a standard format for JavaScript developers.
 */
export class UapiMetaData implements IMetaData {

    /**
     * Indicates if the data is paged.
     */
    isPaged: boolean = false;

    /**
     * The record number of the first record of a page.
     */
    record: number = 0;

    /**
     * The current page.
     */
    page: number = 0;

    /**
     * The page size of the returned set.
     */
    pageSize: number = 0;

    /**
     * The total number of records available on the backend.
     */
    totalRecords: number = 0;

    /**
     * The total number of pages of records on the backend.
     */
    totalPages: number = 0;

    /**
     * Indicates if the data set if filtered.
     */
    isFiltered: boolean = false;

    /**
     * Number of records available before the filter was processed.
     */
    recordsBeforeFilter: number = 0;

    /**
     * Number of records removed by the filter.
     */
    recordsFiltered: number = 0;

    /**
     * Indicates the response was the result of a batch api.
     */
    batch: boolean = false;

    /**
     * A collection of the other less common or custom UAPI meta-data properties.
     */
    properties: { [index: string]: any } = {};

    /**
     * Build a new MetaData object from the metadata response from the server.
     *
     * @param {any} meta Uapi metadata object.
     */
    constructor(meta: any) {

        // Handle pagination
        if (meta.paginate) {
            this.isPaged = true;
            this.record = parseInt(meta.paginate.start_result, 10) || 0;
            this.page = parseInt(meta.paginate.current_page, 10) || 0;
            this.pageSize = parseInt(meta.paginate.results_per_page, 10) || 0;
            this.totalPages = parseInt(meta.paginate.total_pages, 10) || 0;
            this.totalRecords = parseInt(meta.paginate.total_results, 10) || 0;
        }

        // Handle filtering
        if (meta.filter) {
            this.isFiltered = true;
            this.recordsBeforeFilter = parseInt(meta.filter.records_before_filter, 10) || 0;
        }

        // Get any other custom metadata properties off the object
        let builtinSet = new Set(["paginate", "filter"]);
        Object.keys(meta)
            .filter((key: string) => !builtinSet.has(key))
            .forEach((key: string) => {
                this.properties[key] = meta[key];
            });
    }
}


/**
 * Parser that will convert a UAPI wire formated object into a standard response object for JavaScript developers.
 */
export class UapiResponse extends Response {

    /**
     * Parse out the status from the response.
     *
     * @param  {any}    response Raw response object from the backend. Already passed thru JSON.parse().
     * @return {number}          Number indicating success or failure. > 1 success, 0 failure.
     */
    private _parseStatus(response: any): void {
        this.status = 0; // Assume it failed.
        if (typeof (response.status) === "undefined") {
            throw new Error("The response should have a numeric status property indicating the api succeeded (>0) or failed (=0)");
        }
        this.status = parseInt(response.status, 10);
    }

    /**
     * Parse out the messages from the response.
     *
     * @param {any} response
     */
    private _parseMessages(response: any): void {
        if ("errors" in response ) {
            const errors = response.errors;
            if ( errors && errors.length ) {
                errors.forEach((error: string) => {
                    this.messages.push({
                        type: MessageType.Error,
                        message: error,
                    });
                });
            }
        }

        if ("messages" in response) {
            var messages = response.messages;
            if ( messages ) {
                messages.forEach((message: string) => {
                    this.messages.push({
                        type: MessageType.Information,
                        message: message,
                    });
                });
            }
        }
    }

    /**
     * Parse out the status, data and metadata from a Uapi response into the abstract Response and IMetaData structures.
     *
     * @param {any}             response  Raw response from the server. Its just been JSON.parse() at this point.
     * @param {ResponseOptions} [options] Options on how to handle parsing of the response.
     */
    constructor(
        response: any,
        options?: ResponseOptions
    ) {
        super(response, options);

        this._parseStatus(response);
        this._parseMessages(response);

        if (!response || !response.hasOwnProperty("data")) {
            throw new Error("Expected response to contain a data property, but it is missing");
        }

        // TODO: Add parsing by specific types to take care of renames and type coercion.
        this.data = response.data;

        if (response.metadata) {
            this.meta = new UapiMetaData(response.metadata);
        }
    }
}
