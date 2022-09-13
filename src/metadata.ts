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
   * Indicates if the data set is filtered.
   */
  isFiltered: boolean;

  /**
   * Number of records available before the filter was processed.
   */
  recordsBeforeFilter: number;

  /**
   * Indicates the response was the result of a batch API.
   */
  batch: boolean;

  /**
   * A collection of the other less common or custom UAPI metadata properties.
   */
  properties: { [index: string]: string };
}
