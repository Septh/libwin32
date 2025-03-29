import { koffi } from './private.js'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

// Primitives.
export const cVOID      = koffi.types.void
export const cBOOL      = koffi.types.int
export const cINT       = koffi.types.int
export const cSHORT     = koffi.types.int16
export const cLONG      = koffi.types.int32
export const cDWORD     = koffi.types.uint32
export const cUINT      = koffi.types.uint
export const cLPCWSTR   = koffi.types.str16
export const cLPWSTR    = koffi.types.str16

// Pointers.
export const cLPVOID    = koffi.pointer('LPVOID',  koffi.types.void)
export const cPDWORD    = koffi.pointer('PDWORD',  koffi.types.uint32)
export const cLPDWORD   = koffi.pointer('LPDWORD', koffi.types.uint32)
export const cINT_PTR   = koffi.types.int64

// Apis.
export const cHANDLE    = koffi.pointer('HANDLE',   koffi.opaque())
export const cLPHANDLE  = koffi.pointer('LPHANDLE', cHANDLE)
export const cPHANDLE   = koffi.pointer('PHANDLE',  cHANDLE)
export const cHINSTANCE = koffi.alias('HINSTANCE',  cHANDLE)
export const cWPARAM    = koffi.types.uint64    // == UINT_PTR
export const cLPARAM    = koffi.types.int64     // == LONG_PTR
export const cHRESULT   = koffi.types.long      // == LONG
export const cLRESULT   = koffi.types.int64     // == LONG_PTR
export const cATOM      = koffi.types.uint16    // == WORD

//  TypeScript base types.
export type HANDLE<Kind extends string> = koffi.IKoffiCType & { __kind: Kind }
export type HINSTANCE = HANDLE<'HINSTANCE'>
export type WPARAM    = number | HANDLE<string>
export type LPARAM    = number | BigInt | HANDLE<string>
export type HRESULT   = number | HANDLE<string>
export type LRESULT   = number | BigInt | HANDLE<string>
export type ATOM      = number | string

// GUID structure
export const cGUID = koffi.struct('GUID', {
    Data1: koffi.types.uint32,
    Data2: koffi.types.uint16,
    Data3: koffi.types.uint16,
    Data4: koffi.array('uint8', 8),
})

// TypeScript type for GUID
export interface GUID {
    Data1: number;
    Data2: number;
    Data3: number;
    Data4: Uint8Array;
}
