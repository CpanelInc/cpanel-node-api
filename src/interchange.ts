/**
 * Http Header Abstractions
 */
export interface Header {

    /**
     * Name of the header
     */
    name: string;

    /**
     * Value of the header
     */
    value: string;
}

/**
 * Abstract data structure used to pass rendered API information to remoting layer.
 */
export interface RequestInfo {

    /**
     * List of headers for the request
     */
    headers: Header[];

    /**
     * Url use to make the request.
     */
    url: string;

    /**
     * Body of the request.
     */
    body: string;
}
