/**
 * Provides a mockable layer between the tools below and window.location.
 */
export class LocationService {
    /**
     * The pathname part of the url
     */
    public get pathname(): string {
        return window.location.pathname;
    }

    /**
     * The port part of the url.
     */
    public get port(): string {
        return window.location.port;
    }

    /**
     * The hostname part of the url.
     */
    public get hostname(): string {
        return window.location.hostname;
    }

    /**
     * The protocal part of the url
     */
    public get protocol(): string {
        return window.location.protocol;
    }
}
