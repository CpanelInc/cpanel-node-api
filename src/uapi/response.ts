// MIT License
//
// Copyright 2021 cPanel L.L.C.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
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
 * This class will extract the available metadata from the UAPI format into a standard format for JavaScript developers.
 */
export class UapiMetaData implements IMetaData {
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
     * A collection of the other less common or custom UAPI metadata properties.
     */
    properties: { [index: string]: any } = {};

    /**
     * Build a new MetaData object from the metadata response from the server.
     *
     * @param meta UAPI metadata object.
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
            this.recordsBeforeFilter =
                parseInt(meta.filter.records_before_filter, 10) || 0;
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
 * Parser that will convert a UAPI wire-formated object into a standard response object for JavaScript developers.
 */
export class UapiResponse extends Response {
    /**
     * Parse out the status from the response.
     *
     * @param  response Raw response object from the backend. Already passed through JSON.parse().
     * @return Number indicating success or failure. > 1 success, 0 failure.
     */
    private _parseStatus(response: any): void {
        this.status = 0; // Assume it failed.
        if (typeof response.status === "undefined") {
            throw new Error(
                "The response should have a numeric status property indicating the API succeeded (>0) or failed (=0)",
            );
        }
        this.status = parseInt(response.status, 10);
    }

    /**
     * Parse out the messages from the response.
     *
     * @param response The response object sent by the API method.
     */
    private _parseMessages(response: any): void {
        if ("errors" in response) {
            const errors = response.errors;
            if (errors && errors.length) {
                errors.forEach((error: string) => {
                    this.messages.push({
                        type: MessageType.Error,
                        message: error,
                    });
                });
            }
        }

        if ("messages" in response) {
            const messages = response.messages;
            if (messages) {
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
     * Parse out the status, data and metadata from a UAPI response into the abstract Response and IMetaData structures.
     *
     * @param response  Raw response from the server. It's just been JSON.parse() at this point.
     * @param Options on how to handle parsing of the response.
     */
    constructor(response: any, options?: ResponseOptions) {
        super(response, options);

        this._parseStatus(response);
        this._parseMessages(response);

        if (
            !response ||
            !Object.prototype.hasOwnProperty.call(response, "data")
        ) {
            throw new Error(
                "Expected response to contain a data property, but it is missing",
            );
        }

        // TODO: Add parsing by specific types to take care of renames and type coercion.
        this.data = response.data;

        if (response.metadata) {
            this.meta = new UapiMetaData(response.metadata);
        }
    }
}
