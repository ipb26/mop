
import { flow } from "fp-ts/function";
import { array } from "./array";
import { buildError, ErrorFactory, Result } from "./base";
import { failure, flatMap, map, of } from "./core";
import { test } from "./test";

export const typed = <T>(value: Result<T>) => value
export const cast = <T>(value: Result<unknown>) => map(_ => _ as T)(value)

export const stringType = typed<string>
export const booleanType = typed<boolean>
export const numberType = typed<number>
export const bigintType = typed<bigint>
export const objectType = typed<object>
export const symbolType = typed<symbol>
export const dateType = typed<Date>
export const arrayBufferViewType = typed<ArrayBufferView>

export const isInstanceOf = <T, A extends unknown[]>(con: new (...args: A) => T, message: ErrorFactory<unknown> = "This value must be an instance of " + con.name) => flatMap((_: unknown) => _ instanceof con ? of(_) : failure(buildError(message, _)))
export const isType = <T>(type: string, message: ErrorFactory<unknown> = _ => "This value must be of type " + type) => flow(test<unknown>(_ => typeof _ === type, message), cast<T>)
export const isString = (message?: ErrorFactory<unknown>) => isType<string>("string", message)
export const isStringArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isString(message)))
export const isBoolean = (message?: ErrorFactory<unknown>) => isType<boolean>("boolean", message)
export const isBooleanArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isBoolean(message)))
export const isNumber = (message?: ErrorFactory<unknown>) => isType<number>("number", message)
export const isNumberArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isNumber(message)))
export const isBigint = (message?: ErrorFactory<unknown>) => isType<bigint>("bigint", message)
export const isBigintArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isBigint(message)))
export const isObject = (message?: ErrorFactory<unknown>) => isType<object>("object", message)
export const isObjectArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isObject(message)))
export const isSymbol = (message?: ErrorFactory<unknown>) => isType<symbol>("symbol", message)
export const isSymbolArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isSymbol(message)))
export const isArray = (message: ErrorFactory<unknown> = "This value must be an array") => flow(test<unknown>(Array.isArray, message), cast<unknown[]>)
export const isArrayOf = <T>(type: string, message: ErrorFactory<unknown> = _ => "This value must be of type " + type) => flow(isArray(message), array(isType<T>(type, message)))
export const isDate = (message: ErrorFactory<unknown> = "This value must be a date") => flatMap((_: unknown) => _ instanceof Date ? of(_) : failure(buildError(message, _)))
export const isDateArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isDate(message)))
export const isArrayBufferView = (message: ErrorFactory<unknown> = "This value must be an array buffer view") => flatMap((_: unknown) => ArrayBuffer.isView(_) ? of(_) : failure(buildError(message, _)))
export const isArrayBufferViewArray = (message?: ErrorFactory<unknown>) => flow(isArray(message), array(isArrayBufferView(message)))
