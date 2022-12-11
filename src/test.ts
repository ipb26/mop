import { flow } from "fp-ts/function";
import { Predicate } from "fp-ts/Predicate";
import { buildError, ErrorFactory, failure, flatMap, Mapper, of, split, to1 } from ".";
import { ArrayOrElement } from "./internal";

/**
 * This is the base of all validators. Performs a test, throws an error if it fails. If it passes, the original value is returned.
 */
export const test = <T>(predicates: ArrayOrElement<Predicate<T>>, error: ErrorFactory<T> = "This value is invalid.") => flatMap((input: T) => {
    const failures = (Array.isArray(predicates) ? predicates : [predicates]).map(_ => _(input)).filter(_ => !_)
    if (failures.length > 0) {
        return failure(buildError(error, input))
    }
    return of(input)
})

/**
 * Uses another mapper to test, but returns the original value unchanged if successful.
 */
export const testWith = <T>(func: Mapper<T, unknown>) => flow(split(func), to1)
