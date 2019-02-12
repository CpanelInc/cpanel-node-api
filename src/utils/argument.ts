/**
 * Abstract interface that value based arguments must implement
 */
export interface IArgument {
    /**
     * Name of the argument
     */
    name: string;

    /**
     * Value of the argument.
     */
    value: any;
}

/**
 * An name/value pair argument
 */
export class Argument implements IArgument  {

    /**
     * Name of the argument.
     * @type {string}
     */
    name: string;

    /**
     * Value of the argument
     * @type {any}
     */
    value: any;

    /**
     * Build a new Argument.
     *
     * @param {string}       name   Ignored if ArgumentType is Positional
     * @param {any}          value  Value to initialize the argument to.
     */
    constructor(name: string, value: any) {
        if (!name) {
            throw new Error('You must provide a name when creating a name/value argument')
        }
        this.name = name;
        this.value = value;
    }
}
