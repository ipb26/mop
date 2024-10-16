import { errorAt, ErrorPathComponent, formatPath, mapFail } from "."
import { arrayOrElement, ArrayOrElement } from "./internal"

/**
 * Prepend a path tree to all errors.
 */
export const path = (paths: ArrayOrElement<ErrorPathComponent>) => mapFail(errors => {
    return errors.map(error => ({ ...error, path: [...arrayOrElement(paths), ...arrayOrElement(error.path ?? []) ?? []] }))
})

/**
 * Truncate the error path.
 */
export const truncatePaths = () => {
    return mapFail(errors => {
        return errors.map(error => {
            return {
                //path: [] satisfies ErrorPath[],
                value: error.value,
                //TODO make formatting optional?
                message: errorAt(formatPath(error.path), error.message),
            }
        })
    })
}
