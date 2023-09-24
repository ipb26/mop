
import { ErrorFactory } from "./base"
import { flow } from "./core"
import { test } from "./test"

/*
export const is = <I, O extends I>(is: O, error: ErrorFactory<I> = "Must be equal to " + is) => flow(test(_ => _ === is, error), cast<O>)
export const isNot = <I, O extends I>(is: O, error: ErrorFactory<I> = "Must not be equal to " + is) => flow(test(_ => _ !== is, error), cast<O>)
*/

export const is = <I>(is: I, error: ErrorFactory<I> = "Must be equal to " + is) => flow(test(_ => _ === is, error))
export const isNot = <I>(is: I, error: ErrorFactory<I> = "Must not be equal to " + is) => flow(test(_ => _ !== is, error))
