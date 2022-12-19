import * as E from "fp-ts/Either"
import objectInspect from "object-inspect"
import { buildError, ErrorFactory } from "./base"
import { flatMap } from "./core"
import { testWith } from "./test"

/**
 * Tries to execute a function, catching errors.
 */
export const tryCatch = <I, O>(func: (value: I) => O, message: ErrorFactory<[unknown, I]> = objectInspect) => flatMap((value: I) => E.tryCatch(() => func(value), _ => buildError(message, [_, value])))

/**
 * Does validation, catching errors. If no errors caught, returns the initial value instead of the return value of the validation function.
 */
export const testTryCatch = <I>(func: (value: I) => unknown, message: ErrorFactory<[unknown, I]> = objectInspect) => {
    return testWith(tryCatch(func, message))
}
