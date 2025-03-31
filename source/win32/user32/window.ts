import { koffi, textDecoder } from '../../private.js'
import {
    cBOOL, cINT, cUINT, cDWORD, cLPWSTR, cLPCWSTR, cLPDWORD, cLPVOID,
    cHWND, type HWND, cWNDPROC, type WNDPROC, cWNDENUMPROC, type WNDENUMPROC,
    cWPARAM, type WPARAM, cLPARAM, type LPARAM, cLRESULT, type LRESULT,
    cHINSTANCE, type HINSTANCE,
    cHMENU, type HMENU,
    cLPRECT, type RECT,
} from '../../ctypes.js'
import type { HWND_, WS_, WS_EX_, WM_, GA_, AW_, SW_ } from '../consts.js'
import { user32 } from './_lib.js'

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrect
 */
export const AdjustWindowRect: (
    lpRect: RECT,
    dwStyle: WS_ | number,
    bMenu: number
) => number = /*#__PURE__*/user32.func('AdjustWindowRect', cBOOL, [ koffi.inout(cLPRECT), cDWORD, cBOOL ])

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectex
 */
export const AdjustWindowRectEx: (
    lpRect: RECT,
    dwStyle: WS_ | number,
    bMenu: number,
    cwExStyle: WS_EX_ | number
) => number = /*#__PURE__*/user32.func('AdjustWindowRectEx', cBOOL, [ koffi.inout(cLPRECT), cDWORD, cBOOL, cDWORD ])

/**
 * Enables you to produce special effects when showing or hiding windows.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow
 */
export const AnimateWindow: (
    hWnd: HWND,
    dwTime: number,
    dwFlags: AW_ | number
) => number = /*#__PURE__*/user32.func('AnimateWindow', cBOOL, [ cHWND, cDWORD, cDWORD ])

/**
 * Brings the specified window to the top of the Z order.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-bringwindowtotop
 */
export const BringWindowToTop: (
    hWnd: HWND
) => number = /*#__PURE__*/user32.func('BringWindowToTop', cBOOL, [ cHWND ])

/**
 * Passes message information to the specified window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-callwindowprocw
 */
export const CallWindowProc: (
    lpPrevWndFunc: WNDPROC,
    hWnd: HWND,
    Msg: WM_ | number,
    wParam: WPARAM,
    lParam: LPARAM
) => LRESULT = /*#__PURE__*/user32.func('CallWindowProcW', cLRESULT, [ cWNDPROC, cHWND, cUINT, cWPARAM, cLPARAM ])

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
/*#__NO_SIDE_EFFECTS__*/
export function CreateWindow(
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS_ | number,
    x:            number,
    y:            number,
    nWidth:       number,
    nHeight:      number,
    hWndParent:   HWND | HWND_ | null,
    hMenu:        HMENU | null,
    hInstance:    HINSTANCE | null,
    lpParam:      LPARAM,
): HWND | null {
    return CreateWindowEx(0, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam)
}

/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export const CreateWindowEx: (
    dwExStyle:    WS_EX_ | number,
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS_ | number,
    x:            number,
    y:            number,
    nWidth:       number,
    nHeight:      number,
    hWndParent:   HWND | HWND_ | null,
    hMenu:        HMENU | null,
    hInstance:    HINSTANCE | null,
    lpParam:      LPARAM | null,
) => HWND | null = /*#__PURE__*/user32.func('CreateWindowExW', cHWND, [ cDWORD, cLPCWSTR, cLPCWSTR, cDWORD, cINT, cINT, cINT, cINT, cHWND, cHMENU, cHINSTANCE, cLPVOID ])

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export const DefWindowProc: WNDPROC = /*#__PURE__*/user32.func('DefWindowProcW', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ])

/**
 * Enumerates all top-level windows on the screen by passing the handle to each window, in turn, to an application-defined callback function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export const EnumWindows: (
    lpEnumFunc: WNDENUMPROC,
    lpParam: LPARAM
) => number = /*#__PURE__*/user32.func('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindoww
 */
export const FindWindow: (
    lpClassName: string | null,
    lpWindowName: string | null
) => HWND | null = /*#__PURE__*/user32.func('FindWindowW', cHWND, [ cLPCWSTR, cLPCWSTR ])

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowexw
 */
export const FindWindowEx: (
    hWndParent: HWND | HWND_ | null,
    hWndChildAfter: HWND | null,
    lpClassName: string | null,
    lpWindowName: string | null
) => HWND | null = /*#__PURE__*/user32.func('FindWindowExW', cHWND, [ cHWND, cHWND, cLPCWSTR, cLPCWSTR ])

/**
 * Retrieves the handle to the ancestor of the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getancestor
 */
export const GetAncestor: (
    hWnd: HWND,
    gaFlags: GA_
) => HWND | null = /*#__PURE__*/user32.func('GetAncestor', cHWND, [ cHWND, cUINT ])

/**
 *
 * Retrieves a handle to the foreground window (the window with which the user is currently working).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getforegroundwindow
 *
 */
export const GetForegroundWindow: () => HWND = /*#__PURE__*/user32.func('GetForegroundWindow', cHWND, [])

/**
 *
 * Retrieves the identifier of the thread that created the specified window and, optionally, the identifier of the process that created the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowthreadprocessid
 *
 */
/*@__NO_SIDE_EFFECTS__*/
export function GetWindowThreadProcessId(hWnd: HWND): [ number, number ] {
    const int: [ number ] = [ 0 ]
    const tid = _GetWindowThreadProcessId(hWnd, int)
    return [ tid, int[0] ]
}

const _GetWindowThreadProcessId: (
    hWnd: HWND,
    lpdwProcessId: [ number ]
) => number = /*#__PURE__*/user32.func('GetWindowThreadProcessId', cDWORD, [ cHWND, koffi.out(cLPDWORD) ])

/**
 * Returns text of the specified window's title bar (if it has one).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw
 */
/*#__NO_SIDE_EFFECTS__*/
export function GetWindowText(hWnd: HWND): string {
    const buf = new Uint16Array(512)
    const len = _GetWindowText(hWnd, buf, buf.length)
    return textDecoder.decode(buf.slice(0, len))
}

const _GetWindowText: (
    hWnd: HWND,
    lpString: Uint16Array,
    nMaxCount: number
) => number = /*#__PURE__*/user32.func('GetWindowTextW', cINT, [ cHWND, koffi.out(cLPWSTR), cINT ])

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export const ShowWindow: (
    hWnd:     HWND,
    nCmdShow: SW_ | number
) => number = /*#__PURE__*/user32.func('ShowWindow', cBOOL, [ cHWND, cINT ])

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export const ShowWindowAsync: (
    hWnd:     HWND,
    nCmdShow: SW_ | number
) => number = /*#__PURE__*/user32.func('ShowWindowAsync', cBOOL, [ cHWND, cINT ])

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export const UpdateWindow: (
    hWnd: HWND
) => number = /*#__PURE__*/user32.func('UpdateWindow', cBOOL, [ cHWND ])

/**
 * Brings the thread that created the specified window into the foreground and activates the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setforegroundwindow
 */
export const SetForegroundWindow: (
    hWnd: HWND
) => number = /*#__PURE__*/user32.func('SetForegroundWindow', cBOOL, [ cHWND ])
