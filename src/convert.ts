
// Type converters.

import { flow } from "fp-ts/function"
import objectInspect from "object-inspect"
import { buildError, ErrorFactory } from "./base"
import { failure, flatMap, map, of } from "./core"
import { tryBoth } from "./experimental"
import { regexFromString } from "./internal"
import { maybe } from "./optionality"
import { blankToEmpty, numeric } from "./string"
import { tryCatch } from "./try-catch"
import { isNumber, isString } from "./types"

/**
 * Converts any value to a boolean using the !! operator.
 */
export const unknownToBoolean = () => map(_ => !!_);

export const stringToFloat = (message: ErrorFactory<[unknown | undefined, string]> = "This value must be numeric.") => flow(numeric(v => buildError(message, [undefined, v])), tryCatch(parseFloat, message));
export const stringToInt = (message: ErrorFactory<[unknown | undefined, string]> = "This value must be numeric.") => flow(numeric(v => buildError(message, [undefined, v])), tryCatch(parseInt, message));
export const stringOrNumberToInt = (message: ErrorFactory<unknown> = "This value must be a number or a numeric string.") => tryBoth(flow(isString(message), blankToEmpty(), maybe(flow(numeric(message), stringToInt(message)))), isNumber(message))
export const stringOrNumberToFloat = (message: ErrorFactory<unknown> = "This value must be a number or a numeric string.") => tryBoth(flow(isString(message), blankToEmpty(), maybe(flow(numeric(message), stringToFloat(message)))), isNumber(message))
export const numberToString = () => map((_: number) => _.toString())

/**
 * Converts a date to a timestamp.
 */
export const dateToTime = () => map((_: Date) => _.getTime())

/**
 * Converts a timestamp to a date.
 */
export const timeToDate = () => map((_: number) => new Date(_))

/**
 * Converts a date to a string. Uses Date.toISOString method.
 */
export const dateToIsoString = () => map((_: Date) => _.toISOString())

/**
 * Converts a timestamp to a date. Uses Date.parse method.
 */
export const stringToDate = () => map((_: string) => Date.parse(_))

/**
 * Converts a string to a regex object.
 */
export const stringToRegex = (message: ErrorFactory<[unknown, string] | string> = error => "This is not a valid regex pattern" + (typeof error !== "string" ? " (" + objectInspect(error[0]) + ")" : "")) => flatMap((input: string) => {
    try {
        const regex = regexFromString(input)
        if (regex === undefined) {
            return failure(buildError(message, input))
        }
        return of(regex)
    }
    catch (e) {
        return failure(buildError(message, [e, input]))
    }
})
