/**
 * Sorting direction. The SortType and SortDirection combine to define the sorting for collections returned.
 */
export enum SortDirection {

    /**
     * Records are sorted from low value to high value based on the SortType
     */
    Ascending,

    /**
     * Records are sorted from high value to low value based on the SortType
     */
    Descending,
}

/**
 * Sorting type. Defines how values are compared.
 */
export enum SortType {

    /**
     * Uses character by character comparison
     */
    Lexicographic,

    /**
     * Special rule for handing IPv4 comparison. This takes into account the segments
     */
    Ipv4,

    /**
     * Assumes the values are numeric and compares them using number rules.
     */
    Numeric,

    /**
     * Special rule for certain data where 0 is considered unlimited.
     */
    NumericZeroAsMax
}

/**
 * Sort interface
 */
export interface ISort {

    /**
     * Column name to sort on.
     */
    column: string;

    /**
     * Direction to apply to sort: ascending or descending
     */
    direction: SortDirection;

    /**
     * Sort type applied. See SortType for information on available sorting rules.
     */
    type: SortType;
}

/**
 * Defines a sort rule. These can be combined into a list to define a complex sort for a list dataset.
 */
export class Sort implements ISort {

    /**
     * Column name to sort on.
     */
    column: string;

    /**
     * Direction to apply to sort: ascending or descending
     */
    direction: SortDirection;

    /**
     * Sort type applied. See SortType for information on available sorting rules.
     */
    type: SortType;

    /**
     * Create a new instance of a Sort
     *
     * @param column Column to sort
     * @param direction Optional sort direction. Defaults to Ascending
     * @param type Optional sort type. Defaults to Lexicographic
     */
    constructor(
        column: string,
        direction: SortDirection = SortDirection.Ascending,
        type: SortType = SortType.Lexicographic
    ) {
        if (!column) {
            throw new Error("You must provide a non-empty column name for a Sort rule.");
        }
        this.column = column;
        this.direction = direction;
        this.type = type;
    }
}
