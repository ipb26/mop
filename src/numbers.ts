
import { ErrorFactory } from "./base";
import { test } from "./test";

export const isGt = <T>(is: T, message: ErrorFactory<T> = "Must be greater than to " + is) => test(_ => _ > is, message);
export const isGtOrEq = <T>(is: T, message: ErrorFactory<T> = "Must be greater than or equal to " + is) => test(_ => _ >= is, message);
export const isLt = <T>(is: T, message: ErrorFactory<T> = "Must be less than " + is) => test(_ => _ < is, message);
export const isLtOrEq = <T>(is: T, message: ErrorFactory<T> = "Must be less than or equal to " + is) => test(_ => _ <= is, message);

export const isDivisibleBy = (divisor: number, message: ErrorFactory<number> = "Must be divisible by " + divisor) => test(_ => _ % divisor === 0, message);
export const isNotDivisibleBy = (divisor: number, message: ErrorFactory<number> = "Must not be divisible by " + divisor) => test(_ => _ % divisor !== 0, message);
