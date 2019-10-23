/*
# @cpanel/api/src/whmapi/request.spec.ts                           Copyright 2019 cPanel, L.L.C.
#                                                                  All rights reserved.
# copyright@cpanel.net                                             http: //cpanel.net
# This code is subject to the cpanel license. Unauthorized copying is prohibited
*/

import { WhmApiRequest, WhmApiType } from "./request";
import { Pager } from "../utils/pager";
import { FilterOperator } from "../utils/filter";
import { SortDirection, SortType } from "../utils/sort";

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
            headers: [{
                name: "Content-Type",
                value: "application/x-www-form-urlencoded"
            }],
            url: "/xml-api/api_method",
            body: "api.version=1",
        });
    });

    it("Should generate a request that always contain ‘api.version=1’ as a request parameter", () => {
        const request = new WhmApiRequest(WhmApiType.XmlApi, {
            method: "api_method",
        });
        expect(request).toBeDefined();
        let genReq = request.generate();
        expect(genReq.body).toEqual("api.version=1");
    });

    it("Should generate request including paging params if set", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            pager: new Pager(2, 10)
        });
        expect(request).toBeDefined();
        let genReq = request.generate();
        expect(genReq.body).toMatch("api.chunk.enable=1&api.chunk.verbose=1&api.chunk.start=11&api.chunk.size=10");
    });

    it("should generate request including filter params if set", () => {
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
        let genReq = request.generate();
        expect(genReq.body).toMatch("api.filter.enable=1&api.filter.verbose=1&api.filter.a.field=id&api.filter.a.type=gt&api.filter.a.arg0=100");
    });

    it("should generate request if multiple filter params if set", () => {
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
        let genReq = request.generate();
        expect(genReq.body).toMatch("api.filter.enable=1&api.filter.verbose=1&api.filter.a.field=id&api.filter.a.type=gt&api.filter.a.arg0=100&api.filter.b.field=name&api.filter.b.type=contains&api.filter.b.arg0=unit%20test");
    });

    it("should generate request with sort parameters if set", () => {
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
        let genReq = request.generate();
        expect(genReq.body).toMatch("api.sort.enable=1&api.sort.a.field=title&api.sort.a.reverse=1&api.sort.a.method=lexicographic");
    });

    it("should generate request with multiple sort parameters if set", () => {
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
        let genReq = request.generate();
        expect(genReq.body).toMatch("api.sort.enable=1&api.sort.a.field=title&api.sort.a.reverse=1&api.sort.a.method=lexicographic");
    });

    it("should generate request with the arguments", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        let genReq = request.generate();
        expect(genReq.body).toMatch("label=unit");
    });

    it("should generate request with the arguments", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        let genReq = request.generate();
        expect(genReq.body).toMatch("label=unit");
    });

    it("should generate json-api request when api type is set to WhmApiType.JsonApi", () => {
        const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_method",
            arguments: [{
                name: "label",
                value: "unit"
            }]
        });
        let genReq = request.generate();
        expect(genReq.url).toEqual("/json-api/api_method");
    });

    describe("when json encoding is requested", () => {
        it("should generate a POST with a json body by default", () => {
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
                headers: [{
                    name: "Content-Type",
                    value: "application/json"
                }],
                url: "/json-api/api_method",
                body: '{"api.version":1,"label":"unit"}',
            });
        });
    });
});
