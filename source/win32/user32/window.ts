import koffi from 'koffi-cream'
import { StringOutputBuffer, type OUT } from '../private.js'
import {
    cBOOL, cINT, cUINT, cDWORD, cPVOID, cPDWORD, cSTR,
    cHANDLE, type HINSTANCE, type HMENU, type HWND, type HDESK,
    cLRESULT, type LRESULT, cWPARAM, type WPARAM, cLPARAM, type LPARAM
} from '../ctypes.js'
import {
    cRECT, type RECT,
    cWNDPROC, type WNDPROC,
    cWNDENUMPROC, type WNDENUMPROC
} from '../structs.js'
import type { WS_, WS_EX_, WM_, HWND_, AW_, GA_, SW_ } from '../consts.js'
import { user32 } from './lib.js'

export interface GetWindowThreadProcessIdResult {
    threadId: number
    processId: number
}

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrect
 */
export function AdjustWindowRect(rect: RECT, style: WS_, menu: boolean): boolean {
    AdjustWindowRect.native ??= user32.func('AdjustWindowRect', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL ])
    return AdjustWindowRect.native(rect, style, Number(menu)) !== 0
}

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectex
 */
export function AdjustWindowRectEx(rect: RECT, style: WS_, menu: boolean, exStyle: WS_EX_): boolean {
    AdjustWindowRectEx.native ??= user32.func('AdjustWindowRectEx', cBOOL, [ koffi.inout(cRECT), cDWORD, cBOOL, cDWORD ])
    return AdjustWindowRectEx.native(rect, style, Number(menu), exStyle) !== 0
}

/**
 * Calculates the required size of the window rectangle, based on the desired client-rectangle size and the provided DPI.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-adjustwindowrectexfordpi
 */
export function AdjustWindowRectExForDpi(rect: RECT, style: WS_, menu: boolean, exStyle: WS_EX_, dpi: number): boolean {
    AdjustWindowRectExForDpi.native ??= user32.func('AdjustWindowRectExForDpi', cBOOL, [
        koffi.inout(koffi.pointer(cRECT)), cDWORD, cBOOL, cDWORD, cUINT
    ])
    return AdjustWindowRectExForDpi.native(rect, style, Number(menu), exStyle, dpi) !== 0
}

/**
 * Enables you to produce special effects when showing or hiding windows.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow
 */
export function AnimateWindow(hWnd: HWND, time: number, flags: AW_): boolean {
    AnimateWindow.native ??= user32.func('AnimateWindow', cBOOL, [ cHANDLE, cDWORD, cDWORD ])
    return AnimateWindow.native(hWnd, time, flags) !== 0
}

/**
 * Brings the specified window to the top of the Z order.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-bringwindowtotop
 */
export function BringWindowToTop(hWnd: HWND): boolean {
    BringWindowToTop.native ??= user32.func('BringWindowToTop', cBOOL, [ cHANDLE ])
    return BringWindowToTop.native(hWnd) !== 0
}

/**
 * Passes message information to the specified window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-callwindowprocw
 */
