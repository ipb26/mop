import * as E from "fp-ts/Either"
import { map, mapLeft, toUnion } from "fp-ts/Either"
import { flow } from "fp-ts/function"
import { groupBy, mapObjIndexed, values } from "ramda"
import { errorAt, ErrorFormatter, formatPath, joinMessages, mapFail, of, orElse, printMessage } from "."

// Formatting and errors. 

/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is an array of errors for each key.
 */
export const groupErrors = () => mapFail(groupBy(_ => formatPath(_.path)))
/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is an array of string for each key.
 */
export const groupMessages = (formatter: ErrorFormatter = printMessage(true)) => flow(groupErrors(), mapLeft(mapObjIndexed(_ => _.map(formatter))))
/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is a single string of all the errors for that key.
 */
export const combineMessages = (formatter: ErrorFormatter = printMessage(true)) => flow(groupMessages(formatter), mapLeft(mapObjIndexed(joinMessages)))
/**
 * Turns the errors into a list of error messages.
 */
export const messageList = (formatter: ErrorFormatter = printMessage(true)) => flow(combineMessages(formatter), mapLeft(flow(mapObjIndexed((value, key) => errorAt(key, value)), values)))
/**
 * Turns the errors into one string.
 */
export const singleError = (formatter: ErrorFormatter = printMessage(true)) => flow(messageList(formatter), E.mapLeft(l => l.join("\n")))
/**
 * Returns only successful values. If there were errors, the value is undefined.
 */
export const valueOnly = () => flow(E.mapLeft(_ => undefined), toUnion)
/**
 * Returns only errors. If there are no errors, the value is undefined.
 */
export const errorsOnly = () => flow(map(_ => undefined), toUnion)
/**
 * Turns the errors into a list of error messages, or undefined if there are no errors.
 */
export const throwError = (formatter: ErrorFormatter = printMessage(true)) => flow(singleError(formatter), E.mapLeft(_ => { throw new globalThis.Error(_) }), toUnion)
/**
 * Turn failed chains into undefined values with no errors.
 */
export const failToEmpty = <T>() => orElse<T | undefined, T>(() => of(undefined))
