import {
    opaque, proto,
    pointer, inout, out, textDecoder,
    type koffi
} from '../../private.js'
import {
    cLPVOID, cBOOL, cINT, cUINT, cDWORD, cLPWSTR, cLPCWSTR,
    cHINSTANCE, cWPARAM, cLPARAM, cLRESULT,
    type HINSTANCE, type HANDLE, type LPARAM, type WPARAM, type LRESULT
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHMENU, type HMENU } from './menu.js'
import { cLPRECT, type RECT } from './rect.js'
import type { HWND_ } from '../consts/HWND.js'
import type { WS_, WS_EX_ } from '../consts/WS.js'
import type { WM_ } from '../consts/WM.js'
import type { GA_ } from '../consts/GA.js'
import type { AW_ } from '../consts/AW.js'
import type { SW_ } from '../consts/SW.js'

// #region Types

export const cHWND = pointer('HWND', opaque())
export type HWND = HANDLE<'HWND'>

export const cWNDPROC = pointer('WNDPROC', proto('__wndproc', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ]))
export type WNDPROC = (hWnd: HWND, msg: WM_, wParam: WPARAM, lParam: LPARAM) => number

export const cWNDENUMPROC = pointer('WNDENUMPROC', proto('__wndenumproc', cBOOL, [ cHWND, cLPARAM ]))
export type WNDENUMPROC = (hWnd: HWND, lParam: LPARAM) => number

// #endregion

// #region Functions

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrect
 */
export const AdjustWindowRect: koffi.KoffiFunc<(
    lpRect: RECT,
    dwStyle: WS_ | number,
    bMenu: number
) => number> = user32('AdjustWindowRect', cBOOL, [ inout(cLPRECT), cDWORD, cBOOL ])

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectex
 */
export const AdjustWindowRectEx: koffi.KoffiFunc<(
    lpRect: RECT,
    dwStyle: WS_ | number,
    bMenu: number,
    cwExStyle: WS_EX_ | number
) => number> = user32('AdjustWindowRect', cBOOL, [ inout(cLPRECT), cDWORD, cBOOL, cDWORD ])

/**
 * Enables you to produce special effects when showing or hiding windows.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow
 */
export const AnimateWindow: koffi.KoffiFunc<(
    hWnd: HWND,
    dwTime: number,
    dwFlags: AW_ | number
) => number> = user32('AnimateWindow', cBOOL, [ cHWND, cDWORD, cDWORD ])

/**
 * Brings the specified window to the top of the Z order.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-bringwindowtotop
 */
export const BringWindowToTop: koffi.KoffiFunc<(
    hWnd: HWND
) => number> = user32('BringWindowToTop', cBOOL, [ cHWND ])

/**
 * Passes message information to the specified window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-callwindowprocw
 */
export const CallWindowProc: koffi.KoffiFunc<(
    lpPrevWndFunc: WNDPROC,
    hWnd: HWND,
    Msg: WM_ | number,
    wParam: WPARAM,
    lParam: LPARAM
) => LRESULT> = user32('CallWindowProcW', cLRESULT, [ cWNDPROC, cHWND, cUINT, cWPARAM, cLPARAM ])

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
/*@__NO_SIDE_EFFECTS__*/
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
): HWND {
    return CreateWindowEx(0, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam)
}

/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export const CreateWindowEx: koffi.KoffiFunc<(
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
    lpParam:      LPARAM,
) => HWND> = user32(
    'CreateWindowExW', cHWND,
    [ cDWORD, cLPCWSTR, cLPCWSTR, cDWORD, cINT, cINT, cINT, cINT, cHWND, cHMENU, cHINSTANCE, cLPVOID ]
)

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export const DefWindowProc: koffi.KoffiFunc<WNDPROC> = user32('DefWindowProcW', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ])

/**
 * Enumerates all top-level windows on the screen by passing the handle to each window, in turn, to an application-defined callback function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export const EnumWindows: koffi.KoffiFunc<(
    lpEnumFunc: WNDENUMPROC,
    lpParam: LPARAM
) => number> = user32('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindoww
 */
export const FindWindow: koffi.KoffiFunc<(
    lpClassName: string | null,
    lpWindowName: string | null
) => HWND> = user32('FindWindowW', cHWND, [ cLPCWSTR, cLPCWSTR ])

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowexw
 */
export const FindWindowEx: koffi.KoffiFunc<(
    hWndParent: HWND | HWND_ | null,
    hWndChildAfter: HWND | null,
    lpClassName: string | null,
    lpWindowName: string | null
) => HWND | null> = user32('FindWindowExW', cHWND, [ cHWND, cHWND, cLPCWSTR, cLPCWSTR ])

/**
 * Retrieves the handle to the ancestor of the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getancestor
 */
export const GetAncestor: koffi.KoffiFunc<(
    hWnd: HWND,
    gaFlags: GA_
) => HWND> = user32('GetAncestor', cHWND, [ cHWND, cUINT ])

/**
 * Returns text of the specified window's title bar (if it has one).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw
 */
/*@__NO_SIDE_EFFECTS__*/
export function GetWindowText(hWnd: HWND): string {
    const out = new Uint16Array(512)
    const len = _GetWindowText(hWnd, out, 512)
    return textDecoder.decode(out).slice(0, len)
}
const _GetWindowText = user32('GetWindowTextW', cINT, [ cHWND, out(cLPWSTR), cINT ])

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export const ShowWindow: koffi.KoffiFunc<(
    hWnd:     HWND,
    nCmdShow: SW_ | number
) => boolean> = user32('ShowWindow', cBOOL, [ cHWND, cINT ])

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export const ShowWindowAsync: koffi.KoffiFunc<(
    hWnd:     HWND,
    nCmdShow: SW_ | number
) => boolean> = user32('ShowWindowAsync', cBOOL, [ cHWND, cINT ])

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export const UpdateWindow: koffi.KoffiFunc<(
    hWnd: HWND
) => boolean> = user32('UpdateWindow', cBOOL, [ cHWND ])

/**
 * Brings the thread that created the specified window into the foreground and activates the window.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setforegroundwindow
 */
export const SetForegroundWindow: koffi.KoffiFunc<(
    hWnd: HWND
) => number> = user32('SetForegroundWindow', cBOOL, [ cHWND ])
