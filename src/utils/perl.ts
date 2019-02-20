/**
 * Convert from a JavaScript boolean to a Perl boolean.
 */
export function fromBoolean(value: boolean) {
    return value ? '1' : '0';
}

const perlFalse = new Set(['', '0', 0]);

/**
 * Convert from a Perl boolean to a JavaScript boolean
 */
export function toBoolean(value: any) {
    if (perlFalse.has(value)) {
        return false;
    }
    return true;
}
