import type { HANDLE } from '../internals.js'

/**
 * Use this helper to disambiguate the return value of a function
 * that can could be either a HANDLE or an error code, eg.:
 *
 * ````ts
 * const hKey = RegOpenKeyEx( ... )
 * if (isHandle<HKEY>(hKey)) {
 *   // do something with hKey
 * }
 * else {
 *   console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, hKey))
 * }
 * ````
 */
export function isHandle<kind extends HANDLE>(value: unknown): value is kind {
    return typeof value === 'bigint'
}

/**
 * Use this helper to disambiguate the return value of a function
 * that can could be either a structure or an error code, eg.:
 *
 * ````ts
 * const value = RegEnumValue(hKey, index)
 * if (isErrorStatus(value)) {
 *   console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, hKey))
 * }
 * else {
 *   // do something with `value`
 * }
 * ````
 */
export function isErrorStatus(value: unknown): value is number {
    return typeof value === 'number'
}
