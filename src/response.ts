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
    IMetaData
} from "./metadata";

import {
    isUndefined,
    isNull
} from "lodash";

/**
 * Options for how to handle response parsing.
 */
export interface ResponseOptions {
    keepUnprocessedResponse: boolean;
}

/**
 * Types of message that can be in a response.
 */
export enum MessageType {

    /**
     * Message is an error.
     */
    Error,

    /**
     * Message is a warning.
     */
    Warning,

    /**
     * Message is informational.
     */
    Information,

    /**
     * The message type is unknown.
     */
    Unknown,
};

/**
 * Abstract structure for a message
 */
export interface IMessage {

    /**
     * Type of the message
     */
    type: MessageType,

    /**
     * Actual message
     */
    message: string,

    /**
     * Any other data related to a message
     */
    data?: any,
}

/**
 * Abstract structure of a response shared by all responses.
 */
export interface IResponse {

    /**
     * The unprocessed response from the server.
     */
    raw: any;

    /**
     * The status code returned by the API. Usually 1 for success, 0 for failure.
     */
    status: number;

    /**
     * List of messages related to the response.
     */
    messages: IMessage[];

    /**
     * Additional data returned about the request. Paging, filtering, and maybe other custom properties.
     */
    meta: IMetaData;

    /**
     * Data returned from the server for the request. This is the primary data returned.
     */
    data: any;

    /**
     * Options about how to handle the response processing.
     */
    options: ResponseOptions;
}

export let DefaultMetaData: IMetaData = {
    isPaged: false,
    isFiltered: false,
    record: 0,
    page: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    recordsBeforeFilter: 0,
    batch: false,
    properties: {},
};

/**
 * Deep cloning of a object to avoid reference overwritting.
 *
 * @param data Metadata object to be cloned.
 * @returns Cloned Metadata object.
 */
function clone(data: IMetaData): IMetaData {
    return JSON.parse(JSON.stringify(data)) as IMetaData;
}

/**
 * Base class for all response. Must be sub-classed by a real implementation.
 */
export abstract class Response implements IResponse {

    /**
      * The unprocessed response from the server.
      */
    raw: any;

    /**
      * The status code returned by the API. Usually 1 for success, 0 for failure.
      */
    status: number = 0;

    /**
      * List of messages related to the response.
      */
    messages: IMessage[] = [];

    /**
      * Additional data returned about the request. Paging, filtering, and maybe other custom properties.
      */
    meta: IMetaData = clone(DefaultMetaData);

    /**
      * Data returned from the server for the request. This is the primary data returned.
      */
    data: any;

    /**
      * Options about how to handle the response processing.
      */
    options: ResponseOptions = {
        keepUnprocessedResponse: false
    };

    /**
     * Build a new response object from the response. Note, this class should not be called
     * directly.
     * @param response Complete data passed from the server. Probably it's been parsed using JSON.parse().
     * @param options for how to handle the processing of the response data.
     */
    constructor(response: any, options?: ResponseOptions) {
        if (isUndefined(response) || isNull(response) ) {
            throw new Error("The response was unexpectedly undefined or null");
        }

        if (options) {
            this.options = options;
        }

        if (this.options.keepUnprocessedResponse) {
            this.raw = JSON.parse(JSON.stringify(response)); // deep clone
        }
    }

    /**
     * Checks if the API was successful.
     *
     * @return true if successful, false if failure.
     */
    get success(): boolean {
        return this.status > 0;
    }

    /**
     * Checks if the api failed.
     *
     * @return true if the API reports failure, true otherwise.
     */
    get failed(): boolean {
        return this.status === 0;
    }

    /**
     * Get the list of messages based on the requested type.
     *
     * @param type Type of the message to look up.
     * @return List of messages that match the filter.
     */
    private _getMessages(type: MessageType): IMessage[] {
        return this.messages.filter((message) => message.type === type);
    }

    /**
     * Get the list of error messages.
     *
     * @return List of errors.
     */
    get errors(): IMessage[] {
        return this._getMessages(MessageType.Error);
    }

    /**
     * Get the list of warning messages.
     *
     * @return List of warnings.
     */
    get warnings(): IMessage[] {
        return this._getMessages(MessageType.Warning);
    }

    /**
     * Get the list of informational messages.
     *
     * @return List of informational messages.
     */
    get infoMessages(): IMessage[] {
        return this._getMessages(MessageType.Information);
    }

    /**
     * Checks if there are any messages of a given type.
     * @param type Type of the message to check for.
     * @return true if there are messages of the requested type. false otherwise.
     */
    private _hasMessages(type: MessageType): boolean {
        return this.messages.filter((message) => message.type === type).length > 0;
    }

    /**
     * Checks if there are any error messages in the response.
     *
     * @return true if there are error messages, false otherwise.
     */
    get hasErrors(): boolean {
        return this._hasMessages(MessageType.Error);
    }

    /**
     * Checks if there are any warnings in the response.
     *
     * @return true if there are warnings, false otherwise.
     */
    get hasWarnings(): boolean {
        return this._hasMessages(MessageType.Warning);
    }

    /**
     * Checks if there are any informational messages in the response.
     *
     * @return true if there are informational messages, false otherwise.
     */
    get hasInfoMessages(): boolean {
        return this._hasMessages(MessageType.Information);
    }

    /**
     * Check if the response was paginated by the backend.
     *
     * @return true if the backend returned a page of the total records.
     */
    get isPaged(): boolean {
        return this.meta.isPaged;
    }

    /**
     * Check if the response was filtered by the backend.
     *
     * @return true if the backend filtered the records.
     */
    get isFiltered(): boolean {
        return this.meta.isFiltered;
    }
}
