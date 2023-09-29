import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import { equals } from "ramda"
import { ValueOrFactory, callOrGet } from "value-or-factory"
import { ErrorPath, MapError, Mapper, Result } from "./base"
import { ArrayOrElement, arrayOrElement } from "./internal"

export { isLeft as isFailure, isRight as isSuccess } from "fp-ts/Either"
export { flow, pipe } from "fp-ts/function"

/**
 * Creates a failure result from an error.
 */
export const failure = E.left<MapError[], never>

/**
 * Creates a success result from a value.
 */
export const success = <T>(value: T) => E.right<MapError[], T>(value)

/**
 * A mapper that transforms a value.
 */
export const map = <I, O>(func: (i: I) => O): (result: Result<I>) => Result<O> => E.map(func)

/**
 * Maps the failure side of a transformation result.
 */
export const mapFail = <T>(func: (i: MapError[]) => T) => E.mapLeft(func)

/**
 * Create a new result from a value.
 */
export const of = <T>(value: T): Result<T> => E.right(value)

/**
 * Recovers from the failure side of a transformation result.
 */
export const orElse = <B, A>(orElse: ValueOrFactory<Result<B>, [MapError[]]>) => (result: Result<A>) => E.orElseW((errors: MapError[]) => callOrGet(orElse, errors))(result)

/**
 * Takes a simple function that converts from I to O or generates an error.
 */
export const flatMap = <I, O>(func: (i: I) => Result<O>) => E.chain(func)

/**
 * Takes a simple function that converts from I to O or generates an error.
 */
export const flat = <T>() => flatMap((result: Result<T>) => result)

/**
 * Takes a simple function that uses the input value to generate an additional mapper that is then executed.
 */
export const chain = <I, O>(func: (value: I) => Mapper<I, O>) => E.chain((value: I) => pipe(value, E.of, func(value)))

/**
 * Wrap a mapper in a fallback incase it fails.
 */
export const fallback = <I, O1, O2>(mapper: Mapper<I, O1>, fallbackMapper: Mapper<I, O2>) => {
    return flatMap((value: I) => {
        return pipe(value, of, mapper, orElse(fallbackMapper(of(value))))
    })
}

/**
 * Attempts to run a mapper. If it fails, returns the original value.
 */
export const attempt = <I, O>(mapper: Mapper<I, O>) => {
    return flatMap((value: I) => {
        return pipe(value, of, mapper, orElse(of(value)))
    })
}

/**
 * Maps each error in a transformation failure.
 */
export const mapEachError = (func: (i: MapError) => MapError) => mapFail(_ => _.map(func))

/**
 * Maps each error in a transformation failure.
 */
export const mapErrorAt = (path: ArrayOrElement<ErrorPath>, func: (i: MapError) => MapError) => mapFail(_ => _.map(error => equals(arrayOrElement(error.path ?? []), arrayOrElement(path)) ? func(error) : error))

/**
 * Tap into a mop flow (usually used for logging).
 */
export const tap = <T>(func: (value: T) => void) => map((value: T) => {
    func(value)
    return value
})

/**
 * Tap into a mop flow on failure (usually used for logging).
 */
export const tapFail = (func: (value: MapError[]) => void) => mapFail(errors => {
    func(errors)
    return errors
})
