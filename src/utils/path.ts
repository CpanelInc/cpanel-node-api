export class LocationService {
    public get pathname(): string {
        return window.location.pathname;
    }

    public get port(): string {
        return window.location.port;
    }

    public get hostname(): string {
        return window.location.hostname;
    }

    public get protocol(): string {
        return window.location.protocol;
    }
}

/**
 * Check if the protocol is https.
 * @param  {string}  protocol
 * @return {boolean}          true if its https: in any case, false otherwise.
 */
export function isHttps(protocol: string): boolean {
    return (/^https:$/i).test(protocol);
}

/**
 * Check if the protocol is http.
 * @param  {string}  protocol
 * @return {boolean}          true if its http: in any case, false otherwise.
 */
 export function isHttp(protocol: string): boolean {
    return (/^http:$/i).test(protocol);
}

/**
 * Strip any trailing slashes from a string.
 *
 * @method stripTrailingSlash
 * @param  {string} path   The path string to process.
 * @return {string}        The path string without a trailing slash.
 */
 export function stripTrailingSlash(path: string) {
    return path && path.replace(/\/?$/, "");
}

/**
 * Add a trailing slashes to a string if it doesn't have one.
 *
 * @method ensureTrailingSlash
 * @param  {string} path   The path string to process.
 * @return {string}        The path string with a guaranteed trailing slash.
 */
 export function ensureTrailingSlash(path: string) {
    return path && path.replace(/\/?$/, "/");
}

type PortNameMap = { [index: string]: string };

// This will work in any context except a proxy URL to cpanel or webmail
// that accesses a URL outside /frontend (cpanel) or /webmail (webmail),
// but URLs like that are non-production by defintion.
const PortToApplicationMap: PortNameMap = {
    '80': 'other',
    '443': 'other',
    '2082': 'cpanel',
    '2083': 'cpanel',
    '2086': 'whostmgr',
    '2087': 'whostmgr',
    '2095': 'webmail',
    '2096': 'webmail',
    '9876': 'unittest',
    '9877': 'unittest',
    '9878': 'unittest',
    '9879': 'unittest',
    'frontend': 'cpanel',
    'webmail': 'webmail'
};

export class ApplicationPath {
    private unprotectedPaths = ['/resetpass', '/invitation'];

    /**
     * @property {string} [applicationName] Name of the application
     */
    applicationName: string;
    /**
    * @property {string} [protocol] Protocol used to access the page.
    */
    protocol: string;
    /**
     * @property {number} [port] Port used to access the product.
     */
    port: number;
    /**
     * @property {string} [path] Path part of the url
     */
    path: string;
    /**
     * @property {string} [domain] Domain used to access the page.
     */
    domain: string;

    /**
     * @property {string} [session] Session token
     */
    securityToken: string;

    /**
     * @property {string} [applicationPath] The path to the application.
     */
    applicationPath: string;

    /**
     * @property {string} [theme] The name of the theme in the path
     */
    theme: string;

    /**
     * @property {string} [themePath] The theme path
     */
    themePath: string;

    /**
     * @property {string} [rootUrl] Just the protocol, domain and port
     */
    rootUrl: string;

    /**
     * Create the PathHelper. This class is used to help generated paths
     * within an application. It has special knowledge about how paths are
     * constructructed in the cPanel family of applications.
     *
     * @param {LocationService} location Abstraction for the window.location object to aid in unit testing this module.
     */
    constructor(location: LocationService) {

        this.protocol = location.protocol;

        let port = location.port;
        if (!port) {

            // Since some browsers wont fill this in, we have to derive it from
            // the protocol if its not provided in the window.location object.
            if (isHttps(this.protocol)) {
                port = '443';
            } else if (isHttp(this.protocol)) {
                port = '80';
            }
        }

        this.domain = location.hostname;
        this.port = parseInt(port, 10);
        this.path = location.pathname;

        const pathMatch = (this.path.match(/((?:\/cpsess\d+)?)(?:\/([^\/]+))?/) || []);


        // For proxy subdomains, we look at the first subdomain to identify the application.
        if (/^whm\./.test(this.domain)) {
            this.applicationName = PortToApplicationMap['2087'];
        } else if (/^cpanel\./.test(this.domain)) {
            this.applicationName = PortToApplicationMap['2083'];
        } else if (/^webmail\./.test(this.domain)) {
            this.applicationName = PortToApplicationMap['2095'];
        } else {
            this.applicationName = PortToApplicationMap[port.toString()] || PortToApplicationMap[pathMatch[2]] || 'whostmgr';
        }

        this.securityToken = pathMatch[1] || '';
        this.applicationPath = this.securityToken ? this.path.replace(this.securityToken, '') : this.path;
        this.theme = '';
        if (!this.isUnprotected && ( this.isCpanel || this.isWebmail )) {
            const folders = this.path.split('/');
            this.theme = folders[3];
        }

        this.themePath = '';
        let themePath = this.securityToken + '/';
        if ( this.isUnprotected ) {
            themePath = '/';
        } else if ( this.isCpanel ) {
            themePath += 'frontend/' + this.theme + '/';
        } else if ( this.isWebmail ) {
            themePath += 'webmail/' + this.theme + '/';
        } else if ( this.isOther ) {
            // For unrecognized applications, use the path passed in PAGE.THEME_PATH
            themePath = '/';
        }
        this.themePath = themePath;
        this.rootUrl = this.protocol + '//' + this.domain + ':' + this.port
    }

    /**
     * Return whether we are running inside some other framework or application
     *
     * @method isOther
     * @return {boolean} true if this is an unrecognized application or framework; false otherwise
     */
    get isOther(): boolean {
        return (/other/i).test(this.applicationName);
    }

    /**
     * Return whether we are running inside an unprotected path
     *
     * @method isUnprotected
     * @return {boolean} true if this is unprotected; false otherwise
     */
    get isUnprotected(): boolean {
        return !this.securityToken && this.unprotectedPaths.indexOf( stripTrailingSlash(this.applicationPath) ) !== -1;
    }

    /**
     * Return whether we are running inside cpanel or something else (e.g., WHM)
     *
     * @method isCpanel
     * @return {boolean} true if this is cpanel; false otherwise
     */
    get isCpanel(): boolean {
        return (/cpanel/i).test(this.applicationName);
    }

    /**
     * Return whether we are running inside WHM or something else (e.g., whm)
     *
     * @method isWhm
     * @return {boolean} true if this is whm; false otherwise
     */
    get isWhm(): boolean {
        return (/whostmgr/i).test(this.applicationName);
    }

    /**
     * Return whether we are running inside WHM or something else (e.g., whm)
     *
     * @return {boolean} true if this is webmail; false otherwise
     */
    get isWebmail(): boolean {
        return (/webmail/i).test(this.applicationName);
    }

    /**
     * Get the domain relative path for the relative url path.
     *
     * @param {string} relative Relative path to the resource.
     * @return {string} Domain relative url path including theme if applicable for the application to the file.
     */
    buildPath(relative: string) {
        return this.themePath + relative;
    }

    /**
     * Get the full url path for the relative url path.
     *
     * @param {string} relative Relative path to the resource.
     * @return {string} Full url path including theme if applicable for the application to the file.
     */
    buildFullPath(relative: string) {
        return this.protocol + '//' + this.domain + ':' + this.port + this.buildPath(relative);
    }

    /**
     * Build a path relative to the security token
     *
     * @param {string} relative Relative path to the resource.
     * @return {string} Full path to the token relative resource.
     */
    buildTokenPath(relative: string) {
        return this.protocol + '//' + this.domain + ':' + this.port + this.securityToken + relative;
    }
}
