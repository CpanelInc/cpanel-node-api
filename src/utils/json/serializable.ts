import {
    isUndefined,
    isNull,
    isBoolean,
    isNumber,
    isString,
    isArray,
    isPlainObject
} from "lodash";

/**
 * Verify if the value can be serialized to JSON
 *
 * @param value Value to check.
 * @source https://stackoverflow.com/questions/30579940/reliable-way-to-check-if-objects-is-serializable-in-javascript#answer-30712764
 */
function isSerializable(value: any) {
    if (isUndefined(value) ||
        isNull(value) ||
        isBoolean(value) ||
        isNumber(value) ||
        isString(value)) {
        return true;
    }

    if (!isPlainObject(value) &&
        !isArray(value)) {
        return false;
    }

    for (var key in value) {
        if (!isSerializable(value[key])) {
            return false;
        }
    }

    return true;
}

export {
    isSerializable
};
