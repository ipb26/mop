
// String

import { flow } from "fp-ts/function";
import { ErrorFactory, filter, map, maybe, orNull, orUndefined, req, test } from ".";

/**
 * Creates a mapper that trims a string.
 */
export const trim = () => map((input: string) => input.trim())

/**
 * Creates a mapper that turns blank strings into undefined.
 */
export const blankToEmpty = () => flow(trim(), filter(_ => _.length !== 0))

/**
 * Creates a mapper that trims and then validates that a string is not blank.
 */
export const notBlank = (error: ErrorFactory<string> = "This value must not be blank") => flow(trim(), test(_ => _ != "", error));

/**
 * Requires a string, also checks that it's not blank.
 */
export const nonBlankString = (error?: ErrorFactory<string | null | undefined>, blankError = error) => flow(req<string>(error), notBlank(blankError))

/**
 * Creates a mapper that turns blank strings into undefined. Lets undefined and null pass through.
 */
export const maybeString = () => maybe(blankToEmpty())
/**
 * Creates a mapper that turns blank strings into undefined.
 */
export const maybeStringOrUndefined = () => flow(maybeString(), orUndefined)
/**
 * Creates a mapper that turns blank strings into undefined.
 */
export const maybeStringOrNull = () => flow(maybeString(), orNull)

/**
 * Mappers for start and end with.
 */
export const startsWith = (match: string, error: ErrorFactory<string> = "Must start with \"" + match + "\"") => test(_ => _.startsWith(match), error)
export const endsWith = (match: string, error: ErrorFactory<string> = "Must end with \"" + match + "\"") => test(_ => _.endsWith(match), error)
export const startsWithCi = (match: string, error: ErrorFactory<string> = "Must start with \"" + match + "\"") => test(_ => _.toLowerCase().startsWith(match.toLowerCase()), error)
export const endsWithCi = (match: string, error: ErrorFactory<string> = "Must end with \"" + match + "\"") => test(_ => _.toLowerCase().endsWith(match.toLowerCase()), error)

/**
 * Mappers for common regexes.
 */
export const numeric = (error: ErrorFactory<string> = "This value is not numeric") => regex(/^-?\d*\.?\d*$/, error)
export const regex = (regex: RegExp, error: ErrorFactory<string> = "This value does not match pattern " + regex + "") => test<string>(_ => regex.test(_), error);
export const email = (error: ErrorFactory<string> = "This is not a valid email") => regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, error)
export const uuid = (error: ErrorFactory<string> = "This value must be a UUID") => regex(/^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/, error);

/**
 * A mapper that requires a string to be an exact length.
 */
export const length = (is: number, error: ErrorFactory<string> = "Must be " + is + " characters") => test(_ => _.length === is, error)
/**
 * A mapper that requires a string to be a minimum length.
 */
export const minLength = (is: number, error: ErrorFactory<string> = "Must be at least " + is + " characters") => test(_ => _.length >= is, error)
/**
 * A mapper that requires a string to be a maximum length.
 */
export const maxLength = (is: number, error: ErrorFactory<string> = "Must be at most " + is + " characters") => test(_ => _.length <= is, error)
