import * as E from "fp-ts/Either"
import { buildError, ErrorFactory } from "./base"
import { flatMap } from "./core"
import { testWith } from "./test"

/**
 * Tries to execute a function, catching errors. Returns a result containing the return value of the function.
 */
export const tryCatch = <I, O>(func: (value: I) => O, message: ErrorFactory<[unknown, I]> = error => `${error[0]}`) => flatMap((value: I) => E.tryCatch(() => func(value), _ => buildError(message, [_, value])))

/**
 * Does validation, catching errors. If no errors caught, returns a result containing the initial value instead of the return value of the validation function.
 */
export const testTryCatch = <I>(func: (value: I) => unknown, message: ErrorFactory<[unknown, I]> = error => `${error[0]}`) => {
    return testWith(tryCatch(func, message))
}
