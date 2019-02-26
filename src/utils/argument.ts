import { fromBoolean } from './perl';

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
     * @param {string}       name   Name of the argument
     * @param {any}          value  Value of the argument.
     */
    constructor(name: string, value: any) {
        if (!name) {
            throw new Error('You must provide a name when creating a name/value argument')
        }
        this.name = name;
        this.value = value;
    }
}

/**
 * Specialty argument class that will auto coerce a boolean to a perl boolean
 */
export class PerlBooleanArgument extends Argument {

    /**
     * Build a new Argument
     * @param {string}  name  Name of the argument
     * @param {boolean} value Value of the argument. Will be serialized to use perls boolean rules.
     */
    constructor(name: string, value: boolean) {
        super(name, fromBoolean(value));
    }
}
