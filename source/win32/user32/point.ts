import { koffi } from '../private.js'
import { cBOOL, cPOINT, type POINT } from '../ctypes.js'
import { user32 } from './_lib.js'

/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export function GetCursorPos(lpPoint: POINT): number {
    GetCursorPos.fn ??= user32.func('GetCursorPos', cBOOL, [ koffi.out(cPOINT) ])
    return GetCursorPos.fn(lpPoint)
}

/** @internal */
export declare namespace GetCursorPos {
    export var fn: koffi.KoffiFunc<(lpPoint: POINT) => number>
}
