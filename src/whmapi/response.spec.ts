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
