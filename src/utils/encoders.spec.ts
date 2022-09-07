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

import {
  IArgumentEncoder,
  UrlArgumentEncoder,
  WwwFormUrlArgumentEncoder,
  JsonArgumentEncoder,
} from "./encoders";

describe("UrlArgumentEncoder", () => {
  let encoder: IArgumentEncoder;
  beforeEach(() => {
    encoder = new UrlArgumentEncoder();
  });

  it("should be created by new()", () => {
    expect(encoder).toBeDefined();
    expect(encoder.contentType).toBe("");
    expect(encoder.separatorStart).toBe("?");
    expect(encoder.separatorEnd).toBe("");
    expect(encoder.recordSeparator).toBe("&");
  });

  it("should throw an error when passed an empty name", () => {
    expect(() => encoder.encode("", "", false)).toThrowError();
  });

  it("should encode data correctly", () => {
    expect(encoder.encode("name", "", false)).toBe("name=&");
    expect(encoder.encode("name", "", true)).toBe("name=");
    expect(encoder.encode("name", "value", false)).toBe("name=value&");
    expect(encoder.encode("name", "value", true)).toBe("name=value");
    expect(encoder.encode("name", "&", false)).toBe("name=%26&");
    expect(encoder.encode("name", "&", true)).toBe("name=%26");
  });
});

describe("WwwFormUrlArgumentEncoder", () => {
  let encoder: IArgumentEncoder;
  beforeEach(() => {
    encoder = new WwwFormUrlArgumentEncoder();
  });

  it("should be created by new()", () => {
    expect(encoder).toBeDefined();
    expect(encoder.contentType).toBe("application/x-www-form-urlencoded");
    expect(encoder.separatorStart).toBe("");
    expect(encoder.separatorEnd).toBe("");
    expect(encoder.recordSeparator).toBe("&");
  });

  it("should throw an error when passed an empty name", () => {
    expect(() => encoder.encode("", "", false)).toThrowError();
  });

  it("should encode data correctly", () => {
    expect(encoder.encode("name", "", false)).toBe("name=&");
    expect(encoder.encode("name", "", true)).toBe("name=");
    expect(encoder.encode("name", "value", false)).toBe("name=value&");
    expect(encoder.encode("name", "value", true)).toBe("name=value");
    expect(encoder.encode("name", "&", false)).toBe("name=%26&");
    expect(encoder.encode("name", "&", true)).toBe("name=%26");
  });
});

describe("JsonArgumentEncoder", () => {
  let encoder: IArgumentEncoder;
  beforeEach(() => {
    encoder = new JsonArgumentEncoder();
  });

  it("should be created by new()", () => {
    expect(encoder).toBeDefined();
    expect(encoder.contentType).toBe("application/json");
    expect(encoder.separatorStart).toBe("{");
    expect(encoder.separatorEnd).toBe("}");
    expect(encoder.recordSeparator).toBe(",");
  });

  it("should encode data correctly", () => {
    expect(encoder.encode("data", "value", true)).toBe('"data":"value"');
    expect(encoder.encode("data", "value", false)).toBe('"data":"value",');
    expect(encoder.encode("data", "&", true)).toBe('"data":"&"');
    expect(encoder.encode("data", "&", false)).toBe('"data":"&",');
    expect(encoder.encode("data", 1, true)).toBe('"data":1');
    expect(encoder.encode("data", 1, false)).toBe('"data":1,');
    expect(encoder.encode("data", true, true)).toBe('"data":true');
    expect(encoder.encode("data", true, false)).toBe('"data":true,');
    expect(encoder.encode("data", [1, 2, 3], true)).toBe('"data":[1,2,3]');
    expect(encoder.encode("data", [1, 2, 3], false)).toBe('"data":[1,2,3],');
    expect(encoder.encode("data", { a: 1, b: 2 }, true)).toBe(
      '"data":{"a":1,"b":2}'
    );
    expect(encoder.encode("data", { a: 1, b: 2 }, false)).toBe(
      '"data":{"a":1,"b":2},'
    );
  });

  it("should throw an error when passed a value that can not be serialized", () => {
    expect(() => encoder.encode("", "", false)).toThrowError();
    expect(() =>
      encoder.encode("", { a: 1, b: () => true }, false)
    ).toThrowError();
  });
});
