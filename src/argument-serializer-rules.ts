// MIT License
//
// Copyright 2021 cPanel L.L.C.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

import { HttpVerb } from "./http/verb";

export type Nullable<T> = { [P in keyof T]: T[P] | null };

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
};

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
        this.map["DEFAULT"] = {
            verb: "DEFAULT",
            dataInBody: true,
        };

        [HttpVerb.GET, HttpVerb.DELETE, HttpVerb.HEAD].forEach(
            (verb: HttpVerb) => {
                const label = HttpVerb[verb].toString();
                this.map[label] = {
                    verb: label,
                    dataInBody: false,
                };
            },
        );

        [HttpVerb.POST, HttpVerb.PUT, HttpVerb.PATCH].forEach(
            (verb: HttpVerb) => {
                const label = HttpVerb[verb].toString();
                this.map[label] = {
                    verb: label,
                    dataInBody: true,
                };
            },
        );
    }

    /**
     * Get a rule for serialization of arguments. This tells the generators where
     * argument data is packaged in a request. Arguments can be located in one of
     * the following:
     *
     *   Body,
     *   Url
     *
     * @param verb verb to lookup.
     */
    getRule(verb: HttpVerb | string): ArgumentSerializationRule {
        const name: string =
            typeof verb === "string" ? verb : HttpVerb[verb].toString();
        let rule = this.map[name];
        if (!rule) {
            rule = this.map["DEFAULT"];
        }
        return rule;
    }
}

/**
 * Singleton with the default argument serialization rules in it.
 */
const argumentSerializationRules = new DefaultArgumentSerializationRules();

export { argumentSerializationRules };
