import {
    cBOOL, cLPCWSTR, cHANDLE,
    type HINSTANCE, type HCURSOR
} from '../ctypes.js'
import type { IDC_ } from '../consts.js'
import { user32 } from './_lib.js'
import type { koffi } from '../private.js'

/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export function DestroyCursor(hCursor: HCURSOR): boolean {
    DestroyCursor.fn ??= user32.func('DestroyCursor', cBOOL, [ cHANDLE ])
    return !!DestroyCursor.fn(hCursor)
}

/** @internal */
export declare namespace DestroyCursor {
    export var fn: koffi.KoffiFunc<(hCursor: HCURSOR) => number>
}

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export function LoadCursor(hInstance:  HINSTANCE | null, lpIconName: IDC_ | string): HCURSOR | null {
    LoadCursor.fn ??= user32.func('LoadCursorW', cHANDLE, [ cHANDLE, cLPCWSTR ])
    return LoadCursor.fn(hInstance, lpIconName)
}

/** @internal */
export declare namespace LoadCursor {
    export var fn: koffi.KoffiFunc<(hInstance:  HINSTANCE | null, lpIconName: IDC_ | string) => HCURSOR | null>
}
