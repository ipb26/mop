import * as E from "fp-ts/Either"
import { map, mapLeft, toUnion } from "fp-ts/Either"
import { flow } from "fp-ts/function"
import { groupBy, mapObjIndexed, values } from "ramda"
import { ErrorFormatter, errorAt, formatError, formatPath, mapFail } from "."

/**
 * Throws if there is an error, otherwise returns the value.
 */
export const throwError = (formatter: ErrorFormatter = formatError(false)) => flow(singleError(formatter), E.mapLeft(_ => { throw new globalThis.Error(_) }), toUnion)
/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is an array of errors for each key.
 */
export const groupErrors = () => mapFail(groupBy(_ => formatPath(_.path)))
/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is an array of string for each key.
 */
export const groupMessages = (formatter: ErrorFormatter = formatError(false)) => flow(groupErrors(), mapLeft(mapObjIndexed(_ => _.map(formatter))))
/**
 * Turns the errors into a map of errors, where the key is the formatted path and the value is a single string of all the errors for that key.
 */
export const combineMessages = (formatter: ErrorFormatter = formatError(false)) => flow(groupErrors(), mapLeft(mapObjIndexed(error => formatter(error) + ".")))
/**
 * Turns the errors into a list of error messages.
 */
export const messageList = (formatter: ErrorFormatter = formatError(false)) => flow(combineMessages(formatter), mapLeft(flow(mapObjIndexed((value, key) => errorAt(key, value)), values)))
/**
 * Turns the errors into one string.
 */
export const singleError = (formatter: ErrorFormatter = formatError(false)) => flow(messageList(formatter), E.mapLeft(l => l.join("\n")))
/**
 * Returns only successful values. If there were errors, the value is undefined.
 */
export const valueOnly = () => flow(E.mapLeft(_ => undefined), toUnion)
/**
 * Returns only errors. If there are no errors, the value is undefined.
 */
export const errorMessagesOnly = (formatter: ErrorFormatter = formatError(false)) => flow(messageList(formatter), map(_ => undefined), toUnion)
/**
 * Returns only errors. If there are no errors, the value is undefined.
 */
export const errorsOnly = () => flow(map(_ => undefined), toUnion)
