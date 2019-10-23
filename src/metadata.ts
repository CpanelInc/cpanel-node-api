/**
 * Common interface for metadata.
 */
export interface IMetaData {

    /**
         * Indicates if the data is paged.
         */
        isPaged: boolean;

        /**
         * The record number of the first record of a page.
         */
        record: number;

        /**
         * The current page.
         */
        page: number;

        /**
         * The page size of the returned set.
         */
        pageSize: number;

        /**
         * The total number of records available on the backend.
         */
        totalRecords: number;

        /**
         * The total number of pages of records on the backend.
         */
        totalPages: number;

        /**
         * Indicates if the data set if filtered.
         */
        isFiltered: boolean;

        /**
         * Number of records available before the filter was processed.
         */
        recordsBeforeFilter: number;

        /**
         * Indicates the response was the result of a batch api.
         */
        batch: boolean;

        /**
         * A collection of the other less common or custom UAPI meta-data properties.
         */
        properties: { [index: string]: string };
}
