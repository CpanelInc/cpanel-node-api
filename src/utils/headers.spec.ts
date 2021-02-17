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

import {
    Headers,
    CustomHeader,
    CpanelApiTokenHeader,
    WhmApiTokenHeader,
    CpanelApiTokenInvalidError,
    WhmApiTokenInvalidError
} from "../utils/headers";

describe("Headers collection: ", () => {
    describe("when you call constructor without an argument", () => {
        it("should return an empty headers collection", () => {
            const headers = new Headers();
            expect(headers.toArray()).toEqual([]);
        });
    });

    describe("when you call constructor an object array", () => {
        it("should return an empty headers collection", () => {
            const headers = new Headers([{
                name: "dog",
                value: "barks"
            }]);
            expect(headers.toArray()).toEqual([{
                name: "dog",
                value: "barks"
            }]);
            expect(headers.toObject()).toEqual({
                dog: "barks"
            });
        });
    });

    describe("when you call constructor an specific CustomerHeader classes array", () => {
        it("should return an empty headers collection", () => {
            const headers = new Headers([new CustomHeader({
                name: "cat",
                value: "meows",
            })]);
            const array = headers.toArray();

            expect(array).toEqual([
                {
                    name: "cat",
                    value: "meows"
                }
            ]);
            expect(headers.toObject()).toEqual({
                cat: "meows"
            });
        });
    });
});

describe("CpanelApiTokenHeader: ", () => {
    describe("when you attempt to pass an empty token", () => {
        it("should throw an error", () => {
            expect(() => new CpanelApiTokenHeader("")).toThrowError(CpanelApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and no user", () => {
        it("should throw an error", () => {
            expect(() => new CpanelApiTokenHeader("fake")).toThrowError(CpanelApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and an empty user", () => {
        it("should throw an error", () => {
            expect(() => new CpanelApiTokenHeader("fake", "")).toThrowError(CpanelApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and an empty user prefix", () => {
        it("should throw an error", () => {
            expect(() => new CpanelApiTokenHeader(":fake")).toThrowError(CpanelApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an empty token with a user prefix", () => {
        it("should throw an error", () => {
            expect(() => new CpanelApiTokenHeader("user:")).toThrowError(CpanelApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and user", () => {
        it("should successfully ", () => {
            const { name, value } = new CpanelApiTokenHeader("fake", "user");
            expect({ name, value }).toEqual({
                name: "Authorization",
                value: "cpanel user:fake",
            });
        });
    });

    describe("when you attempt to pass an token with a user prefix", () => {
        it("should successfully ", () => {
            const { name, value }  = new CpanelApiTokenHeader("user:fake");
            expect({ name, value } ).toEqual({
                name: "Authorization",
                value: "cpanel user:fake",
            });
        });
    });

});

describe("WhmApiTokenHeader: ", () => {
    describe("when you attempt to pass an empty token", () => {
        it("should throw an error", () => {
            expect(() => new WhmApiTokenHeader("")).toThrowError(WhmApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and no user", () => {
        it("should throw an error", () => {
            expect(() => new WhmApiTokenHeader("fake")).toThrowError();
        });
    });

    describe("when you attempt to pass an token and an empty user", () => {
        it("should throw an error", () => {
            expect(() => new WhmApiTokenHeader("fake", "")).toThrowError(WhmApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and an empty user prefix", () => {
        it("should throw an error", () => {
            expect(() => new WhmApiTokenHeader(":fake")).toThrowError(WhmApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an empty token with a user prefix", () => {
        it("should throw an error", () => {
            expect(() => new WhmApiTokenHeader("user:")).toThrowError(WhmApiTokenInvalidError);
        });
    });

    describe("when you attempt to pass an token and user", () => {
        it("should successfully ", () => {
            const { name, value }  = new WhmApiTokenHeader("fake", "user");
            expect({ name, value }).toEqual({
                name: "Authorization",
                value: "whm user:fake",
            });
        });
    });

    describe("when you attempt to pass an token with a user prefix", () => {
        it("should successfully ", () => {
            const { name, value } = new WhmApiTokenHeader("user:fake");
            expect({ name, value }).toEqual({
                name: "Authorization",
                value: "whm user:fake",
            });
        });
    });
});
