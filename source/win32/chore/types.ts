import type { __HANDLE__, HANDLE } from '../internals.js'

// Handles.
export type HINSTANCE = __HANDLE__<'HINSTANCE'>
export type HMODULE   = HINSTANCE                  // HMODULE can be used in place of HINSTANCE

// Parameters and return types.
export type WPARAM  = number | bigint | HANDLE
export type LPARAM  = number | bigint | HANDLE
export type HRESULT = number | HANDLE
export type LRESULT = number | bigint | HANDLE
export type ATOM    = number

/**
 * The GUID structure stores a GUID.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/guiddef/ns-guiddef-guid
 */
export interface GUID {
    Data1: number
    Data2: number
    Data3: number
    Data4: [ number, number, number, number, number, number, number, number ]
}

/**
 * The UUID structure is a typedef'd synonym for the GUID structure.
 */
export type UUID = GUID

/**
 * The LUID structure is an opaque structure that specifies an identifier that is guaranteed to be unique on the local machine.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid
 */
export interface LUID {
    LowPart: number
    HighPart: number
}
