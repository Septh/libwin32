import { opaque, pointer, type koffi } from '../../private.js'
import {
    cBOOL, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import type { HANDLE } from '../../ctypes.js'
import type { IDI } from '../consts/IDI.js'

// #region Types

export const cHICON = pointer('HICON', opaque())
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
) => number> = user32('DestroyIcon', cBOOL, [ cHICON ])

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export const LoadIcon: koffi.KoffiFunc<(
    hInstance:  HINSTANCE | null,
    lpIconName: IDI | string
) => HICON> = user32('LoadIconW', cHICON, [ cHINSTANCE, cLPCWSTR ])
