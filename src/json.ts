import { ErrorFactory, flow, isArray, isArrayArray, isBoolean, isBooleanArray, isNumber, isNumberArray, isObject, isObjectArray, isString, isStringArray, tryCatch } from "."

/**
 * Creates a mapper that turns a string into JSON.
 */
export const fromJson = (errorFactory: ErrorFactory<[unknown, string]> = _ => "This is not valid json") => tryCatch<string, unknown>(JSON.parse, errorFactory)

/**
 * Creates a mapper that turns JSON into a string.
 */
export const toJson = (errorFactory: ErrorFactory<[unknown, unknown]> = _ => "Could not stringify to JSON") => tryCatch<unknown, string>(JSON.stringify, errorFactory)

export const fromJsonString = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isString(errorFactory))
export const fromJsonNumber = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isNumber(errorFactory))
export const fromJsonBoolean = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isBoolean(errorFactory))
export const fromJsonObject = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isObject(errorFactory))
export const fromJsonArray = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isArray(errorFactory))

export const fromJsonArrayOfStrings = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isStringArray(errorFactory))
export const fromJsonArrayOfNumbers = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isNumberArray(errorFactory))
export const fromJsonArrayOfBooleans = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isBooleanArray(errorFactory))
export const fromJsonArrayOfObjects = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isObjectArray(errorFactory))
export const fromJsonArrayOfArrays = (errorFactory?: ErrorFactory<unknown>) => flow(fromJson(errorFactory), isArrayArray(errorFactory))