export function CallWindowProc(lpPrevWndFunc: WNDPROC, hWnd: HWND, msg: WM_, wParam: WPARAM, lParam: LPARAM): LRESULT {
    CallWindowProc.native ??= user32.func('CallWindowProcW', cLRESULT, [ cWNDPROC, cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return CallWindowProc.native(lpPrevWndFunc, hWnd, msg, wParam, lParam)
}

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
export function CreateWindow(
    className:  string | null,
    windowName: string | null,
    style:      WS_,
    x:          number,
    y:          number,
    width:      number,
    height:     number,
    hWndParent: HWND | HWND_ | null,
    hMenu:      HMENU | null,
    hInstance:  HINSTANCE | null,
    lParam:     LPARAM,
): HWND | null {
    return CreateWindowEx(0, className, windowName, style, x, y, width, height, hWndParent, hMenu, hInstance, lParam)
}

/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export function CreateWindowEx(
    exStyle:    WS_EX_,
    className:  string | null,
    windowName: string | null,
    style:      WS_,
    x:          number,
    y:          number,
    width:      number,
    height:     number,
    hWndParent: HWND | HWND_ | null,
    hMenu:      HMENU | null,
    hInstance:  HINSTANCE | null,
    lParam:     LPARAM | null,
): HWND | null {
    CreateWindowEx.native ??= user32.func('CreateWindowExW', cHANDLE, [
        cDWORD, cSTR, cSTR, cDWORD, cINT, cINT, cINT, cINT, cHANDLE, cHANDLE, cHANDLE, cLPARAM
    ])
    return CreateWindowEx.native(
        exStyle, className, windowName, style, x, y, width, height, hWndParent, hMenu, hInstance, lParam
    )
}

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export function DefWindowProc(hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    DefWindowProc.native ??= user32.func('DefWindowProcW', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return DefWindowProc.native(hWnd, msg, wParam, lParam)
}

/**
 * Enumerates all top-level windows on the screen.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export function EnumWindows(lpEnumFunc: WNDENUMPROC, lParam: LPARAM): boolean {
    EnumWindows.native ??= user32.func('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])
    return EnumWindows.native(lpEnumFunc, lParam) !== 0
}

/**
 * Enumerates all top-level windows associated with the specified desktop.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumdesktopwindows
 */
export function EnumDesktopWindows(hDesktop: HDESK | null, lpEnumFunc: WNDENUMPROC, lParam: LPARAM): boolean {
    EnumDesktopWindows.native ??= user32.func('EnumDesktopWindows', cBOOL, [ cHANDLE, cWNDENUMPROC, cLPARAM ])
    return EnumDesktopWindows.native(hDesktop, lpEnumFunc, lParam) !== 0
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindoww
 */
export function FindWindow(className: string | null, windowName: string | null): HWND | null {
    FindWindow.native ??= user32.func('FindWindowW', cHANDLE, [ cSTR, cSTR ])
    return FindWindow.native(className, windowName)
}

/**
 * Retrieves a handle to the top-level window whose class name and window name match the specified strings.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-findwindowexw
 */
export function FindWindowEx(
    hWndParent: HWND | HWND_ | null, hWndChildAfter: HWND | null, className: string | null, windowName: string | null
): HWND | null {
    FindWindowEx.native ??= user32.func('FindWindowExW', cHANDLE, [ cHANDLE, cHANDLE, cSTR, cSTR ])
    return FindWindowEx.native(hWndParent, hWndChildAfter, className, windowName)
}

/**
 * Retrieves the handle to the ancestor of the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getancestor
 */
export function GetAncestor(hWnd: HWND, flags: GA_): HWND | null {
    GetAncestor.native ??= user32.func('GetAncestor', cHANDLE, [ cHANDLE, cUINT ])
    return GetAncestor.native(hWnd, flags)
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
 * Returns the text of the specified window's title bar (if it has one).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowtextw
 */
export function GetWindowText(hWnd: HWND): string {
    GetWindowText.native ??= user32.func('GetWindowTextW', cINT, [ cHANDLE, koffi.out(cPVOID), cINT ])

    const text = new StringOutputBuffer(1024)
    const len = GetWindowText.native(hWnd, text.buffer, text.length)
    return text.decode(len)
}

/**
 *
 * Retrieves the identifier of the thread that created the specified window and, optionally,
 * the identifier of the process that created the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowthreadprocessid
 *
 */
export function GetWindowThreadProcessId(hWnd: HWND): GetWindowThreadProcessIdResult {
    GetWindowThreadProcessId.native ??= user32.func('GetWindowThreadProcessId', cDWORD, [ cHANDLE, koffi.out(cPDWORD) ])

    const pProcessId: OUT<number> = [0]
    const threadId: number = GetWindowThreadProcessId.native(hWnd, pProcessId)
    return { threadId, processId: pProcessId[0] }
}

/**
 * Brings the thread that created the specified window into the foreground and activates the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setforegroundwindow
 */
export function SetForegroundWindow(hWnd: HWND): boolean {
    SetForegroundWindow.native ??= user32.func('SetForegroundWindow', cBOOL, [ cHANDLE ])
    return SetForegroundWindow.native(hWnd) !== 0
}

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export function ShowWindow(hWnd: HWND, cmdShow: SW_): boolean {
    ShowWindow.native ??= user32.func('ShowWindow', cBOOL, [ cHANDLE, cINT ])
    return ShowWindow.native(hWnd, cmdShow) !== 0
}

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export function ShowWindowAsync(hWnd: HWND, cmdShow: SW_): boolean {
    ShowWindowAsync.native ??= user32.func('ShowWindowAsync', cBOOL, [ cHANDLE, cINT ])
    return ShowWindowAsync.native(hWnd, cmdShow) !== 0
}

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window
 * if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export function UpdateWindow(hWnd: HWND): boolean {
    UpdateWindow.native ??= user32.func('UpdateWindow', cBOOL, [ cHANDLE ])
    return UpdateWindow.native(hWnd) !== 0
}
