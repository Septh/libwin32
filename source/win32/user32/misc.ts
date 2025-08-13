import koffi from 'koffi-cream'
import {
    cBOOL, cINT, cUINT, cWORD, cSTR,
    cHANDLE, type HINSTANCE, type HCURSOR, type HICON, type HMENU, type HWND
} from '../ctypes.js'
import {
    cPOINT, type POINT
} from '../structs.js'
import {
    type IDC_, type IDI_, type OIC_, type OCR_, type OBM_, type IMAGE_,
    type LR_, type MB_
} from '../consts.js'
import { user32 } from './lib.js'

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
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export function GetCursorPos(): POINT | null {
    GetCursorPos.native ??= user32.func('GetCursorPos', cBOOL, [ koffi.out(koffi.pointer(cPOINT)) ])

    const point = {} as POINT
    return GetCursorPos.native(point) !== 0
        ? point
        : null
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
 * Note: you may use the IDxxx constants from libwin32/consts to test the result.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export function MessageBox(hWnd: HWND | null, text: string | null, caption: string | null, type: MB_): number {
    MessageBox.native ??= user32.func('MessageBoxW', cINT, [ cHANDLE, cSTR, cSTR, cUINT ])
    return MessageBox.native(hWnd, text, caption, type)
}

/**
 * Creates, displays, and operates a message box. Currently `MessageBoxEx` and `MessageBox` work the same way.
 *
 * Note: you may use the IDxxx constants from libwin32/consts to test the result.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxexw
 */
export function MessageBoxEx(hWnd: HWND | null, text: string | null, caption: string | null, type: MB_, languageId: number): number {
    MessageBoxEx.native ??= user32.func('MessageBoxExW', cINT, [ cHANDLE, cSTR, cSTR, cUINT, cWORD ])
    return MessageBoxEx.native(hWnd, text, caption, type, languageId)
}
