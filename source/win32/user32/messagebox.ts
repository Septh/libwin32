import type { koffi } from '../../private.js'
import { cINT, cUINT, cLPCWSTR } from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHWND, type HWND } from './window.js'
import type { MB } from '../consts/MB.js'

// #region Types
// #endregion

// #region Functions

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export const MessageBox: koffi.KoffiFunc<(
    hWnd:      HWND | null,
    lpText:    string | null,
    lpCaption: string | null,
    uType:     MB | number
) => number> = user32('MessageBoxW', cINT, [ cHWND, cLPCWSTR, cLPCWSTR, cUINT ])
