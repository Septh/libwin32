import koffi from 'koffi'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

/** @internal */
export const {
    void:   cVOID,
    int:    cBOOL,
    int:    cINT,
    uint:   cUINT,
    char:   cCHAR,
    uchar:  cUCHAR,
    wchar:  cWCHAR,
    uint8:  cBYTE,
    short:  cSHORT,
    ushort: cUSHORT,
    ushort: cWORD,
    long:   cLONG,
    ulong:  cULONG,
    ulong:  cDWORD,
    uint64: cDWORD64,
    int64:  cLONG64,
    uint64: cULONG64,
    int64:  cLONGLONG,
    int64:  cLONG_PTR,
    uint64: cULONG_PTR,
    float:  cFLOAT,
    str16:  cSTR,           // Koffi converts JS strings to/from str16
    int64:  cLPARAM,        // == LONG_PTR
    uint64: cWPARAM,        // == UINT_PTR
    long:   cHRESULT,       // == LONG
    int64:  cLRESULT,       // == LONG_PTR
    uint16: cATOM,          // == WORD
    int32:  cLSTATUS,       // == LONG
    int32:  cNTSTATUS,      // == LONG
    uint64: cSIZE_T,        // == ULONG_PTR
} = koffi.types

/** @internal */
export const cPVOID = koffi.pointer(koffi.types.void)

/** @internal */
export const cPDWORD = koffi.pointer(cDWORD)

/** @internal */
export const cHANDLE = koffi.pointer(koffi.opaque())

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
