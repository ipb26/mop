import { pipe } from "fp-ts/function"
import { Mapper, Result } from "./base"
import { of } from "./core"
import { combineMessages, errorsOnly, groupErrors, groupMessages, messageList, singleError, throwError, valueOnly } from "./errors"

export const exec = <I, O>(value: I, mapper: (value: Result<I>) => O) => pipe(value, of, mapper)
export const execOrThrow = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, throwError())
export const execValueOnly = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, valueOnly())
export const execErrorsOnly = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, errorsOnly())
export const execOrGroup = <I, O>(value: I, mapper: Mapper<I, O>) => pipe(value, of, mapper, groupErrors())
export const execOrMessages = <I, O>(value: I, mapper: Mapper<I, O>, includeValues = false) => pipe(value, of, mapper, groupMessages(includeValues))
export const execOrCombinedMessages = <I, O>(value: I, mapper: Mapper<I, O>, includeValues = false) => pipe(value, of, mapper, combineMessages(includeValues))
export const execOrMessageList = <I, O>(value: I, mapper: Mapper<I, O>, includeValues = false) => pipe(value, of, mapper, messageList(includeValues))
export const execOrSingleError = <I, O>(value: I, mapper: Mapper<I, O>, includeValues = false) => pipe(value, of, mapper, singleError(includeValues))
