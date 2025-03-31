import { koffi } from '../../private.js'
import {
    cBOOL, cLPCWSTR,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import type { __HANDLE__ } from '../../ctypes.js'
import type { IDI_ } from '../consts/IDI.js'

export const cHICON = koffi.pointer('HICON', koffi.opaque())
export type HICON = __HANDLE__<'HICON'>

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export const DestroyIcon: (
    hIcon: HICON
) => number = /*#__PURE__*/user32.func('DestroyIcon', cBOOL, [ cHICON ])



/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export const LoadIcon: (
    hInstance:  HINSTANCE | null,
    lpIconName: IDI_ | string
) => HICON = /*#__PURE__*/user32.func('LoadIconW', cHICON, [ cHINSTANCE, cLPCWSTR ])
