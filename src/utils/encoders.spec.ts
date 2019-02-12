import {
    IArgumentEncoder,
    UrlArgumentEncoder,
    WwwFormUrlArgumentEncoder,
    JsonArgumentEncoder,
} from './encoders';

describe('UrlArgumentEncoder', () => {
    let encoder: IArgumentEncoder;
    beforeEach(() => {
        encoder = new UrlArgumentEncoder();
    })

    it('should be created by new()', () => {
        expect(encoder).toBeDefined();
        expect(encoder.contentType).toBe('');
        expect(encoder.separatorStart).toBe('?');
        expect(encoder.separatorEnd).toBe('');
        expect(encoder.recordSeparator).toBe('&');
    });

    it('should throw an error when passed an empty name', () => {
        expect(() => encoder.encode('', '', false)).toThrowError();
    });

    it('should encode data correctly', () => {
        expect(encoder.encode('name', '', false)).toBe('name=&');
        expect(encoder.encode('name', '', true)).toBe('name=');
        expect(encoder.encode('name', 'value', false)).toBe('name=value&');
        expect(encoder.encode('name', 'value', true)).toBe('name=value');
        expect(encoder.encode('name', '&', false)).toBe('name=%26&');
        expect(encoder.encode('name', '&', true)).toBe('name=%26');
    });
});

describe('WwwFormUrlArgumentEncoder', () => {
    let encoder: IArgumentEncoder;
    beforeEach(() => {
        encoder = new WwwFormUrlArgumentEncoder();
    })

    it('should be created by new()', () => {
        expect(encoder).toBeDefined();
        expect(encoder.contentType).toBe('application/x-www-form-urlencoded');
        expect(encoder.separatorStart).toBe('');
        expect(encoder.separatorEnd).toBe('');
        expect(encoder.recordSeparator).toBe('&');
    });

    it('should throw an error when passed an empty name', () => {
        expect(() => encoder.encode('', '', false)).toThrowError();
    });

    it('should encode data correctly', () => {
        expect(encoder.encode('name', '', false)).toBe('name=&');
        expect(encoder.encode('name', '', true)).toBe('name=');
        expect(encoder.encode('name', 'value', false)).toBe('name=value&');
        expect(encoder.encode('name', 'value', true)).toBe('name=value');
        expect(encoder.encode('name', '&', false)).toBe('name=%26&');
        expect(encoder.encode('name', '&', true)).toBe('name=%26');
    });
});

describe('JsonArgumentEncoder', () => {
    let encoder: IArgumentEncoder;
    beforeEach(() => {
        encoder = new JsonArgumentEncoder();
    })

    it('should be created by new()', () => {
        expect(encoder).toBeDefined();
        expect(encoder.contentType).toBe('application/json');
        expect(encoder.separatorStart).toBe('{');
        expect(encoder.separatorEnd).toBe('}');
        expect(encoder.recordSeparator).toBe(',');
    });

    it('should encode data correctly', () => {
        expect(encoder.encode('data', 'value')).toBe('"data":"value"');
        expect(encoder.encode('data', '&')).toBe('"data":"&"');
        expect(encoder.encode('data', 1)).toBe('"data":1');
        expect(encoder.encode('data', true)).toBe('"data":true');
        expect(encoder.encode('data', [ 1, 2, 3 ])).toBe('"data":[1,2,3]');
        expect(encoder.encode('data', { a: 1, b: 2 })).toBe('"data":{"a":1,"b":2}');
    });

    it('should throw an error when passed a value that can not be serialized', () => {
        expect(() => encoder.encode('', '')).toThrowError();
        expect(() => encoder.encode('', { a: 1, b: () => true })).toThrowError();
    });
});
