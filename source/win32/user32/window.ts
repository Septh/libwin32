import { koffi, textDecoder } from '../private.js'
import {
    cBOOL, cINT, cUINT, cDWORD, cPWSTR, cPDWORD, cPVOID, cHANDLE,
    cWNDPROC, type WNDPROC, cWNDENUMPROC, type WNDENUMPROC,
    cWPARAM, type WPARAM, cLPARAM, type LPARAM, cLRESULT, type LRESULT,
    type HWND, type HINSTANCE, type HMENU, cRECT, type RECT,
    type OUT
} from '../ctypes.js'
import type { HWND_ } from '../consts/HWND.js'
import type { WS_, WS_EX_ } from '../consts/WS.js'
import type { WM_ } from '../consts/WM.js'
import type { GA_ } from '../consts/GA.js'
import type { AW_ } from '../consts/AW.js'
import type { SW_ } from '../consts/SW.js'
import { user32 } from './_lib.js'

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrect
 */
export function AdjustWindowRect(lpRect: RECT, dwStyle: WS_, bMenu: boolean ): boolean {
    AdjustWindowRect.native ??= user32.func('AdjustWindowRect', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL ])
    return !!AdjustWindowRect.native(lpRect, dwStyle, Number(bMenu))
}

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectex
 */
export function AdjustWindowRectEx(lpRect: RECT, dwStyle: WS_, bMenu: boolean, cwExStyle: WS_EX_): boolean {
    AdjustWindowRectEx.native ??= user32.func('AdjustWindowRectEx', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL, cDWORD ])
    return !!AdjustWindowRectEx.native(lpRect, dwStyle, Number(bMenu), cwExStyle)
}

/**
 * Enables you to produce special effects when showing or hiding windows.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow
 */
export function AnimateWindow(hWnd: HWND, dwTime: number, dwFlags: AW_): boolean {
    AnimateWindow.native ??= user32.func('AnimateWindow', cBOOL, [ cHANDLE, cDWORD, cDWORD ])
    return !!AnimateWindow.native(hWnd, dwTime, dwFlags)
}

/**
 * Brings the specified window to the top of the Z order.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-bringwindowtotop
 */
export function BringWindowToTop(hWnd: HWND): boolean {
    BringWindowToTop.native ??= user32.func('BringWindowToTop', cBOOL, [ cHANDLE ])
    return !!BringWindowToTop.native(hWnd)
}

/**
 * Passes message information to the specified window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-callwindowprocw
 */
