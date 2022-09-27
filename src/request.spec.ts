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

import * as Perl from "./utils/perl";

import { IRequest, Request, GenerateRule } from "./request";

import { Argument } from "./utils/argument";

import { Sort, SortDirection, SortType } from "./utils/sort";

import { Filter, FilterOperator } from "./utils/filter";

import { Pager } from "./utils/pager";

import { Headers } from "./utils/headers";

import { RequestInfo } from "./interchange";

/**
 * This class implements the abstract method from the base class
 * so we can test the base class constructor and methods.
 */
class MockRequest extends Request {
    constructor(init?: IRequest) {
        super(init);
    }

    generate(rule?: GenerateRule): RequestInfo {
        return {
            headers: new Headers([
                { name: "content-type", value: "text/plain" },
            ]),
            url: "/execute/test/get_tests",
            body: "",
        };
    }
}

describe("Request derived object that implements generate", () => {
    it("should be creatable", () => {
        const request = new MockRequest();
        expect(request).toBeDefined();
    });

    it("should accept a configuration argument", () => {
        const request = new MockRequest({
            namespace: "test",
            method: "test",
            config: { analytics: false },
        });
        expect(request).toBeDefined();
        expect(request.config).toEqual({ analytics: false });
        expect(request.namespace).toBe("test");
        expect(request.method).toBe("test");
    });

    it("should accept an simple initialization object", () => {
        const request = new MockRequest({
            namespace: "test",
            method: "get_tests",
        });
        expect(request).toBeDefined();
        expect(request.config).toBeDefined();
        expect(request.namespace).toBe("test");
        expect(request.method).toBe("get_tests");
    });

    it("should accept a complex initialization object", () => {
        const request = new MockRequest({
            namespace: "test",
            method: "get_tests",
            arguments: [
                {
                    name: "set",
                    value: "unit",
                },
            ],
            sorts: [
                {
                    column: "name",
                    direction: SortDirection.Ascending,
                    type: SortType.Lexicographic,
                },
            ],
            filters: [
                {
                    column: "enabled",
                    operator: FilterOperator.Equal,
                    value: Perl.fromBoolean(true),
                },
            ],
            columns: ["name", "description", "steps", "set"],
            pager: { page: 1, pageSize: 20 },
            config: { json: true },
        });
        expect(request).toBeDefined();
        expect(request.config).toEqual({ json: true });
        expect(request.namespace).toBe("test");
        expect(request.method).toBe("get_tests");
        expect(request.arguments).toEqual([new Argument("set", "unit")]);
        expect(request.sorts).toEqual([
            new Sort("name", SortDirection.Ascending, SortType.Lexicographic),
        ]);
        expect(request.filters).toEqual([
            new Filter("enabled", FilterOperator.Equal, "1"),
        ]);
        expect(request.columns).toEqual([
            "name",
            "description",
            "steps",
            "set",
        ]);
        expect(request.pager as unknown).toEqual(
            jasmine.objectContaining({ page: 1, pageSize: 20 })
        );
    });

    describe("when the addArgument() method is called", () => {
        let request: MockRequest;
        beforeEach(() => {
            request = new MockRequest({
                namespace: "test",
                method: "get_tests",
            });
        });

        it("should add a name/value argument", () => {
            request.addArgument({ name: "set", value: "unit" });
            expect(request.arguments).toBeDefined();
            expect(request.arguments.length).toBe(1);
            expect(request.arguments[0]).toEqual(new Argument("set", "unit"));
        });

        it("should add a name/value argument", () => {
            request.addArgument(new Argument("set", "unit"));
            expect(request.arguments).toBeDefined();
            expect(request.arguments.length).toBe(1);
            expect(request.arguments[0]).toEqual(new Argument("set", "unit"));
        });
    });

    describe("when the addSort() method is called", () => {
        let request: MockRequest;
        beforeEach(() => {
            request = new MockRequest({
                namespace: "test",
                method: "get_tests",
            });
        });

        it("should sorting rule using interface", () => {
            request.addSort({
                column: "name",
                direction: SortDirection.Descending,
                type: SortType.Lexicographic,
            });
            expect(request.sorts).toBeDefined();
            expect(request.sorts.length).toBe(1);
            expect(request.sorts[0]).toEqual(
                new Sort(
                    "name",
                    SortDirection.Descending,
                    SortType.Lexicographic
                )
            );
        });

        it("should sorting rule using object", () => {
            request.addSort(
                new Sort(
                    "name",
                    SortDirection.Descending,
                    SortType.Lexicographic
                )
            );
            expect(request.sorts).toBeDefined();
            expect(request.sorts.length).toBe(1);
            expect(request.sorts[0]).toEqual(
                new Sort(
                    "name",
                    SortDirection.Descending,
                    SortType.Lexicographic
                )
            );
        });
    });

    describe("when the addFilter() method is called", () => {
        let request: MockRequest;
        beforeEach(() => {
            request = new MockRequest({
                namespace: "test",
                method: "get_tests",
            });
        });

        it("should filter using interface", () => {
            request.addFilter({
                column: "enabled",
                operator: FilterOperator.Equal,
                value: Perl.fromBoolean(true),
            });
            expect(request.filters).toBeDefined();
            expect(request.filters.length).toBe(1);
            expect(request.filters[0]).toEqual(
                new Filter(
                    "enabled",
                    FilterOperator.Equal,
                    Perl.fromBoolean(true)
                )
            );
        });

        it("should filter using object", () => {
            request.addFilter(
                new Filter(
                    "enabled",
                    FilterOperator.Equal,
                    Perl.fromBoolean(true)
                )
            );
            expect(request.filters).toBeDefined();
            expect(request.filters.length).toBe(1);
            expect(request.filters[0]).toEqual(
                new Filter(
                    "enabled",
                    FilterOperator.Equal,
                    Perl.fromBoolean(true)
                )
            );
        });
    });

    describe("when the addColumn() method is called", () => {
        let request: MockRequest;
        beforeEach(() => {
            request = new MockRequest({
                namespace: "test",
                method: "get_tests",
            });
        });

        it("should add a column", () => {
            request.addColumn("name");
            expect(request.columns).toBeDefined();
            expect(request.columns.length).toBe(1);
            expect(request.columns[0]).toEqual("name");
        });
    });

    describe("when the paginate() method is called", () => {
        let request: MockRequest;
        beforeEach(() => {
            request = new MockRequest({
                namespace: "test",
                method: "get_tests",
            });
        });

        it("should add pager using the interface", () => {
            request.paginate({ page: 10, pageSize: 25 });
            expect(request.pager as unknown).toEqual(
                jasmine.objectContaining({ page: 10, pageSize: 25 })
            );
        });

        it("should add pager using object", () => {
            request.paginate(new Pager(10, 25));
            expect(request.pager as unknown).toEqual(
                jasmine.objectContaining({ page: 10, pageSize: 25 })
            );
        });
    });
});
