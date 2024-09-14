import { koffi } from '../../private.js'
import { user32 } from './_lib.js'
import {
    ctypes, cUINT, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { cHICON, type HICON, type IDI } from './icon.js'
import type { IDC } from './cursor.js'

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
) => HICON> = user32.lib.func('LoadImageW', cHICON, [ cHINSTANCE, cLPCWSTR, cUINT, ctypes.int, ctypes.int, cUINT ])

// #endregion

// #region Constants

/** Values for the `type` parameter of `LoadImage`. */
export const enum IMAGE {
    BITMAP      = 0,
    ICON        = 1,
    CURSOR      = 2,
    ENHMETAFILE = 3,
}

/** Values for the `fuLoad` parameter of `LoadImage`. */
export const enum LR {
    DEFAULTCOLOR     = 0x00000000,
    MONOCHROME       = 0x00000001,
    COLOR            = 0x00000002,
    COPYRETURNORG    = 0x00000004,
    COPYDELETEORG    = 0x00000008,
    LOADFROMFILE     = 0x00000010,
    LOADTRANSPARENT  = 0x00000020,
    DEFAULTSIZE      = 0x00000040,
    VGACOLOR         = 0x00000080,
    LOADMAP3DCOLORS  = 0x00001000,
    CREATEDIBSECTION = 0x00002000,
    COPYFROMRESOURCE = 0x00004000,
    SHARED           = 0x00008000,
}

/** OBM_xxx - OEM Resource Ordinal Numbers */
export const enum OBM {
    CLOSE       = 32754,
    UPARROW     = 32753,
    DNARROW     = 32752,
    RGARROW     = 32751,
    LFARROW     = 32750,
    REDUCE      = 32749,
    ZOOM        = 32748,
    RESTORE     = 32747,
    REDUCED     = 32746,
    ZOOMD       = 32745,
    RESTORED    = 32744,
    UPARROWD    = 32743,
    DNARROWD    = 32742,
    RGARROWD    = 32741,
    LFARROWD    = 32740,
    MNARROW     = 32739,
    COMBO       = 32738,
    UPARROWI    = 32737,
    DNARROWI    = 32736,
    RGARROWI    = 32735,
    LFARROWI    = 32734,
    OLD_CLOSE   = 32767,
    SIZE        = 32766,
    OLD_UPARROW = 32765,
    OLD_DNARROW = 32764,
    OLD_RGARROW = 32763,
    OLD_LFARROW = 32762,
    BTSIZE      = 32761,
    CHECK       = 32760,
    CHECKBOXES  = 32759,
    BTNCORNERS  = 32758,
    OLD_REDUCE  = 32757,
    OLD_ZOOM    = 32756,
    OLD_RESTORE = 32755,
}

/** OCR_xxx - OEM Resource Ordinal Numbers */
export const enum OCR {
    NORMAL      = 32512,
    IBEAM       = 32513,
    WAIT        = 32514,
    CROSS       = 32515,
    UP          = 32516,
    SIZE        = 32640,    /* OBSOLETE: use OCR_SIZEALL */
    ICON        = 32641,    /* OBSOLETE: use OCR_NORMAL */
    SIZENWSE    = 32642,
    SIZENESW    = 32643,
    SIZEWE      = 32644,
    SIZENS      = 32645,
    SIZEALL     = 32646,
    ICOCUR      = 32647,    /* OBSOLETE: use OIC_WINLOGO */
    NO          = 32648,
    HAND        = 32649,
    APPSTARTING = 32650,
}

/** OIC_xxx - OEM Resource Ordinal Numbers */
export const enum OIC {
    SAMPLE      = 32512,
    HAND        = 32513,
    QUES        = 32514,
    BANG        = 32515,
    NOTE        = 32516,
    WINLOGO     = 32517,
    WARNING     = BANG,
    ERROR       = HAND,
    INFORMATION = NOTE,
    SHIELD      = 32518,
}

// #endregion
