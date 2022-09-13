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

import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";

/**
 * Verify if the value can be serialized to JSON
 *
 * @param value Value to check.
 * @source https://stackoverflow.com/questions/30579940/reliable-way-to-check-if-objects-is-serializable-in-javascript#answer-30712764
 */
function isSerializable(value: any) {
  if (
    isUndefined(value) ||
    isNull(value) ||
    isBoolean(value) ||
    isNumber(value) ||
    isString(value)
  ) {
    return true;
  }

  if (!isPlainObject(value) && !isArray(value)) {
    return false;
  }

  for (const key in value) {
    if (!isSerializable(value[key])) {
      return false;
    }
  }

  return true;
}

export { isSerializable };
