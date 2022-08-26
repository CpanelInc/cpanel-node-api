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

import {
    Response,
    ResponseOptions,
    MessageType
} from "./response";

/**
 * Fake to help with testing abstract class.
 */
class FakeResponse extends Response {

    /**
     * Construct a FakeResponse object.
     * @param {any}             response
     * @param {ResponseOptions} options
     */
    constructor(response: any, options?: ResponseOptions) {
        super(response, options);
        this.meta = {
            isPaged: true,
            isFiltered: true,
            record: 1,
            page: 1,
            pageSize: 10,
            totalRecords: 100,
            totalPages: 10,
            recordsBeforeFilter: 200,
            batch: false,
            properties: {},
        };
    }
}

/**
 * Extend the FakeResponse to also have messages
 */
class FakeResponseWithMessages extends FakeResponse {
    constructor(response: any, options?: ResponseOptions) {
        super(response, options);
        this.messages = [
            {
                type: MessageType.Error,
                message: "Fake Error",
            },
            {
                type: MessageType.Warning,
                message: "Fake Warning",
            },
            {
                type: MessageType.Information,
                message: "Fake Information",
            },
        ];
    }
}

describe("Response", () => {
    describe("constructor", () => {
        it("should not keep a copy of the raw response by default", () => {
            const response = new FakeResponse({});
            expect(response.raw).not.toBeDefined();
        });
        it("should keep a copy of the raw response when requested", () => {
            const resp = {};
            const response = new FakeResponse(resp, { keepUnprocessedResponse: true });
            expect(response.raw).toEqual(resp);
        });
        it("should not keep a copy of the raw response when configured", () => {
            const resp = {};
            const response = new FakeResponse(resp, { keepUnprocessedResponse: false });
            expect(response.raw).not.toBeDefined();
        });
    });
    describe("error, warning, messsage properties", () => {
        describe("without any messages", () => {
            let response: FakeResponse;
            beforeEach(() => {
                response = new FakeResponse({});
            });

            it("should return no errors", () => {
                expect(response.hasErrors).toBe(false);
                expect(response.errors).toEqual([]);
            });

            it("should return no warnings", () => {
                expect(response.hasWarnings).toBe(false);
                expect(response.warnings).toEqual([]);
            });

            it("should return no info messages", () => {
                expect(response.hasInfoMessages).toBe(false);
                expect(response.infoMessages).toEqual([]);
            });
        });
        describe("with messages of each type", () => {
            let response: FakeResponseWithMessages;
            beforeEach(() => {
                response = new FakeResponseWithMessages({});
            });

            it("should return an error when there is an error", () => {
                expect(response.hasErrors).toBe(true);
                expect(response.errors).toEqual([ { type: MessageType.Error, message: "Fake Error" } ]);
            });

            it("should return a warning when there is an warning", () => {
                expect(response.hasWarnings).toBe(true);
                expect(response.warnings).toEqual([ { type: MessageType.Warning, message: "Fake Warning" } ]);
            });

            it("should return a info message when there is an info message", () => {
                expect(response.hasInfoMessages).toBe(true);
                expect(response.infoMessages).toEqual([ { type: MessageType.Information, message: "Fake Information" } ]);
            });
        });
    });

    describe("meta data methods", () => {
        describe("isPaged", () => {
            let response: FakeResponse;
            beforeEach(() => {
                response = new FakeResponse({});
            });

            it("should return state from metadata", () => {
                expect(response.isPaged).toBe(true);
            });
        });

        describe("isFiltered", () => {
            let response: FakeResponse;
            beforeEach(() => {
                response = new FakeResponse({});
            });

            it("should return state from metadata", () => {
                expect(response.isFiltered).toBe(true);
            });
        });
    });
});
