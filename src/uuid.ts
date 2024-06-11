import { parse, stringify } from "uuid"
import { ErrorFactory, tryCatch } from "."

/**
 * Convert a string to a UUID.
 */
export const stringToUuid = (error?: ErrorFactory<[unknown, string]>) => tryCatch(parse, error)

/**
 * Convert a UUID to a string.
 */
export const uuidToString = (error?: ErrorFactory<[unknown, Uint8Array]>) => tryCatch(stringify, error)
