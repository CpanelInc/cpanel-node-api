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

import { IMetaData } from "../metadata";

import { MessageType, Response, ResponseOptions } from "../response";

/**
 * This class will extract the available metadata from the WHM API format into a standard format for JavaScript developers.
 */
export class WhmApiMetaData implements IMetaData {
    /**
     * Indicates if the data is paged.
     */
    isPaged = false;

    /**
     * The record number of the first record of a page.
     */
    record = 0;

    /**
     * The current page.
     */
    page = 0;

    /**
     * The page size of the returned set.
     */
    pageSize = 0;

    /**
     * The total number of records available on the backend.
     */
    totalRecords = 0;

    /**
     * The total number of pages of records on the backend.
     */
    totalPages = 0;

    /**
     * Indicates if the data set if filtered.
     */
    isFiltered = false;

    /**
     * Number of records available before the filter was processed.
     */
    recordsBeforeFilter = 0;

    /**
     * Indicates the response was the result of a batch API.
     */
    batch = false;

    /**
     * A collection of the other less-common or custom WHM API metadata properties.
     */
    properties: { [index: string]: any } = {};

    /**
     * Build a new MetaData object from the metadata response from the server.
     *
     * @param meta WHM API metadata object.
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
        const builtinSet = new Set(["paginate", "filter"]);
        Object.keys(meta)
            .filter((key: string) => !builtinSet.has(key))
            .forEach((key: string) => {
                this.properties[key] = meta[key];
            });
    }
}

/**
 * Parser that will convert a WHM API wire-formatted object into a standard response object for JavaScript developers.
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
        if (typeof resMetadata.result === "undefined") {
            throw new Error(
                "The response should have a numeric status property indicating the API succeeded (>0) or failed (=0)"
            );
        }
        this.status = parseInt(resMetadata.result, 10);
    }

    /**
     * Parse out the messages from the response.
     *
     * @param resMetadata Metadata returned in response object from the backend.
     */
    private _parseMessages(resMetadata: any): void {
        if (!resMetadata.result) {
            const errors: any[] = [resMetadata.reason];
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
     * WHM API 1 usually puts list data into a single-key hash.
     * This isn't useful for us, so we get rid of the extra hash.
     *
     * @method _reduce_list_data
     * @private
     * @param data The "data" member of the API JSON response
     * @return The reduced data object.
     */
    private _reduce_list_data(data: any): any {
        if (typeof data === "object" && !(data instanceof Array)) {
            const keys = Object.keys(data);
            if (keys.length === 1) {
                const maybe_data = data[keys[0]];
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
    }

    /**
     * Parse out the status, data and metadata from a WHM API response into the abstract Response and IMetaData structures.
     *
     * @param response Raw response from the server. It's just been JSON.parse() at this point.
     * @param Options On how to handle parsing of the response.
     */
    constructor(response: any, options?: ResponseOptions) {
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
