import type { koffi } from '../../private.js'
import {
    cINT, cUINT, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHICON, type HICON } from './icon.js'
import type { IDI } from '../consts/IDI.js'
import type { IDC } from '../consts/IDC.js'
import type { OIC } from '../consts/OIC.js'
import type { OCR } from '../consts/OCR.js'
import type { OBM } from '../consts/OBM.js'
import type { LR } from '../consts/LR.js'
import type { IMAGE } from '../consts/IMAGE.js'

// #region Types
// #endregion

// #region Functions

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export const LoadImage: koffi.KoffiFunc<(
    hInstance: HINSTANCE | null,
    lpName:    IDC | IDI | OIC | OCR | OBM | string,
    type:      IMAGE,
    cx:        number,
    cy:        number,
    fuLoad:    LR
) => HICON> = user32('LoadImageW', cHICON, [ cHINSTANCE, cLPCWSTR, cUINT, cINT, cINT, cUINT ])
