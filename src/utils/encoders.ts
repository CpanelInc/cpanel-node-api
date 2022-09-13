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

import * as json from "./json/serializable";

/**
 * Abstract argument encoder
 */
export interface IArgumentEncoder {
  /**
   * Name of the content type if any. May be an empty string.
   */
  contentType: string;

  /**
   * Separator to inject at the start of the arguments.  May be empty.
   */
  separatorStart: string;

  /**
   * Separator to inject at the end of the arguments. May be empty.
   */
  separatorEnd: string;

  /**
   * Record separator
   */
  recordSeparator: string;

  /**
   * Encode a given value into the requested format.
   *
   * @param name Name of the field, may be empty string.
   * @param value Value to serialize
   * @param last True if this is the last argument being serialized.
   * @return Encoded version of the argument.
   */
  encode(name: string, value: any, last: boolean): string;
}

/**
 * Encode parameters using urlencode.
 */
export class UrlArgumentEncoder implements IArgumentEncoder {
  contentType = "";
  separatorStart = "?";
  separatorEnd = "";
  recordSeparator = "&";

  /**
   * Encode a given value into query-string compatible format.
   *
   * @param name Name of the field, may be empty string.
   * @param value Value to serialize
   * @param last True if this is the last argument being serialized.
   * @return Encoded version of the argument.
   */
  encode(name: string, value: any, last: boolean): string {
    if (!name) {
      throw new Error("Name must have a non-empty value");
    }
    return (
      `${name}=${encodeURIComponent(value.toString())}` +
      (!last ? this.recordSeparator : "")
    );
  }
}

/**
 * Encode parameters using application/x-www-form-urlencoded
 */
export class WwwFormUrlArgumentEncoder implements IArgumentEncoder {
  contentType = "application/x-www-form-urlencoded";
  separatorStart = "";
  separatorEnd = "";
  recordSeparator = "&";

  /**
   * Encode a given value into the application/x-www-form-urlencoded.
   *
   * @param name Name of the field, may be empty string.
   * @param value Value to serialize
   * @param last True if this is the last argument being serialized.
   * @return Encoded version of the argument.
   */
  encode(name: string, value: any, last: boolean): string {
    if (!name) {
      throw new Error("Name must have a non-empty value");
    }

    return (
      `${name}=${encodeURIComponent(value.toString())}` +
      (!last ? this.recordSeparator : "")
    );
  }
}

/**
 * Encode the parameter into JSON
 */
export class JsonArgumentEncoder implements IArgumentEncoder {
  contentType = "application/json";
  separatorStart = "{";
  separatorEnd = "}";
  recordSeparator = ",";

  /**
   * Encode a given value into the JSON application/json body.
   *
   * @param name Name of the field.
   * @param value Value to serialize
   * @param last True if this is the last argument being serialized.
   * @return {string}        Encoded version of the argument.
   */
  encode(name: string, value: any, last: boolean): string {
    if (!name) {
      throw new Error("Name must have a non-empty value");
    }
    if (!json.isSerializable(value)) {
      throw new Error("The passed in value can not be serialized to JSON");
    }
    return (
      JSON.stringify(name) +
      ":" +
      JSON.stringify(value) +
      (!last ? this.recordSeparator : "")
    );
  }
}
