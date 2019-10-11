import {
    ALL,
    DEFAULT_PAGE_SIZE,
    Pager
} from "./pager";

describe("Pager Class", () => {
    describe("constructor", () => {
        it("should throw error when passed a negative page number", () => {
            expect(function() {
                new Pager(-2);
            }).toThrowError();
        });

        it("should throw error when passed a zero page number", () => {
            expect(function() {
                new Pager(0);
            }).toThrowError();
        });

        it("should not throw error when passed a positive non-zero page number", () => {
            expect(function() {
                new Pager(1);
            }).not.toThrowError();
            expect(function() {
                new Pager(1000);
            }).not.toThrowError();
        });

        it("should not throw error when passed the ALL cardinal", () => {
            expect(function() {
                new Pager(1, ALL);
            }).not.toThrowError();
        });

        it("should default the page and pageSize ", () => {
            const pager = new Pager();
            expect(pager.page).toBe(1);
            expect(pager.pageSize).toBe(DEFAULT_PAGE_SIZE);
        });

        it("should set the page when passed and default the pageSize to whatever is set in the DEFAULT_PAGE_SIZE", () => {
            const pager = new Pager(10);
            expect(pager.page).toBe(10);
            expect(pager.pageSize).toBe(DEFAULT_PAGE_SIZE);
        });

        it("should set the page and pageSize to the desired values", () => {
            const pager = new Pager(10, 10);
            expect(pager.page).toBe(10);
            expect(pager.pageSize).toBe(10);
        });

        it("should set the page and pageSize to the desired values: all", () => {
            const pager = new Pager(1, ALL);
            expect(pager.page).toBe(1);
            expect(pager.pageSize).toBe(ALL);
            expect(pager.all()).toBe(true);
        });
    });
});
