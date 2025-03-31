import { koffi } from '../../private.js'
import {
    cBOOL, cDWORD, cUINT,
    cGUID, GUID,
} from '../../ctypes.js'
import { cHWND, type HWND } from '../user32/window.js'
import { cHICON, type HICON } from '../user32/icon.js'
import { NIF_, NIM_ } from '../consts.js'
import { shell32 } from './_lib.js'

/**
 * Contains information that the system needs to display notifications in the notification area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-notifyicondataw
 */
export class NOTIFYICONDATA {
    readonly cbSize = koffi.sizeof(cNOTIFYICONDATA)
    declare hWnd:             HWND
    declare uID:              number
    declare uFlags:           NIF_
    declare uCallbackMessage: number
    declare hIcon:            HICON
    declare szTip?:           string
    declare dwState?:         number
    declare dwStateMask?:     number
    declare szInfo?:          string
    declare uTimeout?:        number                     // Union with uVersion
    declare uVersion?:        number                     // Union with uTimeout
    declare szInfoTitle?:     string
    declare dwInfoFlags?:     number
    declare guidItem?:        GUID                       // Changed from number to GUID
    declare hBalloonIcon?:    HICON | null
}

export const cNOTIFYICONDATA = koffi.struct({
    cbSize:           cDWORD,
    hWnd:             cHWND,
    uID:              cUINT,
    uFlags:           cUINT,
    uCallbackMessage: cUINT,
    hIcon:            cHICON,
    szTip:            koffi.array(koffi.types.char16, 128),     // Fixed size array. Koffi will automatically from string.
    dwState:          cDWORD,
    dwStateMask:      cDWORD,
    szInfo:           koffi.array(koffi.types.char16, 256),
    uVersion:         cUINT,                                    // Union field (can be uTimeout)
    szInfoTitle:      koffi.array(koffi.types.char16, 64),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,                                    // Changed to GUID type
    hBalloonIcon:     cHICON
})

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export const Shell_NotifyIcon: (
    dwMessage: NIM_ | number,
    data: NOTIFYICONDATA
) => number = /*#__PURE__*/shell32.func('Shell_NotifyIconW', cBOOL, [ cDWORD, cNOTIFYICONDATA ])
