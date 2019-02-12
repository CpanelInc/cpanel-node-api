
/**
 * The filter operator defines the rule used to compare data in a column with the passed in value. It
 * behaves something like:
 *
 *   const value = 1;
 *   data.map(item => item[column])
 *       .filter(itemValue => operator(itemValue, value));
 *
 * where item is the data from the column
 */
export enum FilterOperator {
    /**
     * String contains value
     */
    Contains,

    /**
     * String begins with value
     */
    Begins,

    /**
     * String ends with value
     */
    Ends,

    /**
     * String matches pattern in value
     */
    Matches,

    /**
     * Column value equals value
     */
    Equal,

    /**
     * Column value is less than value
     */
    LessThan,

    /**
     * Column value is less than value using unlimited rules.
     */
    LessThanUnlimited,

    /**
     * Column value is greater than value.
     */
    GreaterThan,

    /**
     * Column value is greater than value using unlimited rules.
     */
    GreaterThanUnlimited,
}

/**
 * Interface for filter data.
 */
export interface IFilter {
    /**
     * Column name to look at in a record.
     * @type {string}
     */
    column: string;

    /**
     * Comparison operator to apply
     * @type {FilterOperator}
     */
    operator: FilterOperator;

    /**
     * Value to compare the column data to. The kinds of values here vary depending on the FilterOperator
     * @type {any}
     */
    value: any;
};

/**
 * Defines a filter request for a Api call.
 */
export class Filter implements IFilter {
    /**
     * Column name to look at in a record.
     * @type {string}
     */
    column: string;

    /**
     * Comparison operator to apply
     * @type {FilterOperator}
     */
    operator: FilterOperator;

    /**
     * Value to compare the column data to. The kinds of values here vary depending on the FilterOperator
     * @type {any}
     */
    value: any;

    /**
     * Construct a new Filter object.
     *
     * @param {string}         column   Column name requests. Must be non-empty and exist on the related backend collection.
     * @param {FilterOperator} operator Comparison operator to use when applying the filter.
     * @param {any}            value    Value to compare the columns value too.
     */
    constructor(
        column: string,
        operator: FilterOperator,
        value: any
    ) {
        if(!column) {
            throw new Error('You must define a non-empty column name.')
        }

        this.column = column;
        this.operator = operator;
        this.value = value;
    }
};
