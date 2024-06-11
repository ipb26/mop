
import { MapError } from "./base";

export type ErrorFormatter = (errors: MapError | MapError[]) => string

/**
 * Regex from a string.
 */
export function regexFromString(regex: string) {
    const main = regex.match(/\/(.+)\/.*/)?.[1]
    if (main === undefined) {
        return
    }
    return new RegExp(main, regex.match(/\/.+\/(.*)/)?.[1])
}
