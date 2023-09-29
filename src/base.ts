import * as E from "fp-ts/lib/Either";
import { Either } from 'fp-ts/lib/Either';
import { ValueOrFactory } from "value-or-factory";
import { ArrayOrElement } from "./internal";

/**
 * The result of a mapping attempt. Either a value or an error.
 */
export type Result<T> = Either<MapError[], T>

/**
 * One piece of an error path.
 */
export type ErrorPath = string | number

/**
 * An error associated with a mapping attempt.
 */
export type MapError = { path: ErrorPath[], message: string, value?: unknown }

/**
 * A mapper converts a value from one type to another.
 */
export type Mapper<I, O> = (value: Result<I>) => Result<O>

/**
 * An error message or generator.
 */
export type ErrorFactory<T> = ValueOrFactory<ArrayOrElement<string | FactoryError>, [T]>

/**
 * An error for a factory. Gets combined with a value and turned into a MapError.
 */
export type FactoryError = Pick<MapError, "path" | "message">

/**
 * Generates an error using a factory and a value.
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
        return [{ ...factory, value }]
    }
}

// Extractors

/**
 * Extract the value from a success result.
 */
export type ResultType<P> = P extends E.Right<infer O> ? O : never

/**
 * Extract the input type from a mapper.
 */
export type InputType<P> = P extends Mapper<infer I, unknown> ? I : never

/**
 * Extract the output type from a mapper.
 */
export type OutputType<P> = P extends Mapper<never, infer O> ? O : never
