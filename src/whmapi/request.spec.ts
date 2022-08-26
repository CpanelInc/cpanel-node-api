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

import { WhmApiRequest, WhmApiType } from "./request";
import { Pager } from "../utils/pager";
import { FilterOperator } from "../utils/filter";
import { SortDirection, SortType } from "../utils/sort";
import {
    Headers,
    WhmApiTokenHeader,
    CpanelApiTokenHeader,
    CpanelApiTokenMismatchError
} from "../utils/headers";


describe("WhmApiRequest: ", () => {
    describe("when not fully initialized", () => {
        it("should not create request object without a method", () => {
            expect(() => new WhmApiRequest(WhmApiType.JsonApi)).toThrowError();
        });
    });

    it("Should generate a POST with a wwwurlencoded body by default", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
        });
        expect(request).toBeDefined();
        expect(request.generate()).toEqual({
            headers: new Headers([{
                name: "Content-Type",
                value: "application/x-www-form-urlencoded"
            }]),
            url: "/xml-api/api_method",
            body: "api.version=1",
        });
    });

    it("Should generate a request that always contains ‘api.version=1’ as a request parameter", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
        });
        expect(request).toBeDefined();
        const genReq = request.generate();
        expect(genReq.body).toEqual("api.version=1");
    });

    it("Should generate a request including paging params if set", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            pager: new Pager(2, 10)
        });
        expect(request).toBeDefined();
        const genReq = request.generate();
        expect(genReq.body).toMatch("api.chunk.enable=1&api.chunk.verbose=1&api.chunk.start=11&api.chunk.size=10");
    });

    it("should generate a request including filter params if set", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            filters: [
                {
                    column: "id",
                    operator: FilterOperator.GreaterThan,
                    value: 100
                }
            ]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("api.filter.enable=1&api.filter.verbose=1&api.filter.a.field=id&api.filter.a.type=gt&api.filter.a.arg0=100");
    });

    it("should generate a request if multiple filter params if set", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
            filters: [
                {
                    column: "id",
                    operator: FilterOperator.GreaterThan,
                    value: 100
                },
                {
                    column: "name",
                    operator: FilterOperator.Contains,
                    value: "unit test"
                }
            ]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("api.filter.enable=1&api.filter.verbose=1&api.filter.a.field=id&api.filter.a.type=gt&api.filter.a.arg0=100&api.filter.b.field=name&api.filter.b.type=contains&api.filter.b.arg0=unit%20test");
    });

    it("should generate a request with sort parameters if set", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
            sorts: [
                {
                    column: "title",
                    direction: SortDirection.Descending,
                    type: SortType.Lexicographic,
                }
            ]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("api.sort.enable=1&api.sort.a.field=title&api.sort.a.reverse=1&api.sort.a.method=lexicographic");
    });

    it("should generate a request with multiple sort parameters if set", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
            sorts: [
                {
                    column: "title",
                    direction: SortDirection.Descending,
                    type: SortType.Lexicographic,
                },
                {
                    column: "user",
                    direction: SortDirection.Ascending,
                    type: SortType.Numeric
                }
            ]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("api.sort.enable=1&api.sort.a.field=title&api.sort.a.reverse=1&api.sort.a.method=lexicographic");
    });

    it("should generate a request with the arguments", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("label=unit");
    });

    it("should generate a request with the arguments", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        const genReq = request.generate();
        expect(genReq.body).toMatch("label=unit");
    });

    it("should generate a json-api request when API type is set to WhmApiType.JsonApi", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        const genReq = request.generate();
        expect(genReq.url).toEqual("/json-api/api_method");
    });

    describe("when json encoding is requested", () => {
        it("should generate a POST with a JSON body by default", () => {
            const request = new WhmApiRequest(WhmApiType.JsonApi, {
                method: "api_method",
                arguments: [{
                    name: "label",
                    value: "unit"
                }],
                config: {
                    json: true,
                }
            });
            expect(request).toBeDefined();
            expect(request.generate()).toEqual({
                headers: new Headers([{
                    name: "Content-Type",
                    value: "application/json"
                }]),
                url: "/json-api/api_method",
                body: '{"api.version":1,"label":"unit"}',
            });
        });
    });

    describe("when calling with WHM API token with token and user", () => {
        it("should generate a correct interchange", () => {
            const request = new WhmApiRequest(WhmApiType.JsonApi, {
                namespace: "test",
                method: "simple_call",
                headers: [
                    new WhmApiTokenHeader("fake", "user")
                ]
            });
            expect(request).toBeDefined();
            expect(request.generate()).toEqual({
                headers: new Headers([ {
                    name: "Content-Type",
                    value: "application/x-www-form-urlencoded"
                },
                {
                    name: "Authorization",
                    value: "whm user:fake"
                }
                ]),
                url: "/json-api/simple_call",
                body: "api.version=1",
            });
        });
    });

    describe("when calling with WHM API token with combined user/token", () => {
        it("should generate a correct interchange", () => {
            const request = new WhmApiRequest(WhmApiType.JsonApi, {
                namespace: "test",
                method: "simple_call",
                headers: [
                    new WhmApiTokenHeader("user:fake")
                ]
            });
            expect(request).toBeDefined();
            expect(request.generate()).toEqual({
                headers: new Headers([ {
                    name: "Content-Type",
                    value: "application/x-www-form-urlencoded"
                },
                {
                    name: "Authorization",
                    value: "whm user:fake"
                }
                ]),
                url: "/json-api/simple_call",
                body: "api.version=1",
            });
        });
    });

    describe("when calling with cPanel API token", () => {
        it("should throw an error", () => {
            expect(() => {
                new WhmApiRequest(WhmApiType.JsonApi, {
                    namespace: "test",
                    method: "simple_call",
                    headers: [
                        new CpanelApiTokenHeader("fake", "user")
                    ]
                });
            }).toThrowError(CpanelApiTokenMismatchError);
        });
    });
});
