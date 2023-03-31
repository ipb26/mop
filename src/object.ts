
import { flow } from "fp-ts/function"
import { mapObjIndexed, pick as ramdaPick } from "ramda"
import { cast, constant, exec, flattenObject, InputType, map, Mapper, noOp, OutputType, path, Result, split, swap, typed } from "."

type OptionalKeys<S> = { [K in keyof S]: undefined extends S[K] ? K : never }[keyof S]
type RequiredKeys<S> = { [K in keyof S]: undefined extends S[K] ? never : K }[keyof S]

export type ObjectSchema = { [K: string]: Mapper<never, unknown> }

export type RawObjectOutput<S extends ObjectSchema> = { [K in keyof S]: Result<S[K]> }

export function rawObject<S extends ObjectSchema>(schema: S) {
    return flow(
        typed<ObjectInput<S>>,
        map(input => mapObjIndexed((mapper, key) => exec(input[key as never] as never, mapper), schema)),
        cast<RawObjectOutput<S>>
    )
}

export type ObjectOutput<S extends ObjectSchema> = { [K in keyof S]: OutputType<S[K]> }
export type ObjectInput<S extends ObjectSchema> = { [K in RequiredKeys<{ [K in keyof S]: InputType<S[K]> }>]: InputType<S[K]> } & { [K in OptionalKeys<{ [K in keyof S]: InputType<S[K]> }>]?: InputType<S[K]> }

export function object<S extends ObjectSchema>(schema: S) {
    return flow(
        rawObject(schema),
        flattenObject(),
        cast<ObjectOutput<S>>
    )
}

/**
 * Plucks a single key from an object.
 */
export const pick = <I, K extends keyof I>(key: K) => flow(typed<I>, map(i => i[key]))

/**
 * Plucks multiple keys from an object.
 */
export const picks = <I, K extends (keyof I)[]>(keys: K) => flow(typed<I>, map(ramdaPick(keys)))

/**
 * Generate a mapper that turns a tuple of two objects into one object.
 */
export const merge = <A extends {}, B extends {}>() => map((value: readonly [A, B]): Omit<A, keyof B> & B => {
    return {
        ...value[0],
        ...value[1],
    }
})

/**
 * Apply a mapper to one key of an object and merge it back in.
 */
export const onKey = <I extends {}, K extends (keyof I) & string, A>(key: K, mapper: Mapper<I[K], A>) => {
    return flow(
        split(
            flow(
                pick(key),
                mapper,
                path(key),
                map(_ => <Record<K, A>>{ [key]: _ })
            )
        ),
        merge()
    )
}

/**
 * Generate a mapper that drops a single key from an object.
 */
export const dropKey = <I, K extends keyof I>(key: K) => map<I, Omit<I, K>>(i => {
    const { [key]: drop, ...rest } = i
    return rest
})

/**
 * Generate a mapper that moves a key to another key in an object from an object.
 */
export const moveKey = <I, K extends keyof I, N extends string | number | symbol>(oldKey: K, newKey: N) => map((i: I) => {
    const { [oldKey]: _, ...rest } = i
    return {
        ...rest,
        ...<Record<N, I[K]>>{ [newKey]: _ }
    }
})

/**
 * Merge a manually provided object.
 */
export const mergeWith = <I extends {}, A extends {}>(add: A) => flow(noOp<I>, split(constant(add)), merge())

/**
 * Merge a manually provided object.
 */
export const mergeWithBefore = <I extends {}, A extends {}>(add: A) => flow(noOp<I>, split(constant(add)), swap(), merge())
