
import { separate } from "fp-ts/Array"
import { flow } from "fp-ts/function"
import { Result, ResultType, cast, chain, failure, flat, flatMap, map, of, on2, path, typed } from "."
import { loop } from "./internal"

/**
 * Combines an object of results into a result of an object.
 */
export const flattenObject = <I extends Record<string, Result<unknown>>>() => {
    return flow(
        map(Object.entries),
        loop(() => chain(value => on2(flow(flat(), path(value[0]))))),
        map(Object.fromEntries),
        cast<{ [K in keyof I]: ResultType<I[K]> }>
    )
}

/**
 * Combines an array of results into a result of an array.
 */
export const flattenArray = <T>() => flow(
    typed<Result<T>[]>,
    flatMap(input => {
        const separated = separate(input)
        if (separated.left.length > 0) {
            return failure(separated.left.flat())
        }
        else {
            return of(separated.right)
        }
    })
)
