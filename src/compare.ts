
import { ErrorFactory } from "./base"
import { test } from "./test"

export const is = <T>(is: T, error: ErrorFactory<T> = "Must be equal to " + is) => test(_ => _ === is, error)
export const isNot = <T>(is: T, error: ErrorFactory<T> = "Must not be equal to " + is) => test(_ => _ !== is, error)
