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

import { LocationService } from "./location-service";

/**
 * Check if the protocol is https.
 * @param  protocol Protocol to test
 * @return true if its https: in any case, false otherwise.
 */
export function isHttps(protocol: string): boolean {
  return /^https:$/i.test(protocol);
}

/**
 * Check if the protocol is http.
 * @param  protocol Protocol to test
 * @return true if its http: in any case, false otherwise.
 */
export function isHttp(protocol: string): boolean {
  return /^http:$/i.test(protocol);
}

/**
 * Strip any trailing slashes from a string.
 *
 * @method stripTrailingSlash
 * @param  path The path string to process.
 * @return The path string without a trailing slash.
 */
export function stripTrailingSlash(path: string) {
  return path && path.replace(/\/?$/, "");
}

/**
 * Add a trailing slash to a string if it doesn't have one.
 *
 * @method ensureTrailingSlash
 * @param  path The path string to process.
 * @return The path string with a guaranteed trailing slash.
 */
export function ensureTrailingSlash(path: string) {
  return path && path.replace(/\/?$/, "/");
}

type PortNameMap = { [index: string]: string };

// This will work in any context except a proxy URL to cPanel or Webmail
// that accesses a URL outside /frontend (cPanel) or /webmail (Webmail),
// but URLs like that are non-production by definition.
const PortToApplicationMap: PortNameMap = {
  "80": "other",
  "443": "other",
  "2082": "cpanel",
  "2083": "cpanel",
  "2086": "whostmgr",
  "2087": "whostmgr",
  "2095": "webmail",
  "2096": "webmail",
  "9876": "unittest",
  "9877": "unittest",
  "9878": "unittest",
  "9879": "unittest",
  frontend: "cpanel",
  webmail: "webmail",
};

/**
 * Helper class used to calculate paths within cPanel applications.
 */
export class ApplicationPath {
  private unprotectedPaths = ["/resetpass", "/invitation"];

  /**
   * Name of the application
   */
  applicationName: string;

  /**
   * Protocol used to access the page.
   */
  protocol: string;

  /**
   * Port used to access the product.
   */
  port: number;

  /**
   * Path part of the URL.
   */
  path: string;

  /**
   * Domain used to access the page.
   */
  domain: string;

  /**
   *Session token.
   */
  securityToken: string;

  /**
   * The path to the application.
   */
  applicationPath: string;

  /**
   * The name of the theme in the path.
   */
  theme: string;

  /**
   * The theme path.
   */
  themePath: string;

  /**
   * Just the protocol, domain, and port.
   */
  rootUrl: string;

  /**
   * Create the PathHelper. This class is used to help generate paths
   * within an application. It has special knowledge about how paths are
   * constructed in the cPanel family of applications.
   *
   * @param location Abstraction for the window.location object to aid in unit testing this module.
   */
  constructor(location: LocationService) {
    this.protocol = location.protocol;

    let port = location.port;
    if (!port) {
      // Since some browsers won't fill this in, we have to derive it from
      // the protocol if it's not provided in the window.location object.
      if (isHttps(this.protocol)) {
        port = "443";
      } else if (isHttp(this.protocol)) {
        port = "80";
      }
    }

    this.domain = location.hostname;
    this.port = parseInt(port, 10);
    this.path = location.pathname;

    const pathMatch =
      // eslint-disable-next-line no-useless-escape -- regex, not a string
      this.path.match(/((?:\/cpsess\d+)?)(?:\/([^\/]+))?/) || [];

    // For proxy subdomains, we look at the first subdomain to identify the application.
    if (/^whm\./.test(this.domain)) {
      this.applicationName = PortToApplicationMap["2087"];
    } else if (/^cpanel\./.test(this.domain)) {
      this.applicationName = PortToApplicationMap["2083"];
    } else if (/^webmail\./.test(this.domain)) {
      this.applicationName = PortToApplicationMap["2095"];
    } else {
      this.applicationName =
        PortToApplicationMap[port.toString()] ||
        PortToApplicationMap[pathMatch[2]] ||
        "whostmgr";
    }

    this.securityToken = pathMatch[1] || "";
    this.applicationPath = this.securityToken
      ? this.path.replace(this.securityToken, "")
      : this.path;
    this.theme = "";
    if (!this.isUnprotected && (this.isCpanel || this.isWebmail)) {
      const folders = this.path.split("/");
      this.theme = folders[3];
    }

    this.themePath = "";
    let themePath = this.securityToken + "/";
    if (this.isUnprotected) {
      themePath = "/";
    } else if (this.isCpanel) {
      themePath += "frontend/" + this.theme + "/";
    } else if (this.isWebmail) {
      themePath += "webmail/" + this.theme + "/";
    } else if (this.isOther) {
      // For unrecognized applications, use the path passed in PAGE.THEME_PATH
      themePath = "/";
    }
    this.themePath = themePath;
    this.rootUrl = this.protocol + "//" + this.domain + ":" + this.port;
  }

  /**
   * Return whether we are running inside some other framework or application
   *
   * @return true if this is an unrecognized application or framework; false otherwise
   */
  get isOther(): boolean {
    return /other/i.test(this.applicationName);
  }

  /**
   * Return whether we are running inside an unprotected path
   *
   * @return true if this is unprotected; false otherwise
   */
  get isUnprotected(): boolean {
    return (
      !this.securityToken &&
      this.unprotectedPaths.indexOf(
        stripTrailingSlash(this.applicationPath)
      ) !== -1
    );
  }

  /**
   * Return whether we are running inside cPanel or something else (e.g., WHM)
   *
   * @return true if this is cPanel; false otherwise
   */
  get isCpanel(): boolean {
    return /cpanel/i.test(this.applicationName);
  }

  /**
   * Return whether we are running inside WHM or something else (e.g., WHM)
   *
   * @return true if this is WHM; false otherwise
   */
  get isWhm(): boolean {
    return /whostmgr/i.test(this.applicationName);
  }

  /**
   * Return whether we are running inside WHM or something else (e.g., WHM)
   *
   * @return true if this is Webmail; false otherwise
   */
  get isWebmail(): boolean {
    return /webmail/i.test(this.applicationName);
  }

  /**
   * Get the domain relative path for the relative URL path.
   *
   * @param relative Relative path to the resource.
   * @return Domain relative URL path including theme, if applicable, for the application to the file.
   */
  buildPath(relative: string) {
    return this.themePath + relative;
  }

  /**
   * Get the full url path for the relative URL path.
   *
   * @param relative Relative path to the resource.
   * @return Full URL path including theme, if applicable, for the application to the file.
   */
  buildFullPath(relative: string) {
    return (
      this.protocol +
      "//" +
      this.domain +
      ":" +
      this.port +
      this.buildPath(relative)
    );
  }

  /**
   * Build a path relative to the security token
   *
   * @param relative Relative path to the resource.
   * @return Full path to the token relative resource.
   */
  buildTokenPath(relative: string) {
    return (
      this.protocol +
      "//" +
      this.domain +
      ":" +
      this.port +
      this.securityToken +
      relative
    );
  }
}
