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

import { UapiRequest } from "./request";

import { FilterOperator } from "../utils/filter";

import { SortDirection, SortType } from "../utils/sort";

import {
  Headers,
  CpanelApiTokenHeader,
  WhmApiTokenHeader,
  WhmApiTokenMismatchError,
} from "../utils/headers";

describe("UapiRequest", () => {
  describe("when not fully initialized", () => {
    it("should not generate without a namespace", () => {
      const request = new UapiRequest();
      expect(request).toBeDefined();
      expect(() => {
        request.generate();
      }).toThrowError();
    });
  });

  describe("when relying on default rules", () => {
    it("should generate a POST with a wwwurlencoded body by default", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests",
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests",
        body: "",
      });
    });

    it("should generate include paging params if set", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests",
        pager: {
          page: 3,
          pageSize: 7,
        },
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests",
        body: `api.paginate=1&api.paginate_start=15&api.paginate_size=7`,
      });
    });

    it("should generate filter params if set", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests",
        filters: [
          {
            column: "id",
            operator: FilterOperator.GreaterThan,
            value: 100,
          },
        ],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests",
        body: `api.filter_column_0=id&api.filter_type_0=gt&api.filter_term_0=100`,
      });
    });

    it("should generate multiple filter params if set", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests",
        filters: [
          {
            column: "id",
            operator: FilterOperator.GreaterThan,
            value: 100,
          },
          {
            column: "name",
            operator: FilterOperator.Contains,
            value: "unit test",
          },
        ],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests",
        body: `api.filter_column_0=id&api.filter_type_0=gt&api.filter_term_0=100&api.filter_column_1=name&api.filter_type_1=contains&api.filter_term_1=unit%20test`,
      });
    });

    it("should generate sort parameters if set", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests",
        sorts: [
          {
            column: "title",
            direction: SortDirection.Descending,
            type: SortType.Lexicographic,
          },
        ],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests",
        body: `api.sort=1&api.sort_column_0=title&api.sort_reverse_0=1&api.sort_method_0=lexicographic`,
      });
    });

    it("should generate the arguments", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests_by_label",
        arguments: [
          {
            name: "label",
            value: "unit",
          },
        ],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
        ]),
        url: "/execute/test/get_tests_by_label",
        body: "label=unit",
      });
    });
  });

  describe("when JSON encoding is requested", () => {
    it("should generate a POST with a JSON body by default", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "get_tests_by_label",
        arguments: [
          {
            name: "label",
            value: "unit",
          },
        ],
        config: {
          json: true,
        },
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/json",
          },
        ]),
        url: "/execute/test/get_tests_by_label",
        body: '{"label":"unit"}',
      });
    });
  });

  describe("when calling with cPanel API token with token and user", () => {
    it("should generate a correct interchange", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "simple_call",
        headers: [new CpanelApiTokenHeader("fake", "user")],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
          {
            name: "Authorization",
            value: "cpanel user:fake",
          },
        ]),
        url: "/execute/test/simple_call",
        body: "",
      });
    });
  });

  describe("when calling with cPanel API token with combined user/token", () => {
    it("should generate a correct interchange", () => {
      const request = new UapiRequest({
        namespace: "test",
        method: "simple_call",
        headers: [new CpanelApiTokenHeader("user:fake")],
      });
      expect(request).toBeDefined();
      expect(request.generate()).toEqual({
        headers: new Headers([
          {
            name: "Content-Type",
            value: "application/x-www-form-urlencoded",
          },
          {
            name: "Authorization",
            value: "cpanel user:fake",
          },
        ]),
        url: "/execute/test/simple_call",
        body: "",
      });
    });
  });

  describe("when calling with WHM API token", () => {
    it("should throw an error", () => {
      expect(() => {
        new UapiRequest({
          namespace: "test",
          method: "simple_call",
          headers: [new WhmApiTokenHeader("fake", "user")],
        });
      }).toThrowError(WhmApiTokenMismatchError);
    });
  });
});