export function CallWindowProc(lpPrevWndFunc: WNDPROC, hWnd: HWND, Msg: WM_, wParam: WPARAM, lParam: LPARAM): LRESULT {
    CallWindowProc.native ??= user32.func('CallWindowProcW', cLRESULT, [ cWNDPROC, cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return CallWindowProc.native(lpPrevWndFunc, hWnd, Msg, wParam, lParam)
}

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
export function CreateWindow(
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS_,
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
export function CreateWindowEx(
    dwExStyle:    WS_EX_,
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS_,
    x:            number,
    y:            number,
    nWidth:       number,
    nHeight:      number,
    hWndParent:   HWND | HWND_ | null,
    hMenu:        HMENU | null,
    hInstance:    HINSTANCE | null,
    lpParam:      LPARAM | null,
): HWND | null {
    CreateWindowEx.native ??= user32.func('CreateWindowExW', cHANDLE, [ cDWORD, cPWSTR, cPWSTR, cDWORD, cINT, cINT, cINT, cINT, cHANDLE, cHANDLE, cHANDLE, cPVOID ])
    return CreateWindowEx.native(dwExStyle, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam)
}

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export function DefWindowProc(hWnd: HWND, msg: number, wParam: WPARAM, lpParam: LPARAM): LRESULT {
    DefWindowProc.native ??= user32.func('DefWindowProcW', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return DefWindowProc.native(hWnd, msg, wParam, lpParam)
}

/**
 * Enumerates all top-level windows on the screen by passing the handle to each window, in turn, to an application-defined callback function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export function EnumWindows(lpEnumFunc: WNDENUMPROC, lpParam: LPARAM): boolean {
    EnumWindows.native ??= user32.func('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])
    return !!EnumWindows.native(lpEnumFunc, lpParam)
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindoww
 */
export function FindWindow(lpClassName: string | null, lpWindowName: string | null): HWND | null {
    FindWindow.native ??= user32.func('FindWindowW', cHANDLE, [ cPWSTR, cPWSTR ])
    return FindWindow.native(lpClassName, lpWindowName)
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowexw
 */
export function FindWindowEx(hWndParent: HWND | HWND_ | null, hWndChildAfter: HWND | null, lpClassName: string | null, lpWindowName: string | null): HWND | null {
    FindWindowEx.native ??= user32.func('FindWindowExW', cHANDLE, [ cHANDLE, cHANDLE, cPWSTR, cPWSTR ])
    return FindWindowEx.native(hWndParent, hWndChildAfter, lpClassName, lpWindowName)
}

/**
 * Retrieves the handle to the ancestor of the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getancestor
 */
export function GetAncestor(hWnd: HWND, gaFlags: GA_): HWND | null {
    GetAncestor.native ??= user32.func('GetAncestor', cHANDLE, [ cHANDLE, cUINT ])
    return GetAncestor.native(hWnd, gaFlags)
}

/**
 *
 * Retrieves a handle to the foreground window (the window with which the user is currently working).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getforegroundwindow
 *
 */
export function GetForegroundWindow(): HWND {
    GetForegroundWindow.native ??= user32.func('GetForegroundWindow', cHANDLE, [])
    return GetForegroundWindow.native()
}

/**
 *
 * Retrieves the identifier of the thread that created the specified window and, optionally, the identifier of the process that created the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowthreadprocessid
 *
 */
export function GetWindowThreadProcessId(hWnd: HWND): [ number, number ] {
    GetWindowThreadProcessId.native ??= user32.func('GetWindowThreadProcessId', cDWORD, [ cHANDLE, koffi.out(cPDWORD) ])

    const int: OUT<number> = [ 0 ]
    const tid = GetWindowThreadProcessId.native(hWnd, int)
    return [ tid, int[0] ]
}

/**
 * Returns text of the specified window's title bar (if it has one).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw
 */
export function GetWindowText(hWnd: HWND): string {
    GetWindowText.native ??= user32.func('GetWindowTextW', cINT, [ cHANDLE, koffi.out(cPWSTR), cINT ])

    const out = new Uint16Array(512)
    const len = GetWindowText.native(hWnd, out, out.length)
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export function ShowWindow(hWnd: HWND, nCmdShow: SW_): boolean {
    ShowWindow.native ??= user32.func('ShowWindow', cBOOL, [ cHANDLE, cINT ])
    return !!ShowWindow.native(hWnd, nCmdShow)
}

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export function ShowWindowAsync(hWnd: HWND, nCmdShow: SW_): boolean {
    ShowWindowAsync.native ??= user32.func('ShowWindowAsync', cBOOL, [ cHANDLE, cINT ])
    return !!ShowWindowAsync.native(hWnd, nCmdShow)
}

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export function UpdateWindow(hWnd: HWND): boolean {
    UpdateWindow.native ??= user32.func('UpdateWindow', cBOOL, [ cHANDLE ])
    return !!UpdateWindow.native(hWnd)
}

/**
 * Brings the thread that created the specified window into the foreground and activates the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setforegroundwindow
 */
export function SetForegroundWindow(hWnd: HWND): boolean {
    SetForegroundWindow.native ??= user32.func('SetForegroundWindow', cBOOL, [ cHANDLE ])
    return !!SetForegroundWindow.native(hWnd)
}
