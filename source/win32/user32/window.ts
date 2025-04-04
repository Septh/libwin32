import { koffi, textDecoder, type NUMBER_OUT } from '../private.js'
import {
    cBOOL, cINT, cUINT, cDWORD, cLPWSTR, cLPCWSTR, cLPDWORD, cLPVOID, cHANDLE,
    cWNDPROC, type WNDPROC, cWNDENUMPROC, type WNDENUMPROC,
    cWPARAM, type WPARAM, cLPARAM, type LPARAM, cLRESULT, type LRESULT,
    type HWND, type HINSTANCE, type HMENU, cRECT, type RECT
} from '../ctypes.js'
import type { HWND_, WS_, WS_EX_, WM_, GA_, AW_, SW_ } from '../consts.js'
import { user32 } from './_lib.js'

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrect
 */
export function AdjustWindowRect(lpRect: RECT, dwStyle: WS_ | number, bMenu: boolean ): boolean {
    AdjustWindowRect.fn ??= user32.func('AdjustWindowRect', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL ])
    return !!AdjustWindowRect.fn(lpRect, dwStyle, Number(bMenu))
}

/** @internal */
export declare namespace AdjustWindowRect {
    export var fn: koffi.KoffiFunc<(lpRect: RECT, dwStyle: number, bMenu: number) => number>
}

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectex
 */
export function AdjustWindowRectEx(lpRect: RECT, dwStyle: WS_ | number, bMenu: boolean, cwExStyle: WS_EX_ | number): boolean {
    AdjustWindowRectEx.fn ??= user32.func('AdjustWindowRectEx', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL, cDWORD ])
    return !!AdjustWindowRectEx.fn(lpRect, dwStyle, Number(bMenu), cwExStyle)
}

/** @internal */
export declare namespace AdjustWindowRectEx {
    export var fn: koffi.KoffiFunc<(lpRect: RECT, dwStyle: number, bMenu: number, cwExStyle: number) => number>
}

/**
 * Enables you to produce special effects when showing or hiding windows.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow
 */
export function AnimateWindow(hWnd: HWND, dwTime: number, dwFlags: AW_ | number): boolean {
    AnimateWindow.fn ??= user32.func('AnimateWindow', cBOOL, [ cHANDLE, cDWORD, cDWORD ])
    return !!AnimateWindow.fn(hWnd, dwTime, dwFlags)
}

/** @internal */
export declare namespace AnimateWindow {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, dwTime: number, dwFlags: AW_ | number) => number>
}

/**
 * Brings the specified window to the top of the Z order.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-bringwindowtotop
 */
export function BringWindowToTop(hWnd: HWND): boolean {
    BringWindowToTop.fn ??= user32.func('BringWindowToTop', cBOOL, [ cHANDLE ])
    return !!BringWindowToTop.fn(hWnd)
}

/** @internal */
export declare namespace BringWindowToTop {
    export var fn: koffi.KoffiFunc<(hWnd: HWND) => number>
}

/**
 * Passes message information to the specified window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-callwindowprocw
 */
