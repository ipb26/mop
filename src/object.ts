
import { flow, pipe } from "fp-ts/function"
import { mapObjIndexed } from "ramda"
import { cast, combineObject, constant, exec, InputType, map, Mapper, noOp, OutputType, path, split, swap, typed } from "."

type OptionalKeys<S> = { [K in keyof S]: undefined extends S[K] ? K : never }[keyof S]
type RequiredKeys<S> = { [K in keyof S]: undefined extends S[K] ? never : K }[keyof S]

export type ObjectSchema = { [K: string]: Mapper<never, unknown> }
type SchemaInputs<S extends ObjectSchema> = { [K in RequiredKeys<{ [K in keyof S]: InputType<S[K]> }>]: InputType<S[K]> } & { [K in OptionalKeys<{ [K in keyof S]: InputType<S[K]> }>]?: InputType<S[K]> }

export function object<S extends ObjectSchema>(schema: S) {
    return flow(
        typed<SchemaInputs<S>>,
        map(input => pipe(schema, mapObjIndexed((mapper, key) => exec(input[key as never] as never, mapper)))),
        combineObject(),
        //buildObject(pipe(schema, mapObjIndexed((value, key) => flow(pick(key as never), value)))),
        cast<{ [K in keyof S]: OutputType<S[K]> }>
    )
    /*
    return flow(
        map((value: SchemaInputs<S>) => {
            const results = pipe(
                schema,
                mapObjIndexed((mapper, key) => {
                    //@ts-ignore
                    return exec(value[key], mapper)
                })
            )
            return results as { [K in keyof S]: Result<OutputType<S[K]>> }
        }),
        combineObject()
    )*/
}


/**
 * Plucks a single key from an object.
 */
export const pick = <I, K extends keyof I>(key: K) => map<I, I[K]>(i => i[key])

/**
type CustomSchema<I> = { [K: string]: Mapper<I, unknown> }

 * Build an object from an object of mappers, each of which is applied to the input object.

export const buildObject = <S extends CustomSchema<I>, I>(schema: S) => flow(
    typed<I>,
    map(input => pipe(schema, mapObjIndexed(mapper => exec(input, mapper)))),
    combineObject(),
    cast<{ [K in keyof S]: OutputType<S[K]> }>,
) */

/**
 * Generate a mapper that turns a tuple of two objects into one object.
 */
export const merge = <A extends {}, B extends {}>() => map((value: readonly [A, B]) => {
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
                map(_ => ({ [key]: _ } as Record<K, A>))
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
        ...({ [newKey]: _ } as Record<N, I[K]>)
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
