
import objectInspect from "object-inspect";
import { ErrorPath, MapError } from "./base";
import { ArrayOrElement, arrayOrElement } from "./internal";

export type ErrorFormatter = (errors: MapError | MapError[]) => string

/**
 * Utility to format an error path.
 */
export const formatPath = (path?: ArrayOrElement<ErrorPath>) => {
    if (path === undefined) {
        return ""
    }
    return arrayOrElement(path).map((value, index) => typeof value === "string" ? ((index > 0) ? "." : "") + value : "[" + value + "]").join("")
}

/**
 * Prints an error into a message string. Replaces {value} with value. Also appends the value to the end if includeValues is true.
 */
export const formatError = (includeValues = false) => {
    return (errors: MapError | MapError[]) => {
        console.log("TODO", errors)
        return arrayOrElement(errors)
            .map(_ => _.message.replace("{value}", objectInspect(_.value)) + (includeValues ? " (" + objectInspect(_.value) + ")" : ""))
            .join(", ")
    }
}

/**
 * Constructs a sentence referencing an error path.
 */
export const errorAt = (path: string, message: string) => {
    if (path === "") {
        return message
    }
    return "Error(s) at " + path + ": " + message
}
