import {
    Argument,
    PerlBooleanArgument,
} from './argument';

import * as perl from './perl';

describe('Argument Class', () => {
    describe('constructor', () => {
        it('should throw an error when an empty string is passed in name field for name/value arguments', () => {
            expect(function() {
                new Argument('', '');
            }).toThrowError();
        })

        it('should build a new name/value when passed passed only a name and value', () => {
            const arg = new Argument('name', 'kermit');
            expect(arg).toBeDefined();
            expect(arg.name).toBe('name');
            expect(arg.value).toBe('kermit');
        })
    });
});

describe('PerlBooleanArgument Class', () => {
    describe('constructor', () => {
        it('should throw an error when an empty string is passed in name field for name/value arguments', () => {
            expect(function() {
                new PerlBooleanArgument('', true);
            }).toThrowError();
        })

        it('should build a new name/value when passed passed a name and true value', () => {
            const arg = new PerlBooleanArgument('name', true);
            expect(arg).toBeDefined();
            expect(arg.name).toBe('name');
            expect(arg.value).toBe(perl.fromBoolean(true));
        })

        it('should build a new name/value when passed passed a name and false value', () => {
            const arg = new PerlBooleanArgument('name', false);
            expect(arg).toBeDefined();
            expect(arg.name).toBe('name');
            expect(arg.value).toBe(perl.fromBoolean(false));
        })
    });
});
