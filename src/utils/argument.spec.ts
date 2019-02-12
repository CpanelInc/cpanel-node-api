import {
    Argument,
} from './argument';

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
