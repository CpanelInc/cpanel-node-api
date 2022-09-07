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

import { fromBoolean } from "./perl";

/**
 * Abstract interface that value-based arguments must implement
 */
export interface IArgument {
  /**
   * Name of the argument
   */
  name: string;

  /**
   * Value of the argument.
   */
  value: any;
}

/**
 * An name/value pair argument
 */
export class Argument implements IArgument {
  /**
   * Name of the argument.
   */
  name: string;

  /**
   * Value of the argument
   */
  value: any;

  /**
   * Build a new Argument.
   *
   * @param name Name of the argument
   * @param value Value of the argument.
   */
  constructor(name: string, value: any) {
    if (!name) {
      throw new Error(
        "You must provide a name when creating a name/value argument"
      );
    }
    this.name = name;
    this.value = value;
  }
}

/**
 * Specialty argument class that will auto-coerce a Boolean to a perl Boolean
 */
export class PerlBooleanArgument extends Argument {
  /**
   * Build a new Argument
   * @param  name  Name of the argument
   * @param value Value of the argument. Will be serialized to use perl's Boolean rules.
   */
  constructor(name: string, value: boolean) {
    super(name, fromBoolean(value));
  }
}
