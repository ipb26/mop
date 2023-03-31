import { flow } from "fp-ts/lib/function";
import { cast, exec, flattenArray, InputType, map, Mapper, OutputType, Result, typed } from ".";
import { UnionToIntersection } from "./internal";

export type MultiSchema = ReadonlyArray<Mapper<any, any>>//TODO restrict to object schemas only?
export type MultiInput<S extends MultiSchema> = UnionToIntersection<{ [K in keyof S]: InputType<S[K]> }[number]>
export type MultiOutput<S extends MultiSchema> = UnionToIntersection<{ [K in keyof S]: OutputType<S[K]> }[number]>

export function multi<S extends MultiSchema>(schemas: S) {
    return flow(
        typed<MultiInput<S>>,
        map(input => {
            return schemas.map(schema => exec(input as InputType<typeof schema>, schema))
        }),
        cast<Result<object>[]>,
        flattenArray(),
        map(input => {
            return input.reduce((all, current) => Object.assign({}, all, current))
        }),
        cast<MultiOutput<S>>
    )
}
