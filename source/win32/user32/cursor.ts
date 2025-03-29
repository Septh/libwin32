import { koffi } from '../../private.js'
import {
    cBOOL, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import type { HICON } from './icon.js'
import type { IDC_ } from '../consts/IDC.js'

// #region Types

export const cHCURSOR = koffi.pointer('HCURSOR', koffi.opaque())
export type HCURSOR = HICON

// #endregion

// #region Functions

/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export const DestroyCursor: (
    hCursor: HCURSOR
) => number = /*#__PURE__*/user32.func('DestroyCursor', cBOOL, [ cHCURSOR ])

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export const LoadCursor: (
    hInstance:  HINSTANCE | null,
    lpIconName: IDC_ | string
) => HCURSOR = /*#__PURE__*/user32.func('LoadCursorW', cHCURSOR, [ cHINSTANCE, cLPCWSTR ])
