import {
    FilterOperator,
    Filter
} from './filter';

describe('Filter Class', () => {
    describe('constructor', () => {
        it('should throw an error when an empty string is passed in column', () => {
            expect(function() {
                new Filter('', FilterOperator.Contains, '');
            }).toThrowError();
        })
        it('should build a new Filter when passed all the parameters', () => {
            const filter = new Filter('name', FilterOperator.Contains, 'kermit');
            expect(filter).toBeDefined();
            expect(filter.column).toBe('name');
            expect(filter.operator).toBe(FilterOperator.Contains);
            expect(filter.value).toBe('kermit');
        })
    });
});


