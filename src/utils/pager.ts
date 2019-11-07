export const DEFAULT_PAGE_SIZE = 20;

/**
 * When passed in the pageSize, will request all available records in a single page. Note: The backend process may not honor this request.
 */
export const ALL = Number.POSITIVE_INFINITY;

/**
 * Interface for a pagination request.
 */
export interface IPager {

    /**
     * One based index of the pages of data.
     */
    page: number;

    /**
     * Number of elements a page of data is composed of. This is the requested page size, if there is less than this number of records in the set, only the remaining records are returned.
     */
    pageSize: number;
}

/**
 * Defines a pagination request for an API.
 */
export class Pager implements IPager {

    /**
     * One based index of the pages of data.
     */
    page: number;

    /**
     * Number of elements a page of data is composed of. This is the requested page size, if there is less than this number of records in the set, only the remaining records are returned.
     */
    pageSize: number;

    /**
     * Create a new pagination object.
     *
     * @param page Page to request. From 1 .. n where n is the set.length % pageSize. Defaults to 1.
     * @param pageSize Number of records to request in a page of data. Defaults to DEFAULT_PAGE_SIZE.
     *                          If the string 'all' is passed, then all the records are requested. Note: The back end
     *                          system may still impose page size limits in this case.
     */
    constructor(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) {
        if (page <= 0) {
            throw new Error("The page must be 1 or greater. This is the logical page, not a programming index.");
        }

        if (pageSize <= 0) {
            throw new Error("The pageSize must be set to 'ALL' or a number > 0");
        }

        this.page = page;
        this.pageSize = pageSize;
    }

    /**
     * Check if the pagesize is set to ALL.
     *
     * @return true if requesting all records, false otherwise.
     */
    all(): boolean {
        return this.pageSize === ALL;
    }
}
