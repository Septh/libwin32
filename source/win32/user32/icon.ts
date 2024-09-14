import { koffi } from '../../private.js'
import { user32 } from './_lib.js'
import {
    cBOOL, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { cHANDLE, type HANDLE } from '../../ctypes.js'

// #region Types

export const cHICON = koffi.alias('HICON', cHANDLE)
export type HICON = HANDLE<'HICON'>

// #endregion

// #region Functions

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export const DestroyIcon: koffi.KoffiFunc<(
    hIcon: HICON
) => number> = user32.lib.func('DestroyIcon', cBOOL, [ cHICON ])

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export const LoadIcon: koffi.KoffiFunc<(
    hInstance:  HINSTANCE | null,
    lpIconName: IDI | string
) => HICON> = user32.lib.func('LoadIconW', cHICON, [ cHINSTANCE, cLPCWSTR ])

// #endregion

// #region Constants

/**
 * IDI_xxx - Standard Icon IDs
 *
 * https://learn.microsoft.com/en-us/windows/win32/menurc/about-icons
 */
export const enum IDI {
    APPLICATION = 32512,
    ERROR       = 32513,
    QUESTION    = 32514,
    WARNING     = 32515,
    INFORMATION = 32516,
    WINLOGO     = 32517,
    SHIELD      = 32518,
}

// #endregion
