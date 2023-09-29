import { pipe } from "fp-ts/function"
import { Mapper, Result } from "./base"
import { of } from "./core"
import { combineMessages, errorMessagesOnly, errorsOnly, groupErrors, groupMessages, messageList, singleError, throwError, valueOnly } from "./errors"
import { ErrorFormatter } from "./util"

/**
 * Executes a mapper on an input value, returning a result.
 */
export const exec = <I, O>(value: I, mapper: (value: Result<I>) => O) => pipe(value, of, mapper)

/**
 * Throws if there is an error, otherwise returns the value.
 */
export const execOrThrow = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, throwError(formatter))

export const execOrGroup = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, groupErrors())
export const execOrMessages = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, groupMessages(formatter))
export const execOrCombinedMessages = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, combineMessages(formatter))
export const execOrMessageList = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, messageList(formatter))

/**
 * Turns the errors into one string.
 */
export const execOrSingleError = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, singleError(formatter))

/**
 * Returns only successful values. If there were errors, the value is undefined.
 */
export const execValueOnly = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, valueOnly())
export const execErrorsOnly = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, errorsOnly())
export const execErrorMessagesOnly = <I, O>(value: I, mapper: Mapper<I, O>, formatter?: ErrorFormatter) => pipe(value, of, mapper, errorMessagesOnly(formatter))
