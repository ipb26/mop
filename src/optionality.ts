import { flow } from "fp-ts/function"
import { buildError, ErrorFactory, Mapper, Result } from "./base"
import { failure, flatMap, of } from "./core"
import { exec } from "./exec"
import { callOrGet, ValueOrFactory } from "./internal"
import { tryCatch } from "./try-catch"

/**
 * Require a value.
 * @param message An optional custom error message.
 * @returns A mapper that returns a value or error if undefined.
 */
export const req = <T>(error: ErrorFactory<T | undefined | null> = "This value is required"): Mapper<T | undefined | null, T> => flatMap(value => {
    if (value === undefined || value === null) {
        return failure(buildError(error, value));
    }
    return of(value);
})

/**
 * Creates a mapper that returns a default value if the input is null or undefined.
 * @param factory Default generator or value.
 * @returns A new mapper.
 */
export const or = <I, O>(factory: ValueOrFactory<O>): Mapper<I | undefined | null, I | O> => tryCatch(value => {
    if (value === undefined || value === null) {
        return callOrGet(factory)
    }
    return value
})
export const orUndefined = <I>(result: Result<I | null | undefined>) => or<I, undefined>(undefined)(result)
export const orNull = <I>(result: Result<I | null | undefined>) => or<I, null>(null)(result)

/**
 * Wraps a mapper so that it skips empty values.
 * @param mapper Mopper
 * @returns New mapper that skips empty values.
 */
export const maybe = <I, O>(mapper: Mapper<I, O>) => flatMap<I | undefined | null, O | undefined | null>(value => {
    if (value === undefined) {
        return of(undefined)
    }
    if (value === null) {
        return of(null)
    }
    return exec(value, mapper)
})
export const maybeOr = <I, O>(mapper: Mapper<I, O>, factory: ValueOrFactory<O>) => flow(maybe(mapper), or(factory))
export const maybeOrNull = <I, O>(mapper: Mapper<I, O>) => flow(maybe(mapper), orNull)
export const maybeOrUndefined = <I, O>(mapper: Mapper<I, O>) => flow(maybe(mapper), orUndefined)
