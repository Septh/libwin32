import {
    cINT, cUINT, cLPCWSTR,
    cHWND, type HWND
} from '../../ctypes.js'
import type { MB_ } from '../consts.js'
import { user32 } from './_lib.js'

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export const MessageBox: (
    hWnd:      HWND | null,
    lpText:    string | null,
    lpCaption: string | null,
    uType:     MB_ | number
) => number = /*#__PURE__*/user32.func('MessageBoxW', cINT, [ cHWND, cLPCWSTR, cLPCWSTR, cUINT ])
