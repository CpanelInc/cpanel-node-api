// MIT License
//
// Copyright 2021 cPanel L.L.C.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
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
