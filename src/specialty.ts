import { flow } from "fp-ts/function"
import { buildError, ErrorFactory } from "./base"
import { noOp } from "./common"
import { map } from "./core"
import { test } from "./test"
import { tryCatch } from "./try-catch"

/**
 * Gets an item from LocalStorage.
 */
export const localStorage = flow(noOp<string>, map(key => window.localStorage.getItem(key)))

/**
 * Creates a mapper that turns a string into JSON.
 */
export const fromJson = (errorFactory: ErrorFactory<[unknown, string]> = _ => "This is not valid json") => tryCatch<string, unknown>(JSON.parse, errorFactory)

/**
 * Creates a mapper that turns JSON into a string.
 */
export const toJson = (errorFactory: ErrorFactory<[unknown, unknown]> = _ => "Could not stringify to JSON") => tryCatch<unknown, string>(JSON.stringify, errorFactory)

/**
 * Requires that 2 fields match.
 */
export const confirm = <I>(a: keyof I & string, b: keyof I & string, applyTo: "initial" | "confirm" | "both" = "confirm", errorFactory: ErrorFactory<I> = "Confirmation does not match.") => {
    return test<I>(input => input[a] === input[b], input => {
        const error1 = buildError(errorFactory, input).map(error => ({ ...error, path: [a], value: input[a] }))
        const error2 = buildError(errorFactory, input).map(error => ({ ...error, path: [b], value: input[b] }))
        if (applyTo === "initial") {
            return error1
        }
        else if (applyTo === "confirm") {
            return error2
        }
        else {
            return error1.concat(error2)
        }
    })
}
