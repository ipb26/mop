import { ErrorPath } from "./base"
import { mapFail } from "./core"
import { arrayOrElement, ArrayOrElement } from "./internal"

/**
 * Prepend a path tree to all errors.
 */
export const path = (paths: ArrayOrElement<ErrorPath>) => mapFail(errors => {
    return errors.map(error => ({ ...error, path: [...Array.isArray(paths) ? paths : [paths], ...arrayOrElement(error.path ?? []) ?? []] }))
})

/**
 * Truncate the error path.
 */
export const truncatePaths = (count: number) => mapFail(errors => {
    return errors.map(error => ({ ...error, path: arrayOrElement(error.path ?? []).slice(0, count) }))
})
