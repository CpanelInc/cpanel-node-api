import {
    HttpVerb
} from './http/verb';

export type Nullable<T> = { [P in keyof T]: T[P] | null }

/**
 * Abstract argument serialization rule
 */
export interface ArgumentSerializationRule {
    /**
     * Name of the verb or DEFAULT
     */
    verb: string;
    /**
     * Flag to indicate if the data is in the body. If false, its in the url.
     */
    dataInBody: boolean;
}

/**
 * Collection of argument serialize rules
 */
export type ArgumentSerializationRules = {
    [key: string]: ArgumentSerializationRule;
}

/**
 * Default argument serialization rules for each well known HTTP verb.
 */
export class DefaultArgumentSerializationRules {
    map: ArgumentSerializationRules = {};

    /**
     * Construct the lookup table for well know verbs.
     */
    constructor() {
        // fallback rule if the verb is not defined.
        this.map['DEFAULT'] = {
            verb: 'DEFAULT',
            dataInBody: true,
        };

        [
            HttpVerb.GET,
            HttpVerb.DELETE,
            HttpVerb.HEAD
        ].forEach((verb: HttpVerb) => {
            let label = HttpVerb[verb].toString();
            console.log(label);
            this.map[label] = {
                verb: label,
                dataInBody: false,
            };
        });

        [
            HttpVerb.POST,
            HttpVerb.PUT,
            HttpVerb.PATCH
        ].forEach((verb: HttpVerb) => {
            let label = HttpVerb[verb].toString();
            this.map[label] = {
                verb: label,
                dataInBody: true,
            };
        });
    }

    /**
     * Get a rule for serialization of arguments. This tells the generators where
     * argument data is packaged in a request. Arguments can be located in one of
     * the following:
     *
     *   Body
     *   Url
     *
     * @param {HttpVerb|String} verb - verb to lookup.
     */
    getRule(verb: HttpVerb | string): ArgumentSerializationRule {
        let name: string = typeof(verb) === 'string' ? verb : HttpVerb[verb].toString();
        let rule = this.map[name];
        if (!rule) {
            rule = this.map['DEFAULT'];
        }
        return rule;
    }
}

/**
 * Singleton with the default argument serialization rules in it.
 */
const argumentSerializationRules = new DefaultArgumentSerializationRules();

export {
    argumentSerializationRules,
}
