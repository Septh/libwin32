import {
    koffi, ctypes,
    alias, opaque, pointer
} from './private.js'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

// Primitives.
export const cVOID       = ctypes.void
export const cBOOL       = ctypes.int
export const cINT        = ctypes.int
export const cSHORT      = ctypes.int16
export const cLONG       = ctypes.int32
export const cDWORD      = ctypes.uint32
export const cUINT       = ctypes.uint
export const cLPCWSTR    = ctypes.str16
export const cLPWSTR     = ctypes.str16

// Pointers.
export const cLPVOID     = pointer('LPVOID',      ctypes.void)
export const cPDWORD     = pointer('PDWORD',      ctypes.uint32)
export const cLPDWORD    = pointer('LPDWORD',     ctypes.uint32)
export const cINT_PTR    = ctypes.int64

// Apis.
export const cHANDLE     = pointer('HANDLE',   opaque())
export const cLPHANDLE   = pointer('LPHANDLE', cHANDLE)
export const cPHANDLE    = pointer('PHANDLE',  cHANDLE)
export const cHINSTANCE  = alias('HINSTANCE',  cHANDLE)
export const cWPARAM     = ctypes.uint64    // = UINT_PTR
export const cLPARAM     = ctypes.int64     // = LONG_PTR
export const cHRESULT    = ctypes.long      // = LONG
export const cLRESULT    = ctypes.int64     // = LONG_PTR
export const cATOM       = ctypes.uint16    // = WORD

//  TypeScript base types.
export type HANDLE<Kind extends string> = koffi.IKoffiCType & { __kind: Kind }
export type HINSTANCE = HANDLE<'HINSTANCE'>
export type WPARAM    = number | HANDLE<string>
export type LPARAM    = number | BigInt | HANDLE<string>
export type HRESULT   = number | HANDLE<string>
export type LRESULT   = number | BigInt | HANDLE<string>
export type ATOM      = number | string
