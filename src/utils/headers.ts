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

/**
 * HTTP Header Abstraction
 */
export interface Header {
    /**
     * Name of the header
     */
    name: string;

    /**
     * Value of the header
     */
    value: string;
}

export type HeaderHash = { [index: string]: string };

/**
 * HTTP Headers Collection Abstraction
 *
 * The abstraction is an adapter to allow easy transformation of the headers array
 * into various formats for external HTTP libraries.
 */
export class Headers {
    private headers: Header[];

    /**
     * Create the adapter.
     *
     * @param headers - List of headers.
     */
    constructor(headers: Header[] = []) {
        this.headers = headers;
    }

    /**
     * Push a header into the collection.
     *
     * @param header - A header to add to the collection
     */
    push(header: Header) {
        this.headers.push(header);
    }

    /**
     * Iterator for the headers collection.
     *
     * @param fn - Transform for the forEach
     * @param thisArg - Optional reference to `this` to apply to the transform function.
     */
    forEach(fn: (v: Header, i: number, a: Header[]) => void, thisArg?: any) {
        this.headers.forEach(fn, thisArg);
    }

    /**
     * Retrieve the headers as an array of Headers
     */
    toArray(): Header[] {
        const copy: Header[] = [];
        this.headers.forEach((h) =>
            copy.push({ name: h.name, value: h.value })
        );
        return copy;
    }

    /**
     * Retrieve the headers as an object
     */
    toObject(): HeaderHash {
        return this.headers.reduce((o: HeaderHash, header: Header) => {
            o[header.name] = header.value;
            return o;
        }, {});
    }
}

export class CustomHeader implements Header {
    constructor(private _header: Header) {}

    public get name() {
        return this._header.name;
    }

    public get value() {
        return this._header.value;
    }
}

export class CpanelApiTokenInvalidError extends Error {
    public readonly name = "CpanelApiTokenInvalidError";
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly. This fixes unit tests.
        Object.setPrototypeOf(this, CpanelApiTokenInvalidError.prototype);
    }
}

export class CpanelApiTokenMismatchError extends Error {
    public readonly name = "CpanelApiTokenMismatchError";
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly. This fixes unit tests.
        Object.setPrototypeOf(this, CpanelApiTokenMismatchError.prototype);
    }
}

export class CpanelApiTokenHeader extends CustomHeader {
    constructor(token: string, user?: string) {
        if (!token) {
            throw new CpanelApiTokenInvalidError(
                "You must pass a valid token to the constructor."
            );
        }
        if (!user && !/^.+[:]/.test(token)) {
            throw new CpanelApiTokenInvalidError(
                "You must pass a cPanel username associated with the cPanel API token."
            );
        }
        if (!user && !/[:].+$/.test(token)) {
            throw new CpanelApiTokenInvalidError(
                "You must pass a valid cPanel API token."
            );
        }
        super({
            name: "Authorization",
            value: `cpanel ${user ? user + ":" : ""}${token}`,
        });
    }
}

export class WhmApiTokenInvalidError extends Error {
    public readonly name = "WhmApiTokenInvalidError";
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly. This fixes unit tests.
        Object.setPrototypeOf(this, WhmApiTokenInvalidError.prototype);
    }
}

export class WhmApiTokenMismatchError extends Error {
    public readonly name = "WhmApiTokenMismatchError";
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly. This fixes unit tests.
        Object.setPrototypeOf(this, WhmApiTokenMismatchError.prototype);
    }
}

export class WhmApiTokenHeader extends CustomHeader {
    constructor(token: string, user?: string) {
        if (!token) {
            throw new WhmApiTokenInvalidError(
                "You must pass a valid token to the constructor."
            );
        }
        if (!user && !/^.+:/.test(token)) {
            throw new WhmApiTokenInvalidError(
                "You must pass a WHM username associated with the WHM API token."
            );
        }
        if (!user && !/:.+$/.test(token)) {
            throw new WhmApiTokenInvalidError(
                "You must pass a valid WHM API token."
            );
        }
        super({
            name: "Authorization",
            value: `whm ${user ? user + ":" : ""}${token}`,
        });
    }
}
