import { callOrGet, ValueOrFactory } from "value-or-factory"
import { buildError, ErrorFactory, Mapper, Result } from "./base"
import { failure, flatMap, map, of, orElse, pipe } from "./core"

/**
 * Returns the same value every time.
 */
export const constant = <I, O>(v: ValueOrFactory<O>) => map<I, O>(() => callOrGet(v))

/**
 * Trigger an error manually.
 */
export const fail = <I, O>(error: ErrorFactory<I>) => flatMap<I, O>(value => failure(buildError(error, value)))

/**
 * Adds an optional mapper (may be undefined).
 */
export const possible = <I, O extends I>(mapper: Mapper<I, O> | undefined) => mapper ?? noOp<I>

/**
 * Shortcut method to add a mapper if an argument is set to true
 */
export const cond = <I, O extends I>(mapper: Mapper<I, O>, on: boolean) => on ? mapper : noOp<I>

/**
 * Does nothing (used for type inference).
 */
export const noOp = <T>(value: Result<T>) => value

/**
 * Creates a mapper that combines two mappers, the second one is only used if the first fails.
 */
export const fallback = <I, O1, O2>(mapper: Mapper<I, O1>, fallbackMapper: Mapper<I, O2>) => {
    return flatMap((value: I) => {
        return pipe(value, of, mapper, orElse(fallbackMapper(of(value))))
    })
}

/**
 * Creates a mapper that attempts to run another mapper. If it fails, returns the original value.
 */
export const attempt = <I, O>(mapper: Mapper<I, O>) => {
    return flatMap((value: I) => {
        return pipe(value, of, mapper, orElse(of(value)))
    })
}
