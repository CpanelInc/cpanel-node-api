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

import { Argument, PerlBooleanArgument } from "./argument";

import * as perl from "./perl";

describe("Argument Class", () => {
  describe("constructor", () => {
    it("should throw an error when an empty string is passed in name field for name/value arguments", () => {
      expect(function () {
        new Argument("", "");
      }).toThrowError();
    });

    it("should build a new name/value when passed only a name and value", () => {
      const arg = new Argument("name", "kermit");
      expect(arg).toBeDefined();
      expect(arg.name).toBe("name");
      expect(arg.value).toBe("kermit");
    });
  });
});

describe("PerlBooleanArgument Class", () => {
  describe("constructor", () => {
    it("should throw an error when an empty string is passed in name field for name/value arguments", () => {
      expect(function () {
        new PerlBooleanArgument("", true);
      }).toThrowError();
    });

    it("should build a new name/value when passed a name and true value", () => {
      const arg = new PerlBooleanArgument("name", true);
      expect(arg).toBeDefined();
      expect(arg.name).toBe("name");
      expect(arg.value).toBe(perl.fromBoolean(true));
    });

    it("should build a new name/value when passed a name and false value", () => {
      const arg = new PerlBooleanArgument("name", false);
      expect(arg).toBeDefined();
      expect(arg.name).toBe("name");
      expect(arg.value).toBe(perl.fromBoolean(false));
    });
  });
});
