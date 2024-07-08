import { flow } from "fp-ts/function";
import { exec, map, Mapper } from ".";
import { flattenArray } from "./flatten";

/**
 * A union between a type and an array of the type.
 */
export type ArrayOrElement<T> = T | readonly T[]

/**
 * Converts an array or element to an array.
 */
export function arrayOrElement<T>(value: ArrayOrElement<T>) {
    if (Array.isArray(value)) {
        return value
    }
    return [value]
}

/**
 * Applies a mapper to each element of an array. This does NOT append anything to the error path. For internal use only. Used for multiple traversals.
 */
export function loop<I, O>(mapper: (index: number) => Mapper<I, O>) {
    return flow(
        map((input: I[] | readonly I[]) => input.map((value, index) => exec(value, mapper(index)))),
        flattenArray()
    )
}

/**
 * Converts a union to an intersection.
 */
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
