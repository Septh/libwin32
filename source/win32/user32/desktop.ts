import { koffi } from '../../private.js'
import { cBOOL, cLPARAM, LPARAM, type HANDLE } from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cWNDENUMPROC, type WNDENUMPROC } from './window.js'


// #region Types

export const cHDESK = koffi.pointer('HDESK', koffi.opaque())
export type HDESK = HANDLE<'HDESK'>

// #endregion

// #region Functions

/**
 * Enumerates all top-level windows on the screen by passing the handle to each window, in turn, to an application-defined callback function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-enumwindows
 */
export const EnumDesktopWindows: koffi.KoffiFunc<(
    lpEnumFunc: WNDENUMPROC,
    lpParam: LPARAM
) => number> = user32('EnumWindows', cBOOL, [ cWNDENUMPROC, cLPARAM ])

// #endregion
