import { opaque, pointer, type koffi } from '../../private.js'
import {
    cBOOL, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import type { HICON } from './icon.js'

// #region Types

export const cHCURSOR = pointer('HCURSOR', opaque())
export type HCURSOR = HICON

// #endregion

// #region Functions

/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export const DestroyCursor: koffi.KoffiFunc<(
    hCursor: HCURSOR
) => number> = user32('DestroyCursor', cBOOL, [ cHCURSOR ])

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export const LoadCursor: koffi.KoffiFunc<(
    hInstance:  HINSTANCE | null,
    lpIconName: IDC | string
) => HCURSOR> = user32('LoadCursorW', cHCURSOR, [ cHINSTANCE, cLPCWSTR ])

// #endregion

// #region Constants

/**
 * IDC_xxx - Standard Cursor IDs
 *
 * https://learn.microsoft.com/en-us/windows/win32/menurc/about-cursors
 */
export enum IDC {
    ARROW       = 32512,
    IBEAM       = 32513,
    WAIT        = 32514,
    CROSS       = 32515,
    UPARROW     = 32516,
    // SIZE        = 32640,
    // ICON        = 32641,
    SIZENWSE    = 32642,
    SIZENESW    = 32643,
    SIZEWE      = 32644,
    SIZENS      = 32645,
    SIZEALL     = 32646,
    NO          = 32648,
    HAND        = 32649,
    APPSTARTING = 32650,
    HELP        = 32651,
    PIN         = 32671,
    PERSON      = 32672,
}

// #endregion
