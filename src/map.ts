import { flow } from "fp-ts/function";
import { ErrorPath, Mapper } from "./base";
import { chain, map } from "./core";
import { ArrayOrElement, loop } from "./internal";
import { path } from "./path";
import { on2 } from "./tuples";
import { typed } from "./types";

/**
 * Maps every element in a map. The mapper can be determined by the key if necessary.
 */
export function onEach<I, O, K>(mapper: (key: K) => Mapper<I, O>, keyToPath: (key: K) => ArrayOrElement<ErrorPath>) {
    return flow(
        typed<Map<K, I>>,
        map(_ => [..._.entries()]),
        loop(() => chain(entry => flow(on2(mapper(entry[0])), path(keyToPath(entry[0]))))),
        map(_ => new Map(_))
    )
}
