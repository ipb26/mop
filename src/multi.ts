import { flow } from "fp-ts/lib/function";
import { mergeAll } from "ramda";
import { cast, exec, flattenArray, InputType, map, Mapper, OutputType, typed } from ".";
import { UnionToIntersection } from "./internal";

export type MultiSchema = ReadonlyArray<Mapper<never, object>>
export type MultiInput<S extends MultiSchema> = UnionToIntersection<{ [K in keyof S]: InputType<S[K]> }[number]>
export type MultiOutput<S extends MultiSchema> = UnionToIntersection<{ [K in keyof S]: OutputType<S[K]> }[number]>

/*
const x = multi([
    object({
        b: stringToInt()
    }),
    object({
        a: stringToInt()
    })
])
const y = exec({ a: "", b: "" }, x)
if (isRight(y)) {
    y.right.b
}
*/

export function multi<S extends MultiSchema>(schemas: S) {
    return flow(
        typed<MultiInput<S>>,
        map(input => schemas.map(schema => exec(input as InputType<typeof schema>, schema))),
        flattenArray(),
        map(mergeAll),
        cast<MultiOutput<S>>
    )
}
