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
     * Uses character-by-character comparison.
     */
    Lexicographic,

    /**
     * Special rule for handing IPv4 comparison. This takes into account the segments.
     */
    Ipv4,

    /**
     * Assumes the values are numeric and compares them using number rules.
     */
    Numeric,

    /**
     * Special rule for certain data where 0 is considered unlimited.
     */
    NumericZeroAsMax,
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
        type: SortType = SortType.Lexicographic,
    ) {
        if (!column) {
            throw new Error(
                "You must provide a non-empty column name for a Sort rule.",
            );
        }
        this.column = column;
        this.direction = direction;
        this.type = type;
    }
}
