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
     * Message is an warning.
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
     * @type {string}
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
     * The status code returned by the api. Usually 1 for success, 0 for failure.
     */
    status: number;

    /**
     * List of messages related to the response.
     */
    messages: IMessage[];

    /**
     * Additional data returned about the request. Paging, Filtering, maybe other custom properties.
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
    recordsFiltered: 0,
    batch: false,
    properties: {},
};

/**
 * Deep cloning of a object to avoid reference overwritting.
 *
 * @param {IMetaData} data [description]
 * @returns {IMetaData}
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
      * The status code returned by the api. Usually 1 for success, 0 for failure.
      */
    status: number = 0;

    /**
      * List of messages related to the response.
      */
    messages: IMessage[] = [];

    /**
      * Additional data returned about the request. Paging, Filtering, maybe other custom properties.
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
     * @param {any}             response  Complete data passed from the server. Probably its been parsed using JSON.parse().
     * @param {ResponseOptions} [options] Optional options for how to handle the processing of the response data.
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
     * Checks if the api was successful.
     *
     * @return {boolean} true if successful, false if failure.
     */
    get success(): boolean {
        return this.status > 0;
    }

    /**
     * Checks if the api failed.
     *
     * @return {boolean} ture if the api reports failure, true otherwise.
     */
    get failed(): boolean {
        return this.status === 0;
    }

    /**
     * Get the list of message based on the requested type.
     *
     * @param  {MessageType} type Type of the message to lookup
     * @return {IMessage[]}       List of messages that match the filter.
     */
    private _getMessages(type: MessageType): IMessage[] {
        return this.messages.filter((message) => message.type === type);
    }

    /**
     * Get the list of error messages.
     *
     * @return {IMessage[]} List of errors.
     */
    get errors(): IMessage[] {
        return this._getMessages(MessageType.Error);
    }

    /**
     * Get the list of warning messages.
     *
     * @return {IMessage[]} List of warnings.
     */
    get warnings(): IMessage[] {
        return this._getMessages(MessageType.Warning);
    }

    /**
     * Get the list of informational messages.
     *
     * @return {IMessage[]} List of informational messages.
     */
    get infoMessages(): IMessage[] {
        return this._getMessages(MessageType.Information);
    }

    /**
     * Checks if there are any messages of a given type.
     * @param  {MessageType} type Type of the message to check for.
     * @return {boolean}          true if there are messages of the requested type. false otherwise.
     */
    private _hasMessages(type: MessageType): boolean {
        return this.messages.filter((message) => message.type === type).length > 0;
    }

    /**
     * Checks if there are any error messages in the response.
     *
     * @return {boolean} true if there are error messages, false otherwise.
     */
    get hasErrors(): boolean {
        return this._hasMessages(MessageType.Error);
    }

    /**
     * Checks if there are any warnings in the response.
     *
     * @return {boolean} true if there are warnings, false otherwise.
     */
    get hasWarnings(): boolean {
        return this._hasMessages(MessageType.Warning);
    }

    /**
     * Checks if there are any informational messages in the response.
     *
     * @return {boolean} true if there are informational messages, false otherwise.
     */
    get hasInfoMessages(): boolean {
        return this._hasMessages(MessageType.Information);
    }

    /**
     * Check if the response was paginated by the backend.
     *
     * @return {boolean} true if the backend returned a page of the total records.
     */
    get isPaged(): boolean {
        return this.meta.isPaged;
    }

    /**
     * Check if the response was filtered by the backend.
     *
     * @return {boolean} true if the backend filtered the records.
     */
    get isFiltered(): boolean {
        return this.meta.isFiltered;
    }
}
