import {
    IMetaData
} from "../metadata";

import {
    MessageType,
    Response,
    ResponseOptions
} from "../response";

/**
 * This class will extract the available meta data from the WhmApi format into a standard format for JavaScript developers.
 */
export class WhmApiMetaData implements IMetaData {

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
     * Indicates the response was the result of a batch api.
     */
    batch: boolean = false;

    /**
     * A collection of the other less common or custom WhmApi meta-data properties.
     */
    properties: { [index: string]: any } = {};

    /**
     * Build a new MetaData object from the metadata response from the server.
     *
     * @param {any} meta WhmApi metadata object.
     */
    constructor(meta: any) {

        // Handle pagination
        if (meta.chunk) {
            this.isPaged = true;
            this.record = parseInt(meta.chunk.start, 10) || 0;
            this.page = parseInt(meta.chunk.current, 10) || 0;
            this.pageSize = parseInt(meta.chunk.size, 10) || 0;
            this.totalPages = parseInt(meta.chunk.chunks, 10) || 0;
            this.totalRecords = parseInt(meta.chunk.records, 10) || 0;
        }

        // Handle filtering
        if (meta.filter) {
            this.isFiltered = true;
            this.recordsBeforeFilter = parseInt(meta.filter.filtered, 10) || 0;
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
 * Parser that will convert a WhmApi wire formatted object into a standard response object for JavaScript developers.
 */
export class WhmApiResponse extends Response {

    /**
     * Parse out the status from the response.
     *
     * @param    resMetadata Metadata returned in response object from the backend.
     * @return   Number indicating success or failure. > 1 success, 0 failure.
     */
    private _parseStatus(resMetadata: any): void {
        this.status = 0; // Assume it failed.
        if (typeof (resMetadata.result) === "undefined") {
            throw new Error("The response should have a numeric status property indicating the api succeeded (>0) or failed (=0)");
        }
        this.status = parseInt(resMetadata.result, 10);
    }

    /**
     * Parse out the messages from the response.
     *
     * @param {any} resMetadata Metadata returned in response object from the backend.
     */
    private _parseMessages(resMetadata: any): void {
        if (!resMetadata.result) {
            const errors: any[] = [ resMetadata.reason ];
            if (errors && errors.length) {
                errors.forEach((error: string) => {
                    this.messages.push({
                        type: MessageType.Error,
                        message: error,
                    });
                });
            }
        }

        // TODO: If there are any other types of messages sent. They need to be handled here (like non error messages returned via API call.)
    }

    /**
     * WHM API v1 usually puts list data into a single-key hash.
     * This isn't useful for us, so we get rid of the extra hash.
     *
     * @method _reduce_list_data
     * @private
     * @param {object} data The "data" member of the API JSON response
     * @return {object|array} The data that the API returned
     */
    private _reduce_list_data(data: any): any {
        if ((typeof data === "object") && !(data instanceof Array)) {
            const keys = Object.keys(data);
            if (keys.length === 1) {
                let maybe_data = data[keys[0]];
                if (maybe_data) {
                    if (maybe_data instanceof Array) {
                        data = maybe_data;
                    }
                } else {
                    data = [];
                }
            }
        }

        return data;
    };

    /**
     * Parse out the status, data and metadata from a WhmApi response into the abstract Response and IMetaData structures.
     *
     * @param {any}             response  Raw response from the server. Its just been JSON.parse() at this point.
     * @param {ResponseOptions} [options] Options on how to handle parsing of the response.
     */
    constructor(
        response: any,
        options?: ResponseOptions
    ) {
        super(response, options);

        if (response) {
            if (response.metadata) {
                this._parseStatus(response.metadata);
                this._parseMessages(response.metadata);
                this.meta = new WhmApiMetaData(response.metadata);
            }
        } else {
            throw new Error("Response object should be defined.");
        }

        // TODO: Add parsing by specific types to take care of renames and type coercion.
        this.data = this._reduce_list_data(response.data);
    }
}
