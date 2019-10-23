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
            let response = new FakeResponse({});
            expect(response.raw).not.toBeDefined();
        });
        it("should keep a copy of the raw response when requested", () => {
            let resp = {};
            let response = new FakeResponse(resp, { keepUnprocessedResponse: true });
            expect(response.raw).toEqual(resp);
        });
        it("should not keep a copy of the raw response when configured so", () => {
            let resp = {};
            let response = new FakeResponse(resp, { keepUnprocessedResponse: false });
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

            it("should return a info messages when there is an info message", () => {
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
