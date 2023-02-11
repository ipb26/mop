import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import { MapError, Mapper, Result } from "./base"

/**
 * Creates a result from a value.
 */
export const failure = E.left<MapError[], never>

/**
 * Creates a result from a value.
 */
export const success = <T>(value: T) => E.right<MapError[], T>(value)

/**
 * Executes a simple operation that cannot fail (unlike flatMap).
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
export const orElse = <B, A>(orElse: (e: MapError[]) => Result<B>) => (result: Result<A>) => E.orElseW(orElse)(result)

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
 * Maps each error in a transformation failure.
 */
export const mapEachError = (func: (i: MapError) => MapError) => mapFail(_ => _.map(func))

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
