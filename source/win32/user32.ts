import { koffi, Win32Dll, StringOutputBuffer, type OUT } from './private.js'
import {
    cVOID, cBOOL, cINT, cUINT, cWORD, cLONG, cDWORD, cPVOID, cSTR,
    cATOM, type ATOM, cHANDLE, type HINSTANCE, type HCURSOR, type HICON, type HMENU, type HWND, type HDESK,
    cLRESULT, type LRESULT, cWPARAM, type WPARAM, cLPARAM, type LPARAM
} from './ctypes.js'
import {
    cPOINT, type POINT,
    cRECT, type RECT,
    cBSMINFO, type BSMINFO,
    cMSG, type MSG,
    cWNDPROC, type WNDPROC, cWNDENUMPROC, type WNDENUMPROC,
    cWNDCLASS, WNDCLASS,
    cWNDCLASSEX, WNDCLASSEX
} from './structs.js'
import type {
    WS_, WS_EX_, WM_, HWND_,
    AW_, MF_, BSF_, GA_,
    IDC_, IDI_, OIC_, OCR_, OBM_, IMAGE_,
    LR_, MB_, SW_, TPM_,
    BSM_,
    PM_
} from './consts.js'

/** @internal */
export const user32 = /*#__PURE__*/new Win32Dll('user32.dll')

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
    AdjustWindowRectExForDpi.native ??= user32.func('AdjustWindowRectExForDpi', cBOOL, [ koffi.inout(koffi.pointer(cRECT)), cDWORD, cBOOL, cDWORD, cUINT ])
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
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export function AppendMenu(hMenu: HMENU, flags: MF_, idNewItem: number | HMENU, newItem: string | null): boolean {
    AppendMenu.native ??= user32.func('AppendMenuW', cBOOL, [ cHANDLE, cUINT, cUINT, cSTR ]);
    return AppendMenu.native(hMenu, flags, idNewItem, newItem) !== 0
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
 * Sends a message to the specified recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
export function BroadcastSystemMessage(flags: BSF_, info: BSM_ | null, msg: number, wParam: WPARAM, lParam: LPARAM): BroadcastSystemMessageResult {
    BroadcastSystemMessage.native ??= user32.func('BroadcastSystemMessageW', cLONG, [ cDWORD, koffi.inout(koffi.pointer(cDWORD)), cUINT, cWPARAM, cLPARAM ])

    const pBsm: OUT<BSM_> | null = typeof info === 'number' ? [info] : null
    return BroadcastSystemMessage.native(flags, pBsm, msg, wParam, lParam) > 0
        ? { success: true,  info: pBsm?.[0] }
        : { success: false }
}

export interface BroadcastSystemMessageResult {
    success: boolean
    info?: BSM_
}

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 *
 */
export function BroadcastSystemMessageEx(flags: BSF_, info: BSM_ | null, msg: number, wParam: WPARAM, lParam: LPARAM, bsmInfo: BSMINFO | null = null): BroadcastSystemMessageExResult {
    BroadcastSystemMessageEx.native ??= user32.func('BroadcastSystemMessageExW', cLONG, [ cDWORD, koffi.inout(koffi.pointer(cDWORD)), cUINT, cWPARAM, cLPARAM, koffi.out(koffi.pointer(cBSMINFO)) ])

    const pBsm: OUT<BSM_> | null = typeof info === 'string' ? [info] : null
    return BroadcastSystemMessageEx.native(flags, pBsm, msg, wParam, lParam, bsmInfo)
        ? { success: true,  info: pBsm?.[0] }
        : { success: false }
}

export interface BroadcastSystemMessageExResult {
    success: boolean
    info?: BSM_
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
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export function CheckMenuItem(hMenu: HMENU, idCheckItem: number, check: MF_): MF_ | -1 {
    CheckMenuItem.native ??= user32.func('CheckMenuItem', cUINT, [ cHANDLE, cUINT, cUINT ])
    return CheckMenuItem.native(hMenu, idCheckItem, check)
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
    CreateWindowEx.native ??= user32.func('CreateWindowExW', cHANDLE, [ cDWORD, cSTR, cSTR, cDWORD, cINT, cINT, cINT, cINT, cHANDLE, cHANDLE, cHANDLE, cLPARAM ])
    return CreateWindowEx.native(exStyle, className, windowName, style, x, y, width, height, hWndParent, hMenu, hInstance, lParam)
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
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export function DestroyCursor(hCursor: HCURSOR): boolean {
    DestroyCursor.native ??= user32.func('DestroyCursor', cBOOL, [ cHANDLE ])
    return DestroyCursor.native(hCursor) !== 0
}

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export function DestroyIcon(hIcon: HICON): boolean {
    DestroyIcon.native ??= user32.func('DestroyIcon', cBOOL, [ cHANDLE ])
    return DestroyIcon.native(hIcon) !== 0
}

/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export function DestroyMenu(hMenu: HMENU): boolean {
    DestroyMenu.native ??= user32.func('DestroyMenu', cBOOL, [ cHANDLE ])
    return DestroyMenu.native(hMenu) !== 0
}

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export function DispatchMessage(msg: MSG): LRESULT {
    DispatchMessage.native ??= user32.func('DispatchMessageW', cLRESULT, [koffi.pointer(cMSG)])
    return DispatchMessage.native(msg)
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
export function FindWindowEx(hWndParent: HWND | HWND_ | null, hWndChildAfter: HWND | null, className: string | null, windowName: string | null): HWND | null {
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
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 *
 * Note: at the moment, libwin32 does not support passing an ATOM for `lpClassName`.
 */
export function GetClassInfo(hInstance: HINSTANCE | null, className: string): WNDCLASS | null {
    GetClassInfo.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])

    const pWndClass: OUT<WNDCLASS> = [new WNDCLASS()]
    if (GetClassInfo.native(hInstance, className, pWndClass) !== 0)
        return pWndClass[0]
    return null
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 *
 * Note: at the moment, libwin32 does not support passing an ATOM for `lpClassName`.
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, className: string): WNDCLASSEX | null {
    GetClassInfoEx.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASSEX)) ])

    const pWndClassEx: OUT<WNDCLASSEX> = [new WNDCLASSEX()]
    if (GetClassInfoEx.native(hInstance, className, pWndClassEx) !== 0)
        return pWndClassEx[0]
    return null
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string {
    GetClassName.native ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cPVOID), cINT ])

    const className = new StringOutputBuffer(256)
    const len = GetClassName.native(hWnd, className.buffer, className.length)
    return className.decode(len)
}

