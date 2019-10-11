import {
    MessageType
} from "../response";

import {
    UapiResponse,
    UapiMetaData
} from "./response";

describe("UapiResponse", () => {
    describe("constructor", () => {
        it("should fail when response does not have a data property", () => {
            expect(() => new UapiResponse({ status: "0" })).toThrowError();
        });
        it("should report failure for any 0 status", () => {
            expect(new UapiResponse({ data: {}, status: "0" }).success).toBe(false);
            expect(new UapiResponse({ data: {}, status: 0 }).success).toBe(false);
            expect(new UapiResponse({ data: {}, status: "" }).success).toBe(false);
        });
        it("should report success for any 1 status", () => {
            expect(new UapiResponse({ data: {}, status: "1" }).success).toBe(true);
            expect(new UapiResponse({ data: {}, status: 1 }).success).toBe(true);
        });
        it("should store the data property if present in the response", () => {
            let data = {};
            expect(new UapiResponse({ data: data, status: 1 }).data).toBe(data);
        });
        it("should store the metadata if present in the response", () => {
            let data = {};
            let metadata = {};
            let response = new UapiResponse({ data: data, metadata: metadata, status: 1 });
            expect(response.data).toBe(data);
            expect(response.meta).toBeDefined();
        });
        it("should parse any errors provided", () => {
            let response = new UapiResponse({ data: {}, status: 1, errors: [] });
            expect(response.errors.length).toBe(0);

            response = new UapiResponse({ data: {}, status: 0, errors: [ "yo" ] });
            expect(response.errors.length).toBe(1);
            expect(response.errors[0]).toEqual({
                message: "yo",
                type: MessageType.Error
            });
        });
        it("should parse any messages provided", () => {
            let response = new UapiResponse({ data: {}, status: 1, messages: [] });
            expect(response.errors.length).toBe(0);

            response = new UapiResponse({ data: {}, status: 0, messages: [ "yo" ] });
            expect(response.messages.length).toBe(1);
            expect(response.messages[0]).toEqual({
                message: "yo",
                type: MessageType.Information
            });
        });
    });
});

describe("UapiMetaData", () => {
    describe("constructor with no elements", () => {
        it("should use the default values", () => {
            let raw = {};
            let meta = new UapiMetaData(raw);
            expect(meta.isPaged).toBe(false);
            expect(meta.record).toBe(0);
            expect(meta.page).toBe(0);
            expect(meta.pageSize).toBe(0);
            expect(meta.totalPages).toBe(0);
            expect(meta.totalRecords).toBe(0);
            expect(meta.isFiltered).toBe(false);
            expect(meta.recordsBeforeFilter).toBe(0);
            expect(Object.keys(meta.properties).length).toBe(0);
        });
    });

    describe("constructor with pagination", () => {
        it("should parse the pagination data", () => {
            let raw = {
                paginate: {
                    start_result: 20,
                    current_page: 3,
                    results_per_page: 10,
                    total_pages: 5,
                    total_results: 49,
                }
            };
            let meta = new UapiMetaData(raw);
            expect(meta.isPaged).toBe(true);
            expect(meta.record).toBe(20);
            expect(meta.page).toBe(3);
            expect(meta.pageSize).toBe(10);
            expect(meta.totalPages).toBe(5);
            expect(meta.totalRecords).toBe(49);
            expect(meta.isFiltered).toBe(false);
            expect(meta.recordsBeforeFilter).toBe(0);
            expect(Object.keys(meta.properties).length).toBe(0);
        });
    });

    describe("constructor with filter", () => {
        it("should parse the filter data", () => {
            let raw = {
                filter: {
                    records_before_filter: 75,
                }
            };
            let meta = new UapiMetaData(raw);
            expect(meta.isPaged).toBe(false);
            expect(meta.record).toBe(0);
            expect(meta.page).toBe(0);
            expect(meta.pageSize).toBe(0);
            expect(meta.totalPages).toBe(0);
            expect(meta.totalRecords).toBe(0);
            expect(meta.isFiltered).toBe(true);
            expect(meta.recordsBeforeFilter).toBe(75);
            expect(Object.keys(meta.properties).length).toBe(0);
        });
    });

    describe("constructor with custom metadata properties", () => {
        it("should put the custom properties in the properties collection, but not paginate or filter", () => {
            let raw = {
                filter: {
                    records_before_filter: 75,
                },
                paginate: {
                    start_result: 20,
                    current_page: 3,
                    results_per_page: 10,
                    total_pages: 5,
                    total_results: 49,
                },
                "custom.bool": true,
                "custom.number": 55,
                "custom.string": "hello",
                "custom.array": [ 1, 2, 3 ],
                "custom.object": { a: 10, b: 11 }
            };
            let meta = new UapiMetaData(raw);
            expect(Object.keys(meta.properties).length).toBe(5);
            expect(meta.properties["custom.bool"]).toBe(true);
            expect(meta.properties["custom.number"]).toBe(55);
            expect(meta.properties["custom.string"]).toBe("hello");
            expect(meta.properties["custom.array"]).toBeDefined();
            expect(meta.properties["custom.object"]).toBeDefined();
            expect(meta.properties["filter"]).not.toBeDefined();
            expect(meta.properties["paginate"]).not.toBeDefined();
        });
    });
});
