import koffi from 'koffi'

/*
 * (Some) C typedefs used throughout the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

/** @internal */ export const cVOID      = koffi.types.void
/** @internal */ export const cBOOL      = koffi.types.int
/** @internal */ export const cINT       = koffi.types.int
/** @internal */ export const cUINT      = koffi.types.uint
/** @internal */ export const cCHAR      = koffi.types.char
/** @internal */ export const cUCHAR     = koffi.types.uchar
/** @internal */ export const cWCHAR     = koffi.types.wchar
/** @internal */ export const cBYTE      = koffi.types.uint8
/** @internal */ export const cSHORT     = koffi.types.short
/** @internal */ export const cUSHORT    = koffi.types.ushort
/** @internal */ export const cWORD      = koffi.types.ushort
/** @internal */ export const cLONG      = koffi.types.long
/** @internal */ export const cULONG     = koffi.types.ulong
/** @internal */ export const cDWORD     = koffi.types.ulong
/** @internal */ export const cDWORD64   = koffi.types.uint64
/** @internal */ export const cLONG64    = koffi.types.int64
/** @internal */ export const cULONG64   = koffi.types.uint64
/** @internal */ export const cLONGLONG  = koffi.types.int64
/** @internal */ export const cLONG_PTR  = koffi.types.int64
/** @internal */ export const cULONG_PTR = koffi.types.uint64
/** @internal */ export const cFLOAT     = koffi.types.float
/** @internal */ export const cSTR       = koffi.types.str16    // Koffi converts JS strings to/from str16
/** @internal */ export const cLPARAM    = koffi.types.int64    // == LONG_PTR
/** @internal */ export const cWPARAM    = koffi.types.uint64   // == UINT_PTR
/** @internal */ export const cHRESULT   = koffi.types.long     // == LONG
/** @internal */ export const cLRESULT   = koffi.types.int64    // == LONG_PTR
/** @internal */ export const cATOM      = koffi.types.uint16   // == WORD
/** @internal */ export const cLSTATUS   = koffi.types.int32
/** @internal */ export const cNTSTATUS  = koffi.types.int32
/** @internal */ export const cSIZE_T    = koffi.types.uint64
/** @internal */ export const cPVOID     = koffi.pointer(koffi.types.void)
/** @internal */ export const cPDWORD    = koffi.pointer(cDWORD)
/** @internal */ export const cHANDLE    = koffi.pointer(koffi.opaque())

// Handles
export type __HANDLE__<Kind extends string> = { __kind: Kind }
export type HANDLE      = __HANDLE__<string>        // Any kind of handle
export type HINSTANCE   = __HANDLE__<'HINSTANCE'>
export type HMODULE     = HINSTANCE                 // HMODULE can be used in place of HINSTANCE
export type HWND        = __HANDLE__<'HWND'>
export type HBRUSH      = __HANDLE__<'HBRUSH'>
export type HICON       = __HANDLE__<'HICON'>
export type HCURSOR     = HICON                     // HCURSOR is the same as HICON
export type HBITMAP     = __HANDLE__<'HBITMAP'>
export type HMENU       = __HANDLE__<'HMENU'>
export type HACCEL      = __HANDLE__<'HACCEL'>
export type HDC         = __HANDLE__<'HDC'>
export type HRGN        = __HANDLE__<'HRGN'>
export type HMONITOR    = __HANDLE__<'HMONITOR'>
export type HDESK       = __HANDLE__<'HDESK'>
export type HKEY        = __HANDLE__<'HKEY'>
export type HTOKEN      = __HANDLE__<'HACCESS_TOKEN'>
export type LSA_HANDLE  = __HANDLE__<'HLSA_HANDLE'>

// Parameters and return types.
export type WPARAM      = number | bigint | HANDLE
export type LPARAM      = number | bigint | HANDLE
export type HRESULT     = number | HANDLE
export type LRESULT     = number | bigint | HANDLE
export type ATOM        = number

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
