import {
    cINT, cUINT, cLPCWSTR, cHANDLE,
    type HINSTANCE, type HICON
} from '../ctypes.js'
import type { IDI_ } from '../consts/IDI.js'
import type { IDC_ } from '../consts/IDC.js'
import type { OIC_ } from '../consts/OIC.js'
import type { OCR_ } from '../consts/OCR.js'
import type { OBM_ } from '../consts/OBM.js'
import type { LR_ } from '../consts/LR.js'
import type { IMAGE_ } from '../consts/IMAGE.js'
import { user32 } from './_lib.js'

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export function LoadImage(hInstance: HINSTANCE | null, lpName: IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string, type: IMAGE_, cx: number, cy: number, fuLoad: LR_): HICON | null {
    LoadImage.native ??= user32.func('LoadImageW', cHANDLE, [cHANDLE, cLPCWSTR, cUINT, cINT, cINT, cUINT])
    return LoadImage.native(hInstance, lpName, type, cx, cy, fuLoad)
}
