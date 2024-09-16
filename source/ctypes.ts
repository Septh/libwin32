import { alias, koffi, opaque, pointer } from './private.js'

const {
    void: _void,
    bool,
    char, uchar, wchar,
    str, str16,
    int, int8, int16, int32, int64, long,
    uint, uint8, uint16, uint32, uint64,
    float, double,
} = koffi.types

/** A selection of Koffi's builtin primitive C types. */
const ctypes = {
    _void,
    bool,
    char, uchar, wchar,
    str, str16,
    int, int8, int16, int32, int64, long,
    uint, uint8, uint16, uint32, uint64,
    float, double
}

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

// Primitives.
export const cVOID       = ctypes._void
export const cBOOL       = ctypes.int
export const cINT        = ctypes.int
export const cINT_PTR    = ctypes.int64
export const cSHORT      = ctypes.int16
export const cLONG       = ctypes.int32
export const cDWORD      = ctypes.uint32
export const cUINT       = ctypes.uint
export const cLPCWSTR    = ctypes.str16
export const cLPWSTR     = ctypes.str16

// Pointers.
export const cLPVOID     = pointer('LPVOID',      ctypes._void)
export const cPDWORD     = pointer('PDWORD',      ctypes.uint32)
export const cLPDWORD    = pointer('LPDWORD',     ctypes.uint32)

// Apis.
export const cHANDLE     = pointer('HANDLE',   opaque())
export const cPHANDLE    = pointer('PHANDLE',  cHANDLE)
export const cLPHANDLE   = pointer('LPHANDLE', cHANDLE)
export const cHINSTANCE  = alias('HINSTANCE',  cHANDLE)
export const cWPARAM     = ctypes.uint64    // = UINT_PTR
export const cLPARAM     = ctypes.int64     // = LONG_PTR
export const cHRESULT    = ctypes.long      // = LONG
export const cLRESULT    = ctypes.int64     // = LONG_PTR
export const cATOM       = ctypes.uint16    // = WORD

//  TypeScript base types.
export type HANDLE<Kind extends string> = koffi.IKoffiCType & { __kind: Kind }
export type HINSTANCE = HANDLE<'HINSTANCE'>
export type WPARAM    = number | HANDLE<any>
export type LPARAM    = number | BigInt | HANDLE<any>
export type HRESULT   = number | HANDLE<any>
export type LRESULT   = number | BigInt | HANDLE<any>
export type ATOM      = number | string
