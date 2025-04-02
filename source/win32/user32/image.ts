import {
    cINT, cUINT, cLPCWSTR, cHANDLE,
    type HINSTANCE, type HICON
} from '../ctypes.js'
import type { IDI_, IDC_, OIC_, OCR_, OBM_, LR_, IMAGE_ } from '../consts.js'
import { user32 } from './_lib.js'
import type { koffi } from '../private.js'

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export function LoadImage(hInstance: HINSTANCE | null, lpName: IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string, type: IMAGE_, cx: number, cy: number, fuLoad: LR_): HICON | null {
    LoadImage.fn ??= user32.func('LoadImageW', cHANDLE, [cHANDLE, cLPCWSTR, cUINT, cINT, cINT, cUINT])
    return LoadImage.fn(hInstance, lpName, type, cx, cy, fuLoad)
}

/** @internal */
export declare namespace LoadImage {
    export var fn: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpName: IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string, type: IMAGE_, cx: number, cy: number, fuLoad: LR_) => HICON | null>
}
