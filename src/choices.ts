import { flow } from "fp-ts/function"
import { buildError, ErrorFactory, failure, flatMap, Mapper, of, test } from "."

/**
 * Call the factory function and throw an error if the returned value is undefined.
 */
export const lookup = <K, V>(finder: (key: K) => V | undefined, error: ErrorFactory<K> = "This is not a valid choice.") => {
    return flatMap((input: K) => {
        const found = finder(input)
        if (found === undefined) {
            return failure(buildError(error, input))
        }
        return of(found)
    })
}

/**
 * Choice mappers. Tries to pull from an object or map. If the value is not found, throws an error.
 */
export const choices = <K extends string | number | symbol, V>(record: Record<K, V>, error?: ErrorFactory<K>) => lookup(key => record[key], error)
export const choicesByValue = <K extends string | number | symbol, V>(record: Record<K, V>, error?: ErrorFactory<V>) => lookup(key => Object.entries(record).filter(_ => _[1] === key).map(_ => _[0] as K)[0], error)
export const mapChoices = <K, V>(map: Map<K, V>, error?: ErrorFactory<K>) => lookup(key => map.get(key), error)

/**
 * Enforces the the item is one of the values present in an array.
 */
export const isIn = <T>(array: T[], error?: ErrorFactory<T>) => flow(test(_ => array.includes(_), error))
export const isInSet = <T>(set: Set<T>, error?: ErrorFactory<T>) => test(_ => set.has(_), error)

/**
 * Narrows a value down to a union of two types.
 */
export const narrow = <I, A extends I, B extends I>(a: A, b: B, error: ErrorFactory<I> = "This is not a valid option."): Mapper<I, A | B> => flatMap((value: I) => {
    if (value === a || value === b) {
        return of(value as A | B);
    }
    return failure(buildError(error, value))
})

export const narrow3 = <I, A extends I, B extends I, C extends I>(a: A, b: B, c: C, error: ErrorFactory<I> = "This is not a valid option."): Mapper<I, A | B | C> => flatMap((value: I) => {
    if (value === a || value === b || value === c) {
        return of(value as A | B | C);
    }
    return failure(buildError(error, value))
})
