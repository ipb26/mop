
import { flow } from "fp-ts/function"
import { ErrorFactory, Mapper } from "./base"
import { map } from "./core"
import { loop } from "./internal"
import { path } from "./path"
import { test } from "./test"
import { cast, typed } from "./types"

/**
 * Maps an array using a mapper.
 */
export const array = <I, O>(mapper: (index: number) => Mapper<I, O>) => loop(index => flow(mapper(index), path(index)))

/**
 * Creates a mapper that validates that an array has the specified number of items.
 */
export const elems = <T>(count: number, error: ErrorFactory<T[]> = _ => "Must have " + count + " elements (has " + _.length + ").") => test(_ => _.length === count, error);
export const minElem = <T>(count: number, error: ErrorFactory<T[]> = _ => "Must have at least " + count + " elements (has " + _.length + ").") => test(_ => _.length >= count, error);
export const maxElem = <T>(count: number, error: ErrorFactory<T[]> = _ => "Must have at most " + count + " elements (has " + _.length + ").") => test(_ => _.length <= count, error);
export const oneElem = <I>(emptyError: ErrorFactory<I[]> = "This array is empty.", multiError: ErrorFactory<I[]> = "This array has multiple items.") => flow(
    typed<I[]>,
    test(_ => _.length !== 0, emptyError),
    test(_ => _.length < 2, multiError),
    at(0),
    cast<I>
)

/**
 * Position mappers for arrays.
 */
export const at = <I>(at: number) => map((i: I[]) => i.at(at))
export const first = <I>() => at<I>(0)
export const last = <I>() => at<I>(-1)

/**
 * Converts input to an array, if it is not currently an array.
 */
export const arrayOrElement = <T>() => flow(typed<T | T[]>, map(value => Array.isArray(value) ? value : [value]))
