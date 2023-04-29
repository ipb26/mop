import * as E from "fp-ts/lib/Either";
import { Either } from 'fp-ts/lib/Either';
import { ValueOrFactory } from "value-or-factory";
import { ArrayOrElement } from "./internal";

/**
 * A mapper converts a value from one type to another.
 */
export type Mapper<I, O> = (value: Result<I>) => Result<O>

/**
 * The result of a mapping attempt.
 */
export type Result<T> = Either<MapError[], T>

/**
 * An error associated with a mapping attempt.
 */
export type MapError = { path: ErrorPath[], message: string, value?: unknown }

/**
 * Part of an error path.
 */
export type ErrorPath = string | number

/**
 * A message or generator.
 */
export type ErrorFactory<T> = ValueOrFactory<ArrayOrElement<string | MapError>, [T]>

/**
 * Generates an error (or errors).
 */
export function buildError<T>(factory: ErrorFactory<T>, value: T): MapError[] {
    if (typeof factory === "function") {
        return buildError(factory(value), value)
    }
    else if (Array.isArray(factory)) {
        return factory.map(_ => buildError(_, value)).flat()
    }
    else if (typeof factory === "string") {
        return [{ path: [], message: factory, value }]
    }
    else {
        return [factory]
    }
}

// Extractors

export type InputType<P> = P extends Mapper<infer I, unknown> ? I : never
export type OutputType<P> = P extends Mapper<never, infer O> ? O : never
export type ValueType<P> = P extends E.Right<infer O> ? O : never
