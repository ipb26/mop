import { callOrGet, ValueOrFactory } from "value-or-factory"
import { buildError, ErrorFactory, Mapper, Result } from "./base"
import { failure, flatMap, map } from "./core"

/**
 * Returns the same value every time.
 * @param value Value
 * @returns A mapper that returns the value.
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
export const cond = <I, O extends I>(mapper: Mapper<I, O>, on: boolean) => possible(on ? mapper : undefined)

/**
 * Does nothing (used for type inference).
 * @returns A mapper that does nothing.
 */
export const noOp = <T>(value: Result<T>) => value
