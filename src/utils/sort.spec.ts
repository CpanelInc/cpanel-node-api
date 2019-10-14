import {
    Sort,
    SortDirection,
    SortType
} from "./sort";

describe("Sort Class", () => {
    describe("constructor", () => {
        it("should throw error when passed an empty column name ", () => {
            expect(function() {
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
            const sort = new Sort("column", SortDirection.Descending, SortType.Numeric);
            expect(sort.column).toBe("column");
            expect(sort.direction).toBe(SortDirection.Descending);
            expect(sort.type).toBe(SortType.Numeric);
        });
    });
});
