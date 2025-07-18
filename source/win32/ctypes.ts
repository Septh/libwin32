import { koffi } from './private.js'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

export const {
    void:   cVOID,
    int:    cBOOL,
    int:    cINT,
    uint:   cUINT,
    char:   cCHAR,
    uchar:  cUCHAR,
    uchar:  cBYTE,
    short:  cSHORT,
    ushort: cUSHORT,
    ushort: cWORD,
    long:   cLONG,
    ulong:  cULONG,
    ulong:  cDWORD,
    uint64: cDWORD64,
    int64:  cLONG64,
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
} = koffi.types as koffi.PrimitiveTypes

export const cPVOID  = koffi.pointer('PVOID',  koffi.types.void)
export const cHANDLE = koffi.pointer('HANDLE', koffi.opaque())

// Handles
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

// Parameters and return types.
export type WPARAM      = number | BigInt | HANDLE
export type LPARAM      = number | BigInt | HANDLE
export type HRESULT     = number | HANDLE
export type LRESULT     = number | BigInt | HANDLE
export type ATOM        = number
export type LSTATUS     = number

// Procedures.
export const cWNDPROC     = koffi.pointer(koffi.proto('WNDPROC',     cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))
export const cWNDENUMPROC = koffi.pointer(koffi.proto('WNDENUMPROC', cBOOL,    [ cHANDLE, cLPARAM ]))
export const cDLGPROC     = koffi.pointer(koffi.proto('DLGPROC',     cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

export type WNDPROC       = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => LRESULT
export type WNDENUMPROC   = (hWnd: HWND, lParam: LPARAM) => number
export type DLGPROC       = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number | BigInt
