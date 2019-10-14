import * as Perl from "./perl";

describe("fromBoolean()", () => {
    it("should return a perl falsism when passed false value", () => {
        expect(Perl.fromBoolean(false)).toBe("0");
    });
    it("should return a perl truism when passed false value", () => {
        expect(Perl.fromBoolean(true)).toBe("1");
    });
});

describe("toBoolean()", () => {
    it("should return false when passed false a Perl falsism", () => {
        expect(Perl.toBoolean("")).toBe(false);
        expect(Perl.toBoolean(0)).toBe(false);
        expect(Perl.toBoolean("0")).toBe(false);
    });
    it("should return true when passed a Perl truism", () => {
        expect(Perl.toBoolean("1")).toBe(true);
        expect(Perl.toBoolean(1)).toBe(true);
    });
});
