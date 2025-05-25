import { koffi, Win32Dll, textDecoder } from './private.js'
import {
    cVOID, cBOOL, cINT, cUINT, cLONG, cDWORD, cPVOID, cPDWORD, cPWSTR,
    cATOM, type ATOM, cHANDLE, type HINSTANCE, type HCURSOR, type HICON, type HMENU, type HWND,
    cLRESULT, type LRESULT, cLPARAM, type LPARAM, cWPARAM, type WPARAM,
    cWNDPROC, type WNDPROC, cWNDENUMPROC, type WNDENUMPROC,
    type OUT
} from './ctypes.js'
import {
    cPOINT, type POINT,
    cRECT, type RECT,
    cBSMINFO, type BSMINFO,
    cMSG, type MSG,
    cWNDCLASS, WNDCLASS,
    cWNDCLASSEX, WNDCLASSEX
} from './structs.js'
import type { AW_ } from './consts/AW.js'
import type { BSF_ } from './consts/BSF.js'
import type { GA_ } from './consts/GA.js'
import type { HWND_ } from './consts/HWND.js'
import type { IDC_ } from './consts/IDC.js'
import type { IDI_ } from './consts/IDI.js'
import type { IMAGE_ } from './consts/IMAGE.js'
import type { LR_ } from './consts/LR.js'
import type { MB_ } from './consts/MB.js'
import type { MF_ } from './consts/MF.js'
import type { OBM_ } from './consts/OBM.js'
import type { OCR_ } from './consts/OCR.js'
import type { OIC_ } from './consts/OIC.js'
import type { SW_ } from './consts/SW.js'
import type { TPM_ } from './consts/TPM.js'
import type { WS_, WS_EX_ } from './consts/WS.js'
import type { WM_ } from './consts/WM.js'

