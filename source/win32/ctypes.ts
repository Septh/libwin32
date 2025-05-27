import { koffi } from './private.js'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

/*
 * Primitive types.
 */

export const cVOID      = koffi.alias('VOID',      koffi.types.void)
export const cINT       = koffi.alias('INT',       koffi.types.int)
export const cUINT      = koffi.alias('UINT',      koffi.types.uint)
export const cBOOL      = koffi.alias('BOOL',      koffi.types.int)
export const cBOOLEAN   = koffi.alias('BOOLEAN',   koffi.types.uint8)
export const cCHAR      = koffi.alias('CHAR',      koffi.types.char)
export const cBYTE      = koffi.alias('BYTE',      koffi.types.uint8)
export const cSHORT     = koffi.alias('SHORT',     koffi.types.int16)
export const cUSHORT    = koffi.alias('USHORT',    koffi.types.uint16)
export const cWORD      = koffi.alias('WORD',      koffi.types.uint16)
export const cLONG      = koffi.alias('LONG',      koffi.types.int32)
export const cULONG     = koffi.alias('ULONG',     koffi.types.uint32)
export const cDWORD     = koffi.alias('DWORD',     koffi.types.uint32)
export const cDWORD64   = koffi.alias('DWORD64',   koffi.types.uint64)
export const cLONG64    = koffi.alias('LONG64',    koffi.types.int64)
export const cLONGLONG  = koffi.alias('LONGLONG',  koffi.types.int64)

/*
* Pointers.
*/

export const cPVOID     = koffi.pointer('PVOID',   koffi.types.void)
export const cPDWORD    = koffi.pointer('PDWORD',  koffi.types.uint32)
export const cPWSTR     = koffi.alias('PWSTR',     koffi.types.str16)   // Koffi converts JS strings to and from UTF-16 LE
export const cINT_PTR   = koffi.alias('INT_PTR',   koffi.types.int64)
export const cUINT_PTR  = koffi.alias('UINT_PTR',  koffi.types.uint64)
export const cLONG_PTR  = koffi.alias('LONG_PTR',  koffi.types.int64)
export const cULONG_PTR = koffi.alias('ULONG_PTR', koffi.types.uint64)

/** koffi.out() and koffi.inout() expect a table with a single entry. */
export type OUT<T> = [ T ]

/*
 * Handles.
 */

// To Koffi, there is only one kind of handle.
export const cHANDLE    = koffi.pointer('HANDLE', koffi.opaque())

// In TypeScript however, we distinguish them with a brand to help prevent mismatched usage.
export type __HANDLE__<Kind extends string> = koffi.IKoffiCType & { __kind: Kind }
export type HANDLE      = __HANDLE__<string>        // Any kind of handle
export type HINSTANCE   = __HANDLE__<'INSTANCE'>
export type HMODULE     = HINSTANCE                 // HMODULE can be used in place of HINSTANCE
export type HWND        = __HANDLE__<'WND'>
export type HBRUSH      = __HANDLE__<'BRUSH'>
export type HICON       = __HANDLE__<'ICON'>
export type HCURSOR     = HICON                     // HCURSOR is the same as HICON
export type HBITMAP     = __HANDLE__<'BITMAP'>
export type HMENU       = __HANDLE__<'MENU'>
export type HACCEL      = __HANDLE__<'ACCEL'>
export type HDC         = __HANDLE__<'DC'>
export type HRGN        = __HANDLE__<'RGN'>
export type HMONITOR    = __HANDLE__<'MONITOR'>
export type HDESK       = __HANDLE__<'DESK'>
export type HKEY        = __HANDLE__<'KEY'>
export type HTOKEN      = __HANDLE__<'ACCESS_TOKEN'>
export type LSA_HANDLE  = __HANDLE__<'LSA_HANDLE'>

/*
 * Parameters and return types.
 */

export const cWPARAM    = koffi.alias('cWPARAM',   koffi.types.uint64)      // == UINT_PTR
export const cLPARAM    = koffi.alias('cLPARAM',   koffi.types.int64)       // == LONG_PTR
export const cHRESULT   = koffi.alias('cHRESULT',  koffi.types.int32)       // == LONG
export const cLRESULT   = koffi.alias('cLRESULT',  koffi.types.int64)       // == LONG_PTR
export const cATOM      = koffi.alias('cATOM',     koffi.types.uint16)      // == WORD
export const cNTSTATUS  = koffi.alias('cNTSTATUS', koffi.types.int32)       // == LONG

export type WPARAM      = number | BigInt | HANDLE
export type LPARAM      = number | BigInt | HANDLE
export type HRESULT     = number | HANDLE
export type LRESULT     = number | BigInt | HANDLE
export type ATOM        = number
export type NTSTATUS    = number

/*
 * Procedures.
 */

export const cWNDPROC     = koffi.pointer(koffi.proto('WNDPROC',     cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))
export const cWNDENUMPROC = koffi.pointer(koffi.proto('WNDENUMPROC', cBOOL,    [ cHANDLE, cLPARAM ]))
export const cDLGPROC     = koffi.pointer(koffi.proto('DLGPROC',     cINT_PTR, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

export type WNDPROC     = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => LRESULT
export type WNDENUMPROC = (hWnd: HWND, lParam: LPARAM) => number
export type DLGPROC     = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number | BigInt
