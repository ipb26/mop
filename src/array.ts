
import { flow } from "fp-ts/function"
import { map } from "."
import { ErrorFactory, Mapper } from "./base"
import { loop } from "./internal"
import { path } from "./path"
import { predicate } from "./test"
import { cast, typed } from "./types"

/**
 * Maps an array using a mapper.
 */
export const array = <I, O>(mapper: Mapper<I, O>) => loop(index => flow(mapper, path(index)))
export const flatArray = <I, O>(mapper: Mapper<I, readonly O[]>) => flow(loop(index => flow(mapper, path(index))), map(_ => _.flat()))
export const arrayByIndex = <I, O>(mapper: (index: number) => Mapper<I, O>) => loop(index => flow(mapper(index), path(index)))

/**
 * Creates a mapper that validates that an array has the specified number of items.
 */
export const elems = <T>(count: number, error: ErrorFactory<readonly T[]> = _ => "Must have " + count + " elements (has " + _.length + ")") => predicate(_ => _.length === count, error);
export const minElem = <T>(count: number, error: ErrorFactory<readonly T[]> = _ => "Must have at least " + count + " elements (has " + _.length + ")") => predicate(_ => _.length >= count, error);
export const maxElem = <T>(count: number, error: ErrorFactory<readonly T[]> = _ => "Must have at most " + count + " elements (has " + _.length + ")") => predicate(_ => _.length <= count, error);
export const oneElem = <I>(emptyError: ErrorFactory<readonly I[]> = "This array is empty.", multiError: ErrorFactory<readonly I[]> = "This array has multiple items") => flow(
    typed<readonly I[]>,
    predicate(_ => _.length !== 0, emptyError),
    predicate(_ => _.length < 2, multiError),
    at(0),
    cast<I>
)

/**
 * Position mappers for arrays.
 */
export const at = <I>(at: number) => map((i: readonly I[]) => i.at(at))
export const first = <I>() => at<I>(0)
export const last = <I>() => at<I>(-1)

/**
 * Converts input to an array, if it is not currently an array.
 */
export const arrayOrElement = <T>() => flow(typed<T | readonly T[]>, map(value => Array.isArray(value) ? value : [value]))
