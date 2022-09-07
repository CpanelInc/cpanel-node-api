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
 * The filter operator defines the rule used to compare data in a column with the passed-in value. It
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
   * Column value not equal value
   */
  NotEqual,

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

  /**
   * Column value is defined. Value is ignored in this case.
   */
  Defined,

  /**
   * Column value is undefined. Value is ignored in this case.
   */
  Undefined,
}

/**
 * Interface for filter data.
 */
export interface IFilter {
  /**
   * Column name to look at in a record.
   */
  column: string;

  /**
   * Comparison operator to apply
   */
  operator: FilterOperator;

  /**
   * Value to compare the column data to. The kinds of values here vary depending on the FilterOperator
   */
  value: any;
}

/**
 * Defines a filter request for a Api call.
 */
export class Filter implements IFilter {
  /**
   * Column name to look at in a record.
   */
  column: string;

  /**
   * Comparison operator to apply
   */
  operator: FilterOperator;

  /**
   * Value to compare the column data to. The kinds of values here vary depending on the FilterOperator
   */
  value: any;

  /**
   * Construct a new Filter object.
   *
   * @param column Column name requests. Must be non-empty and exist on the related backend collection.
   * @param operator Comparison operator to use when applying the filter.
   * @param value Value to compare the columns value too.
   */
  constructor(column: string, operator: FilterOperator, value: any) {
    if (!column) {
      throw new Error("You must define a non-empty column name.");
    }

    this.column = column;
    this.operator = operator;
    this.value = value;
  }
}
