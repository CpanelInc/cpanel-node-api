import * as json from './json/serializable';

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
     * @type {string}
     */
    recordSeparator: string;

    /**
     * Encode a given value into the requested format.
     *
     * @param  {string}  name  Name of the field, may be empty string.
     * @param  {any}     value Value to serialize
     * @param  {boolean} last  True if this is the last argument being serialized.
     * @return {string}        Encoded version of the argument.
     */
    encode(name: string, value: any, last: boolean): string;
}

/**
 * Encode parameters using url encode.
 */
export class UrlArgumentEncoder implements IArgumentEncoder {

    contentType: string = '';
    separatorStart: string = '?';
    separatorEnd: string = '';
    recordSeparator: string = '&';

    /**
     * Encode a given value into query-string compatible format.
     *
     * @param  {string}  name  Name of the field, may be empty string.
     * @param  {any}     value Value to serialize
     * @param  {boolean} last  True if this is the last argument being serialized.
     * @return {string}        Encoded version of the argument.
     */
    encode(name: string, value: any, last: boolean): string {
        if(!name) {
            throw new Error('Name must have a non-empty value');
        }
        return `${name}=${encodeURIComponent(value.toString())}`+ (!last ? this.recordSeparator : '');
    }
}

/**
 * Encode parameters using application/x-www-form-urlencoded
 */
export class WwwFormUrlArgumentEncoder implements IArgumentEncoder {

    contentType: string = 'application/x-www-form-urlencoded';
    separatorStart: string = '';
    separatorEnd: string = '';
    recordSeparator: string = '&';

    /**
     * Encode a given value into the application/x-www-form-urlencoded.
     *
     * @param  {string}  name  Name of the field, may be empty string.
     * @param  {any}     value Value to serialize
     * @param  {boolean} last  True if this is the last argument being serialized.
     * @return {string}        Encoded version of the argument.
     */
    encode(name: string, value: any, last: boolean): string {
        if(!name) {
            throw new Error('Name must have a non-empty value');
        }

        return `${name}=${encodeURIComponent(value.toString())}` + (!last ? this.recordSeparator : '');
    }
}

/**
 * Encode the parameter into json
 */
export class JsonArgumentEncoder implements IArgumentEncoder {
    contentType: string = 'application/json';
    separatorStart: string = '{';
    separatorEnd:    string = '}';
    recordSeparator: string = ',';

    /**
     * Encode a given value into the JSON application/json body.
     *
     * @param  {string}  name  Name of the field.
     * @param  {any}     value Value to serialize
     * @param  {boolean} last  True if this is the last argument being serialized.
     * @return {string}        Encoded version of the argument.
     */
    encode(name: string, value: any, last: boolean): string {
        if(!name) {
            throw new Error('Name must have a non-empty value');
        }
        if(!json.isSerializable(value)) {
            throw new Error('The passed in value can not be serialized to JSON');
        }
        return JSON.stringify(name) + ':' + JSON.stringify(value) + (!last ? this.recordSeparator : '');
    }
}
