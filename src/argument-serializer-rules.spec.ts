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

import { HttpVerb } from "./http/verb";

import { argumentSerializationRules } from "./argument-serializer-rules";

describe("ArgumentSerializationRules getRule()", () => {
  it("should return a predefined rule when passed HttpVerb.GET", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.GET);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("GET");
    expect(rule.dataInBody).toBe(false);
  });

  it("should return a predefined rule when passed HttpVerb.DELETE", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.DELETE);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("DELETE");
    expect(rule.dataInBody).toBe(false);
  });

  it("should return a predefined rule when passed HttpVerb.HEAD", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.HEAD);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("HEAD");
    expect(rule.dataInBody).toBe(false);
  });

  it("should return a predefined rule when passed HttpVerb.POST", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.POST);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("POST");
    expect(rule.dataInBody).toBe(true);
  });

  it("should return a predefined rule when passed HttpVerb.PUT", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.PUT);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("PUT");
    expect(rule.dataInBody).toBe(true);
  });

  it("should return a predefined rule when passed HttpVerb.PATCH", () => {
    const rule = argumentSerializationRules.getRule(HttpVerb.PATCH);
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("PATCH");
    expect(rule.dataInBody).toBe(true);
  });

  it("should return a predefined rule when passed an unrecognized verb", () => {
    const rule = argumentSerializationRules.getRule("CUSTOM");
    expect(rule).toBeDefined();
    expect(rule.verb).toBe("DEFAULT");
    expect(rule.dataInBody).toBe(true);
  });
});
