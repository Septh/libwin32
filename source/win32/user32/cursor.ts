import { koffi } from '../private.js'
import {
    cBOOL, cLPCWSTR, cHANDLE,
    cPOINT, type POINT,
    type HINSTANCE, type HCURSOR
} from '../ctypes.js'
import type { IDC_ } from '../consts/IDC.js'
import { user32 } from './_lib.js'

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
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export function GetCursorPos(lpPoint: POINT): number {
    GetCursorPos.native ??= user32.func('GetCursorPos', cBOOL, [ koffi.out(cPOINT) ])
    return GetCursorPos.native(lpPoint)
}

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export function LoadCursor(hInstance:  HINSTANCE | null, lpIconName: IDC_ | string): HCURSOR | null {
    LoadCursor.native ??= user32.func('LoadCursorW', cHANDLE, [ cHANDLE, cLPCWSTR ])
    return LoadCursor.native(hInstance, lpIconName)
}