export function CallWindowProc(lpPrevWndFunc: WNDPROC, hWnd: HWND, Msg: WM_ | number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    CallWindowProc.fn ??= user32.func('CallWindowProcW', cLRESULT, [ cWNDPROC, cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return CallWindowProc.fn(lpPrevWndFunc, hWnd, Msg, wParam, lParam)
}

/** @internal */
export declare namespace CallWindowProc {
    export var fn: koffi.KoffiFunc<(lpPrevWndFunc: WNDPROC, hWnd: HWND, Msg: WM_ | number, wParam: WPARAM, lParam: LPARAM) => LRESULT>
}

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
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
export function CreateWindowEx(
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
): HWND | null {
    CreateWindowEx.fn ??= user32.func('CreateWindowExW', cHANDLE, [ cDWORD, cLPCWSTR, cLPCWSTR, cDWORD, cINT, cINT, cINT, cINT, cHANDLE, cHANDLE, cHANDLE, cLPVOID ])
    return CreateWindowEx.fn(dwExStyle, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam)
}

/** @internal */
export declare namespace CreateWindowEx {
    export var fn: koffi.KoffiFunc<(
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
    ) => HWND | null>
}

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export function DefWindowProc(hWnd: HWND, msg: number, wParam: WPARAM, lpParam: LPARAM): LRESULT {
    DefWindowProc.fn ??= user32.func('DefWindowProcW', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return DefWindowProc.fn(hWnd, msg, wParam, lpParam)
}

/** @internal */
export declare namespace DefWindowProc {
    export var fn: koffi.KoffiFunc<WNDPROC>
}

/**
 * Enumerates all top-level windows on the screen by passing the handle to each window, in turn, to an application-defined callback function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export function EnumWindows(lpEnumFunc: WNDENUMPROC, lpParam: LPARAM): boolean {
    EnumWindows.fn ??= user32.func('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])
    return !!EnumWindows.fn(lpEnumFunc, lpParam)
}

/** @internal */
export declare namespace EnumWindows {
    export var fn: koffi.KoffiFunc<(lpEnumFunc: WNDENUMPROC, lpParam: LPARAM) => number>
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindoww
 */
export function FindWindow(lpClassName: string | null, lpWindowName: string | null): HWND | null {
    FindWindow.fn ??= user32.func('FindWindowW', cHANDLE, [ cLPCWSTR, cLPCWSTR ])
    return FindWindow.fn(lpClassName, lpWindowName)
}

/** @internal */
export declare namespace FindWindow {
    export var fn: koffi.KoffiFunc<(lpClassName: string | null, lpWindowName: string | null) => HWND | null>
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowexw
 */
export function FindWindowEx(hWndParent: HWND | HWND_ | null, hWndChildAfter: HWND | null, lpClassName: string | null, lpWindowName: string | null): HWND | null {
    FindWindowEx.fn ??= user32.func('FindWindowExW', cHANDLE, [ cHANDLE, cHANDLE, cLPCWSTR, cLPCWSTR ])
    return FindWindowEx.fn(hWndParent, hWndChildAfter, lpClassName, lpWindowName)
}

/** @internal */
export declare namespace FindWindowEx {
    export var fn: koffi.KoffiFunc<(hWndParent: HWND | HWND_ | null, hWndChildAfter: HWND | null, lpClassName: string | null, lpWindowName: string | null) => HWND | null>
}

/**
 * Retrieves the handle to the ancestor of the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getancestor
 */
export function GetAncestor(hWnd: HWND, gaFlags: GA_): HWND | null {
    GetAncestor.fn ??= user32.func('GetAncestor', cHANDLE, [ cHANDLE, cUINT ])
    return GetAncestor.fn(hWnd, gaFlags)
}

/** @internal */
export declare namespace GetAncestor {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, gaFlags: GA_) => HWND | null>
}

/**
 *
 * Retrieves a handle to the foreground window (the window with which the user is currently working).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getforegroundwindow
 *
 */
export function GetForegroundWindow(): HWND {
    GetForegroundWindow.fn ??= user32.func('GetForegroundWindow', cHANDLE, [])
    return GetForegroundWindow.fn()
}

/** @internal */
export declare namespace GetForegroundWindow {
    export var fn: koffi.KoffiFunc<() => HWND>
}

/**
 *
 * Retrieves the identifier of the thread that created the specified window and, optionally, the identifier of the process that created the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowthreadprocessid
 *
 */
export function GetWindowThreadProcessId(hWnd: HWND): [ number, number ] {
    GetWindowThreadProcessId.fn ??= user32.func('GetWindowThreadProcessId', cDWORD, [ cHANDLE, koffi.out(cLPDWORD) ])

    const int: NUMBER_OUT = [ 0 ]
    const tid = GetWindowThreadProcessId.fn(hWnd, int)
    return [ tid, int[0] ]
}

/** @internal */
export declare namespace GetWindowThreadProcessId {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, lpdwProcessId: NUMBER_OUT) => number>
}

/**
 * Returns text of the specified window's title bar (if it has one).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw
 */
export function GetWindowText(hWnd: HWND): string {
    GetWindowText.fn ??= user32.func('GetWindowTextW', cINT, [ cHANDLE, koffi.out(cLPWSTR), cINT ])

    const out = new Uint16Array(512)
    const len = GetWindowText.fn(hWnd, out, out.length)
    return textDecoder.decode(out.slice(0, len))
}

/** @internal */
export declare namespace GetWindowText {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, lpString: Uint16Array, nMaxCount: number) => number>
}

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export function ShowWindow(hWnd: HWND, nCmdShow: SW_ | number): boolean {
    ShowWindow.fn ??= user32.func('ShowWindow', cBOOL, [ cHANDLE, cINT ])
    return !!ShowWindow.fn(hWnd, nCmdShow)
}

/** @internal */
export declare namespace ShowWindow {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, nCmdShow: SW_ | number) => number>
}

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export function ShowWindowAsync(hWnd: HWND, nCmdShow: SW_ | number): boolean {
    ShowWindowAsync.fn ??= user32.func('ShowWindowAsync', cBOOL, [ cHANDLE, cINT ])
    return !!ShowWindowAsync.fn(hWnd, nCmdShow)
}

/** @internal */
export declare namespace ShowWindowAsync {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, nCmdShow: SW_ | number) => number>
}

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export function UpdateWindow(hWnd: HWND): boolean {
    UpdateWindow.fn ??= user32.func('UpdateWindow', cBOOL, [ cHANDLE ])
    return !!UpdateWindow.fn(hWnd)
}

/** @internal */
export declare namespace UpdateWindow {
    export var fn: koffi.KoffiFunc<(hWnd: HWND) => number>
}

/**
 * Brings the thread that created the specified window into the foreground and activates the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setforegroundwindow
 */
export function SetForegroundWindow(hWnd: HWND): boolean {
    SetForegroundWindow.fn ??= user32.func('SetForegroundWindow', cBOOL, [ cHANDLE ])
    return !!SetForegroundWindow.fn(hWnd)
}

/** @internal */
export declare namespace SetForegroundWindow {
    export var fn: koffi.KoffiFunc<(hWnd: HWND) => number>
}
