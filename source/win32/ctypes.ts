import { koffi } from './private.js'

/*
 * C typedefs used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

/*
 * Primitive types.
 */
export const cVOID      = koffi.types.void
export const cINT       = koffi.types.int
export const cUINT      = koffi.types.uint
export const cBOOL      = koffi.types.int
export const cBOOLEAN   = koffi.types.uint8
export const cBYTE      = koffi.types.uint8
export const cSHORT     = koffi.types.int16
export const cUSHORT    = koffi.types.uint16
export const cLONG      = koffi.types.int32
export const cULONG     = koffi.types.uint32
export const cDWORD     = koffi.types.uint32
export const cDWORD32   = koffi.types.uint32
export const cDWORDLONG = koffi.types.uint64
export const cDWORD64   = koffi.types.uint64
export const cPWSTR     = koffi.types.str16
export const cLPWSTR    = koffi.types.str16
export const cPCWSTR    = koffi.types.str16
export const cLPCWSTR   = koffi.types.str16

/*
 * Pointers.
 */
export const cINT_PTR   = koffi.types.int64
export const cPVOID     = koffi.pointer(koffi.types.void)
export const cLPVOID    = koffi.pointer(koffi.types.void)
export const cLPCVOID   = koffi.pointer(koffi.types.void)
export const cPDWORD    = koffi.pointer(koffi.types.uint32)
export const cLPDWORD   = koffi.pointer(koffi.types.uint32)

/*
 * Handles.
 */

// To Koffi, there is only one kind of handle.
export const cHANDLE    = koffi.pointer(koffi.opaque())

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

/*
 * Parameters and return types.
 */
export const cWPARAM    = koffi.types.uint64    // == UINT_PTR
export const cLPARAM    = koffi.types.int64     // == LONG_PTR
export const cHRESULT   = koffi.types.long      // == LONG
export const cLRESULT   = koffi.types.int64     // == LONG_PTR
export const cATOM      = koffi.types.uint16    // == WORD

export type WPARAM      = number | HANDLE
export type LPARAM      = number | BigInt | HANDLE
export type HRESULT     = number | HANDLE
export type LRESULT     = number | BigInt | HANDLE
export type ATOM        = number

/*
 * Procedures.
 */
export const cWNDPROC     = koffi.pointer(koffi.proto('__wndproc',     cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))
export const cWNDENUMPROC = koffi.pointer(koffi.proto('__wndenumproc', cBOOL,    [ cHANDLE, cLPARAM ]))
export const cDLGPROC     = koffi.pointer(koffi.proto('__dlgproc',     cINT_PTR, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

export type WNDPROC     = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number
export type WNDENUMPROC = (hWnd: HWND, lParam: LPARAM) => number
export type DLGPROC     = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number

/*
 * A few common structures.
 */
export const cPOINT = koffi.struct({
    x: cLONG,
    y: cLONG
})

export interface POINT {
    x: number
    y: number
}

export const cPOINTS = koffi.struct({
    x: cSHORT,
    y: cSHORT
})

export interface POINTS {
    x: number
    y: number
}

export const cRECT = koffi.struct({
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

export const cSIZE = koffi.struct({
    cx: cLONG,
    yy: cLONG
})

export interface SIZE {
    x: number
    y: number
}

export const cMINMAXINFO = koffi.struct({
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

export const cGUID = koffi.struct({
    Data1: koffi.types.uint32,
    Data2: koffi.types.uint16,
    Data3: koffi.types.uint16,
    Data4: koffi.array(koffi.types.uint8, 8),
})

export interface GUID {
    Data1: number
    Data2: number
    Data3: number
    Data4: Uint8Array
}

export const cLUID = koffi.struct({
    LowPart: cDWORD,
    HighPart: cLONG,
})

export interface LUID {
    LowPart: number
    HighPart: number
}
