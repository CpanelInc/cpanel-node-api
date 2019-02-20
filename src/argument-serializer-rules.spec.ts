import {
    HttpVerb
} from './http/verb';

import {
    argumentSerializationRules
} from './argument-serializer-rules';

describe('ArgumentSerializationRules getRule()', () => {
    it('should return a predefined rule when passed HttpVerb.GET', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.GET);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('GET')
        expect(rule.dataInBody).toBe(false);
    })

    it('should return a predefined rule when passed HttpVerb.DELETE', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.DELETE);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('DELETE')
        expect(rule.dataInBody).toBe(false);
    })

    it('should return a predefined rule when passed HttpVerb.HEAD', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.HEAD);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('HEAD')
        expect(rule.dataInBody).toBe(false);
    })

    it('should return a predefined rule when passed HttpVerb.POST', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.POST);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('POST')
        expect(rule.dataInBody).toBe(true);
    })

    it('should return a predefined rule when passed HttpVerb.PUT', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.PUT);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('PUT')
        expect(rule.dataInBody).toBe(true);
    })

    it('should return a predefined rule when passed HttpVerb.PATCH', () => {
        const rule = argumentSerializationRules.getRule(HttpVerb.PATCH);
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('PATCH')
        expect(rule.dataInBody).toBe(true);
    })

    it('should return a predefined rule when passed an unrecognized verb', () => {
        const rule = argumentSerializationRules.getRule('CUSTOM');
        expect(rule).toBeDefined();
        expect(rule.verb).toBe('DEFAULT')
        expect(rule.dataInBody).toBe(true);
    })
});
