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

import { WhmApiResponse } from "./response";
import { DefaultMetaData } from "../response";

describe("WhmApiResponse", () => {
    describe("constructor", () => {
        it("should fail when response is undefined", () => {
            expect(() => new WhmApiResponse(undefined)).toThrowError();
        });
        it("should report failure when response result is 0", () => {
            let serverResponse = {
                metadata: {
                    result: 0
                }
            };
            expect(new WhmApiResponse(serverResponse).success).toBe(false);
        });
        it("should report success when response result is 1", () => {
            let serverResponse = {
                data: {},
                metadata: {
                    result: 1
                }
            };
            expect(new WhmApiResponse(serverResponse).success).toBe(true);
        });
        it("should store the data property if present in the response", () => {
            const expectedData = {
                test: "Test"
            };
            let serverResponse = {
                data: expectedData,
                metadata: {
                    result: 1
                }
            };
            expect(new WhmApiResponse(serverResponse).data).toBe(expectedData);
        });
        it("should store extra metadata information in ‘properties’ property under whmApiResponseObj.meta", () => {
            let expectedData = {};
            let expectedMetadata = {
                result: 1,
                extra: "property"
            };
            let response = new WhmApiResponse({ data: expectedData, metadata: expectedMetadata });
            expect(response.meta.properties).toBeDefined();
            expect(Object.keys(response.meta.properties)).toContain("extra");
        });
        it("should parse any errors provided", () => {
            const error: string = "Api Failure";
            let serverResponse = {
                metadata: {
                    result: 0,
                    reason: error
                }
            };
            let response = new WhmApiResponse(serverResponse);
            expect(response.errors.length).not.toBe(0);
            expect(response.errors[0].message).toEqual(error);
        });
        it("should reduce the list data if an array is assigned to a single hash.", () => {
            const listData = ["Test", "List", "Returned", "To", "Single", "Hash"];
            let serverResponse = {
                data: {
                    test: listData
                },
                metadata: {
                    result: 1
                }
            };
            expect(new WhmApiResponse(serverResponse).data).toBe(listData);
        });
        it("should assign default metadata if metadata is not defined.", () => {
            const expectedMetadata = DefaultMetaData;
            expect(new WhmApiResponse({}).meta).toEqual(expectedMetadata);
        });
    });
});
