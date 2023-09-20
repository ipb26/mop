import { flow } from "fp-ts/function"
import { buildError, ErrorFactory } from "./base"
import { noOp } from "./common"
import { map } from "./core"
import { test } from "./test"

/**
 * Gets an item from LocalStorage.
 */
export const localStorage = flow(noOp<string>, map(key => window.localStorage.getItem(key)))

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
