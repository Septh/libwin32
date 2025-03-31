import {
    cINT, cUINT, cLPCWSTR, cHANDLE,
    type HINSTANCE, type HICON
} from '../ctypes.js'
import type { IDI_, IDC_, OIC_, OCR_, OBM_, LR_, IMAGE_ } from '../consts.js'
import { user32 } from './_lib.js'

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export const LoadImage: (
    hInstance: HINSTANCE | null,
    lpName:    IDC_ | IDI_ | OIC_ | OCR_ | OBM_ | string,
    type:      IMAGE_,
    cx:        number,
    cy:        number,
    fuLoad:    LR_
) => HICON = /*#__PURE__*/user32.func('LoadImageW', cHANDLE, [ cHANDLE, cLPCWSTR, cUINT, cINT, cINT, cUINT ])
