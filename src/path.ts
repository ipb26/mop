import { errorAt, ErrorPath, formatPath, mapFail } from "."
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
export const truncatePaths = () => {
    return mapFail(errors => {
        return errors.map(error => {
            return {
                path: [],
                value: error.value,
                //TODO make formatting optional?
                message: errorAt(formatPath(error.path), error.message),
            }
        })
    })
}
