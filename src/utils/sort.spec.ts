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

import { Sort, SortDirection, SortType } from "./sort";

describe("Sort Class", () => {
    describe("constructor", () => {
        it("should throw error when passed an empty column name ", () => {
            expect(function () {
                new Sort("");
            }).toThrowError();
        });

        it("should default the direction and type when not passed", () => {
            const sort = new Sort("column");
            expect(sort.column).toBe("column");
            expect(sort.direction).toBe(SortDirection.Ascending);
            expect(sort.type).toBe(SortType.Lexicographic);
        });

        it("should default the type when not passed", () => {
            const sort = new Sort("column", SortDirection.Descending);
            expect(sort.column).toBe("column");
            expect(sort.direction).toBe(SortDirection.Descending);
            expect(sort.type).toBe(SortType.Lexicographic);
        });

        it("should set the values passed when passed explicitly", () => {
            const sort = new Sort(
                "column",
                SortDirection.Descending,
                SortType.Numeric,
            );
            expect(sort.column).toBe("column");
            expect(sort.direction).toBe(SortDirection.Descending);
            expect(sort.type).toBe(SortType.Numeric);
        });
    });
});