/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export function GetCursorPos(): POINT | null {
    GetCursorPos.native ??= user32.func('GetCursorPos', cBOOL, [ koffi.out(koffi.pointer(cPOINT)) ])

    const pPoint: OUT<POINT> = [{} as POINT]
    if (GetCursorPos.native(pPoint) !== 0)
        return pPoint[0]
    return null
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
export function GetMessage(hWnd: HWND | null | -1, msgFilterMin: number = 0, msgFilterMax: number = 0): MSG | null {
    GetMessage.native ??= user32.func('GetMessageW', cBOOL, [ koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT ])

    const pMsg: OUT<MSG> = [{} as MSG]
    if (GetMessage.native(pMsg, hWnd, msgFilterMin, msgFilterMax) !== 0)
        return pMsg[0]
    return null
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
 * Retrieves the identifier of the thread that created the specified window and, optionally, the identifier of the process that created the window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getwindowthreadprocessid
 *
 */
export function GetWindowThreadProcessId(hWnd: HWND): GetWindowThreadProcessIdResult {
    GetWindowThreadProcessId.native ??= user32.func('GetWindowThreadProcessId', cDWORD, [ cHANDLE, koffi.out(koffi.pointer(cDWORD)) ])

    const pProcessId: OUT<number> = [0]
    const threadId: number = GetWindowThreadProcessId.native(hWnd, pProcessId)
    return { threadId, processId: pProcessId[0] }
}

export interface GetWindowThreadProcessIdResult {
    threadId: number
    processId: number
}

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export function LoadCursor(hInstance:  HINSTANCE | null, cursorName: IDC_ | string): HCURSOR | null {
    LoadCursor.native ??= user32.func('LoadCursorW', cHANDLE, [ cHANDLE, cSTR ])
    return LoadCursor.native(hInstance, cursorName)
}

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export function LoadIcon(hInstance: HINSTANCE | null, iconName: IDI_ | string): HICON | null {
    LoadIcon.native ??= user32.func('LoadIconW', cHANDLE, [ cHANDLE, cSTR ])
    return LoadIcon.native(hInstance, iconName)
}

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export function LoadImage(hInstance: HINSTANCE | null, name: IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string, type: IMAGE_, cx: number, cy: number, load: LR_): HICON | null {
    LoadImage.native ??= user32.func('LoadImageW', cHANDLE, [cHANDLE, cSTR, cUINT, cINT, cINT, cUINT])
    return LoadImage.native(hInstance, name, type, cx, cy, load)
}

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export function MessageBox(hWnd: HWND | null, text: string | null, caption: string | null, type: MB_): number {
    MessageBox.native ??= user32.func('MessageBoxW', cINT, [ cHANDLE, cSTR, cSTR, cUINT ])
    return MessageBox.native(hWnd, text, caption, type)
}

/**
 * Creates, displays, and operates a message box.
 *
 * Currently `MessageBoxEx` and `MessageBox` work the same way.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxexw
 */
export function MessageBoxEx(hWnd: HWND | null, text: string | null, caption: string | null, type: MB_, languageId: number): number {
    MessageBoxEx.native ??= user32.func('MessageBoxExW', cINT, [ cHANDLE, cSTR, cSTR, cUINT, cWORD ])
    return MessageBoxEx.native(hWnd, text, caption, type, languageId)
}

/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export function PeekMessage(hWnd: HWND | null | -1, msgFilterMin: number, msgFilterMax: number, removeMsg: PM_): MSG | null {
    PeekMessage.native ??= user32.func('PeekMessageW', cBOOL, [ koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT, cUINT ])

    const pMsg: OUT<MSG> = [{} as MSG]
    if (PeekMessage.native(pMsg, hWnd, msgFilterMin, msgFilterMax, removeMsg) !== 0)
        return pMsg[0]
    return null
}

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export function PostQuitMessage(exitCode: number): void {
    PostQuitMessage.native ??= user32.func('PostQuitMessage', cVOID, [ cINT ])
    PostQuitMessage.native(exitCode)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(wndClass: WNDCLASS): ATOM {
    RegisterClass.native ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    if (typeof wndClass.lpfnWndProc === 'function') {
        wndClass = {
            ...wndClass,
            lpfnWndProc: koffi.register(wndClass.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClass.native(wndClass)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(wndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    if (typeof wndClassEx.lpfnWndProc === 'function') {
        wndClassEx = {
            ...wndClassEx,
            lpfnWndProc: koffi.register(wndClassEx.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClassEx.native(wndClassEx)
}

/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export function SendMessage(hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    SendMessage.native ??= user32.func('SendMessageW', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return SendMessage.native(hWnd, msg, wParam, lParam)
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
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export function TrackPopupMenu(hMenu: HMENU, flags: TPM_, x: number, y: number, hWnd: HWND, rect: RECT | null = null): boolean {
    TrackPopupMenu.native ??= user32.func('TrackPopupMenu', cBOOL, [ cHANDLE, cUINT, cUINT, cUINT, cUINT, cHANDLE, cRECT ])
    return TrackPopupMenu.native(hMenu, flags, x, y, 0, hWnd, rect) !== 0
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export function TranslateMessage(msg: MSG): boolean {
    TranslateMessage.native ??= user32.func('TranslateMessage', cBOOL, [ koffi.pointer(cMSG) ])
    return TranslateMessage.native(msg) !== 0
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export function TranslateMessageEx(msg: MSG, flags: number): boolean {
    TranslateMessageEx.native ??= user32.func('TranslateMessageEx', cBOOL, [ koffi.pointer(cMSG), cUINT ])
    return TranslateMessageEx.native(msg, flags) !== 0
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(className: ATOM | string, hInstance: HINSTANCE | null = null): boolean {
    UnregisterClass.native ??= user32.func('UnregisterClassW', cBOOL, [ cSTR, cHANDLE ])
    return UnregisterClass.native(className, hInstance) !== 0
}

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export function UpdateWindow(hWnd: HWND): boolean {
    UpdateWindow.native ??= user32.func('UpdateWindow', cBOOL, [ cHANDLE ])
    return UpdateWindow.native(hWnd) !== 0
}