const user32 = /*#__PURE__*/new Win32Dll('user32.dll')

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
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export function AppendMenu(hMenu: HMENU, uFlags: MF_, uIDNewItem: number | HMENU, lpNewItem: string | null): boolean {
    AppendMenu.native ??= user32.func('AppendMenuW', cBOOL, [ cHANDLE, cUINT, cUINT, cPWSTR ]);
    return !!AppendMenu.native(hMenu, uFlags, uIDNewItem, lpNewItem)
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
 * Sends a message to the specified recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
export function BroadcastSystemMessage(flags: BSF_, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM): [number, number | null] {
    BroadcastSystemMessage.native ??= user32.func('BroadcastSystemMessageW', cLONG, [cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM])

    const out = typeof lpInfo === 'number' ? [lpInfo] as OUT<number> : null
    const ret = BroadcastSystemMessage.native(flags, out, Msg, wParam, lParam)
    return [ret, out?.[0] ?? null]
}

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 */
export function BroadcastSystemMessageEx(flags: BSF_, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM, psbmInfo: BSMINFO | null = null): [number, number | null] {
    BroadcastSystemMessageEx.native ??= user32.func('BroadcastSystemMessageExW', cLONG, [cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM, koffi.out(koffi.pointer(cBSMINFO))])

    const out = typeof lpInfo === 'string' ? [lpInfo] as OUT<number> : null
    const ret = BroadcastSystemMessageEx.native(flags, out, Msg, wParam, lParam, psbmInfo)
    return [ret, out?.[0] ?? null]
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
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export function CheckMenuItem(hMenu: HMENU, uIDCheckItem: number, uCheck: MF_): number {
    CheckMenuItem.native ??= user32.func('CheckMenuItem', cUINT, [ cHANDLE, cUINT, cUINT ])
    return CheckMenuItem.native(hMenu, uIDCheckItem, uCheck)
}

/**
 * Creates a drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createpopupmenu
 */
export function CreatePopupMenu(): HMENU | null {
    CreatePopupMenu.native ??= user32.func('CreatePopupMenu', cHANDLE, [])
    return CreatePopupMenu.native()
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
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export function DestroyCursor(hCursor: HCURSOR): boolean {
    DestroyCursor.native ??= user32.func('DestroyCursor', cBOOL, [ cHANDLE ])
    return !!DestroyCursor.native(hCursor)
}

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export function DestroyIcon(hIcon: HICON): boolean {
    DestroyIcon.native ??= user32.func('DestroyIcon', cBOOL, [ cHANDLE ])
    return !!DestroyIcon.native(hIcon)
}

/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export function DestroyMenu(hMenu: HMENU): boolean {
    DestroyMenu.native ??= user32.func('DestroyMenu', cBOOL, [ cHANDLE ])
    return !!DestroyMenu.native(hMenu)
}

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export function DispatchMessage(lpMsg: MSG): LRESULT {
    DispatchMessage.native ??= user32.func('DispatchMessageW', cLRESULT, [koffi.pointer(cMSG)])
    return DispatchMessage.native(lpMsg)
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
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASS | null {
    GetClassInfo.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cPWSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])

    const lpWndClass = new WNDCLASS()
    return GetClassInfo.native(hInstance, lpClassName, lpWndClass) ? lpWndClass : null
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASSEX | null {
    GetClassInfoEx.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cPWSTR, koffi.inout(koffi.pointer(cWNDCLASSEX)) ])

    const lpWndClassEx = new WNDCLASSEX()
    return GetClassInfoEx.native(hInstance, lpClassName, lpWndClassEx) ? lpWndClassEx : null
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string {
    GetClassName.native ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cPWSTR), cINT ])

    const out = new Uint16Array(128)
    const len = GetClassName.native(hWnd, out, out.length)
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export function GetCursorPos(lpPoint: POINT): number {
    GetCursorPos.native ??= user32.func('GetCursorPos', cBOOL, [ koffi.out(cPOINT) ])
    return GetCursorPos.native(lpPoint)
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
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export function GetMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number): boolean {
    GetMessage.native ??= user32.func('GetMessageW', cBOOL, [koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT])
    return !!GetMessage.native(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax)
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
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export function LoadCursor(hInstance:  HINSTANCE | null, lpIconName: IDC_ | string): HCURSOR | null {
    LoadCursor.native ??= user32.func('LoadCursorW', cHANDLE, [ cHANDLE, cPWSTR ])
    return LoadCursor.native(hInstance, lpIconName)
}

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export function LoadIcon(hInstance: HINSTANCE | null, lpIconName: IDI_ | string): HICON | null {
    LoadIcon.native ??= user32.func('LoadIconW', cHANDLE, [ cHANDLE, cPWSTR ])
    return LoadIcon.native(hInstance, lpIconName)
}

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export function LoadImage(hInstance: HINSTANCE | null, lpName: IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string, type: IMAGE_, cx: number, cy: number, fuLoad: LR_): HICON | null {
    LoadImage.native ??= user32.func('LoadImageW', cHANDLE, [cHANDLE, cPWSTR, cUINT, cINT, cINT, cUINT])
    return LoadImage.native(hInstance, lpName, type, cx, cy, fuLoad)
}

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export function MessageBox(hWnd: HWND | null, lpText: string | null, lpCaption: string | null, uType: MB_): number {
    MessageBox.native ??= user32.func('MessageBoxW', cINT, [ cHANDLE, cPWSTR, cPWSTR, cUINT ])
    return MessageBox.native(hWnd, lpText, lpCaption, uType)
}

/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export function PeekMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number, wRemoveMsg: number): boolean {
    PeekMessage.native ??= user32.func('PeekMessageW', cBOOL, [koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT, cUINT])
    return !!PeekMessage.native(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax, wRemoveMsg)
}

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export function PostQuitMessage(nExitCode: number): void {
    PostQuitMessage.native ??= user32.func('PostQuitMessage', cVOID, [cINT])
    return PostQuitMessage.native(nExitCode)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(lpWndClass: WNDCLASS): ATOM {
    RegisterClass.native ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    if (typeof lpWndClass.lpfnWndProc === 'function') {
        lpWndClass = {
            ...lpWndClass,
            lpfnWndProc: koffi.register(lpWndClass.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClass.native(lpWndClass)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(lpWndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    if (typeof lpWndClassEx.lpfnWndProc === 'function') {
        lpWndClassEx = {
            ...lpWndClassEx,
            lpfnWndProc: koffi.register(lpWndClassEx.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClassEx.native(lpWndClassEx)
}

/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export function SendMessage(hWnd: HWND, Msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    SendMessage.native ??= user32.func('SendMessageW', cLRESULT, [cHANDLE, cUINT, cWPARAM, cLPARAM])
    return SendMessage.native(hWnd, Msg, wParam, lParam)
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
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export function TrackPopupMenu(hMenu: HMENU, uFlags: TPM_, x: number, y: number, nReserved: number, hWnd: HWND, prcRect?: RECT): boolean {
    TrackPopupMenu.native ??= user32.func('TrackPopupMenu', cBOOL, [ cHANDLE, cUINT, cUINT, cUINT, cUINT, cHANDLE, cRECT ])
    return !!TrackPopupMenu.native(hMenu, uFlags, x, y, nReserved, hWnd, prcRect ?? null)
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export function TranslateMessage(lpMsg: MSG): boolean {
    TranslateMessage.native ??= user32.func('TranslateMessage', cBOOL, [koffi.pointer(cMSG)])
    return !!TranslateMessage.native(lpMsg)
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export function TranslateMessageEx(lpMsg: MSG, flags: number): boolean {
    TranslateMessageEx.native ??= user32.func('TranslateMessageEx', cBOOL, [koffi.pointer(cMSG), cUINT])
    return !!TranslateMessageEx.native(lpMsg, flags)
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(lpClassName: ATOM | string, hInstance?: HINSTANCE | null): boolean {
    UnregisterClass.native ??= user32.func('UnregisterClassW', cBOOL, [ cPWSTR, cHANDLE ])
    return !!UnregisterClass.native(lpClassName, hInstance ?? null)
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
