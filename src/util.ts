
import objectInspect from "object-inspect";
import { MapError } from "./base";

/**
 * Utility to format an error path.
 */
export const formatPath = (path?: (string | number)[]) => {
    if (path === undefined) {
        return ""
    }
    return path.map((value, index) => {
        if (typeof value === "string") {
            return ((index > 0) ? "." : "") + value;
        }
        return "[" + value + "]"
    }).join("")
}

/**
 * Join a list of message strings.
 */
export const joinMessages = (messages: string[]) => {
    return messages.join(", ") + "."
}

/**
 * Prints an error into a message string. Replaces {value} with value. Also appends the value to the end if includeValues is true.
 */
export const printMessage = (error: MapError, includeValues = false) => {
    return error.message.replace("{value}", objectInspect(error.value)) + (includeValues ? " (" + objectInspect(error.value) + ")" : "")
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
