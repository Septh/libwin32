import type { koffi } from '../private.js'
import {
    cBOOL, cLPCWSTR, cHANDLE,
    type HINSTANCE, type HICON
} from '../ctypes.js'
import type { IDI_ } from '../consts/IDI.js'
import { user32 } from './_lib.js'

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export function DestroyIcon(hIcon: HICON): boolean {
    DestroyIcon.fn ??= user32.func('DestroyIcon', cBOOL, [ cHANDLE ])
    return !!DestroyIcon.fn(hIcon)
}

/** @internal */
export declare namespace DestroyIcon {
    export var fn: koffi.KoffiFunc<(hIcon: HICON) => number>
}

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export function LoadIcon(hInstance: HINSTANCE | null, lpIconName: IDI_ | string): HICON | null {
    LoadIcon.fn ??= user32.func('LoadIconW', cHANDLE, [ cHANDLE, cLPCWSTR ])
    return LoadIcon.fn(hInstance, lpIconName)
}

/** @internal */
export declare namespace LoadIcon {
    export var fn: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpIconName: IDI_ | string) => HICON | null>
}
