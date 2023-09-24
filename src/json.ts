import { ErrorFactory, buildError, failure, flatMap, flow, isArray, isArrayArray, isBoolean, isBooleanArray, isNumber, isNumberArray, isObject, isObjectArray, isString, isStringArray, success, tryCatch } from ".";

export type JsonPrimitive = string | number | null | boolean
export type JsonArray = Json[] | readonly Json[]
export type JsonObject = { [K in string]: Json } & { [K in string]?: Json | undefined };
export type Json = JsonPrimitive | JsonArray | JsonObject

/**
 * Creates a mapper that turns a string into JSON.
 */
export const fromJson = (message: ErrorFactory<[unknown, string]> = _ => "This is not valid json") => tryCatch<string, Json>(JSON.parse, message)

/**
 * Creates a mapper that turns JSON into a string.
 */
export const toJson = (message: ErrorFactory<[unknown, unknown]> = _ => "Could not stringify to JSON") => tryCatch<unknown, string>(JSON.stringify, message)

function jsonTest(value: unknown): value is Json {
    return jsonPrimitiveTest(value) || jsonArrayTest(value) || jsonObjectTest(value)
}
function jsonObjectTest(value: unknown): value is JsonObject {
    if (typeof value !== "object" || value === null) {
        return false
    }
    else {
        return Object.values(value).every(jsonTest)
    }
}
function jsonArrayTest(value: unknown): value is JsonArray {
    if (!Array.isArray(value)) {
        return false
    }
    else {
        return value.every(jsonTest)
    }
}
function jsonPrimitiveTest(value: unknown): value is JsonPrimitive {
    return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean"
}

export const isJson = (message: ErrorFactory<unknown> = "This value is not a JSON value") => flatMap((input: unknown) => {
    if (jsonTest(input)) {
        return success(input)
    }
    else {
        return failure(buildError(message, input))
    }
})
export const isJsonPrimitive = (message: ErrorFactory<unknown> = "This value is not a JSON primitive") => flatMap((input: unknown) => {
    if (jsonObjectTest(input)) {
        return success(input)
    }
    else {
        return failure(buildError(message, input))
    }
})
export const isJsonObject = (message: ErrorFactory<unknown> = "This value is not a JSON object") => flatMap((input: unknown) => {
    if (jsonObjectTest(input)) {
        return success(input)
    }
    else {
        return failure(buildError(message, input))
    }
})
export const isJsonArray = (message: ErrorFactory<unknown> = "This value is not a JSON array") => flatMap((input: unknown) => {
    if (jsonArrayTest(input)) {
        return success(input)
    }
    else {
        return failure(buildError(message, input))
    }
})

/*
export const isJsonArrayOfStrings = (message?: ErrorFactory<unknown>) => flow(isStringArray(message))
export const isJsonArrayOfNumbers = (message?: ErrorFactory<unknown>) => flow(isNumberArray(message))
export const isJsonArrayOfBooleans = (message?: ErrorFactory<unknown>) => flow(isBooleanArray(message))
export const isJsonArrayOfObjects = (message?: ErrorFactory<unknown>) => flow(isObjectArray(message))
export const isJsonArrayOfArrays = (message?: ErrorFactory<unknown>) => flow(isArrayArray(message))
*/

export const fromJsonString = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isString(message))
export const fromJsonNumber = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isNumber(message))
export const fromJsonBoolean = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isBoolean(message))
export const fromJsonObject = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isObject(message))
export const fromJsonArray = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isArray(message))

export const fromJsonArrayOfStrings = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isStringArray(message))
export const fromJsonArrayOfNumbers = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isNumberArray(message))
export const fromJsonArrayOfBooleans = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isBooleanArray(message))
export const fromJsonArrayOfObjects = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isObjectArray(message))
export const fromJsonArrayOfArrays = (message?: ErrorFactory<unknown>) => flow(fromJson(message), isArrayArray(message))
