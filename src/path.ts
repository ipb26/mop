import { ErrorPath } from "./base"
import { mapFail } from "./core"
import { arrayOrElement, ArrayOrElement } from "./internal"
import { errorAt, formatPath } from "./util"

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

//TODO does this do it? maybe change name - this flattens errors to one level, using nested paths as a prefix for nested errors
export const flattenErrors = () => {
    return mapFail(errors => {
        return errors.map(error => {
            return {
                path: [],
                value: error.value,
                message: errorAt(formatPath(error.path), error.message),
            }
        })
    })
}
