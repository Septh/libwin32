import {
    struct, sizeof, array,
    type koffi
} from '../../private.js'
import {
    cBOOL, cDWORD, cUINT, 
    cGUID, GUID,
} from '../../ctypes.js'
import { shell32 } from './_lib.js'
import { cHWND, type HWND } from '../user32/window.js'
import { cHICON, type HICON } from '../user32/icon.js'
import { NIF_, NIM_ } from '../consts.js'

// #region Types

/**
 * Contains information that the system needs to display notifications in the notification area.
 *
 * @link https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-notifyicondataw
 */
export class NOTIFYICONDATA {
    readonly cbSize = sizeof(cNOTIFYICONDATA)
    declare hWnd:             HWND
    declare uID:              number
    declare uFlags:           NIF_
    declare uCallbackMessage: number
    declare hIcon:            HICON
    declare szTip?:          string | Uint16Array       // 128 chars
    declare dwState?:        number
    declare dwStateMask?:    number
    declare szInfo?:         string | Uint16Array       // 256 chars
    declare uTimeout?:       number                     // Union with uVersion
    declare uVersion?:       number                     // Union with uTimeout
    declare szInfoTitle?:    string | Uint16Array       // 64 chars
    declare dwInfoFlags?:    number
    declare guidItem?:       GUID                       // Changed from number to GUID
    declare hBalloonIcon?:   HICON | null
}

export const cNOTIFYICONDATA = struct('NOTIFYICONDATA', {
    cbSize:           cDWORD,
    hWnd:            cHWND,
    uID:             cUINT,
    uFlags:          cUINT,
    uCallbackMessage: cUINT,
    hIcon:           cHICON,
    szTip:           array('char16', 128),    // Fixed size array
    dwState:         cDWORD,
    dwStateMask:     cDWORD,
    szInfo:          array('char16', 256),    // Fixed size array
    uVersion:        cUINT,                             // Union field (can be uTimeout)
    szInfoTitle:     array('char16', 64),     // Fixed size array
    dwInfoFlags:     cDWORD,
    guidItem:        cGUID,                             // Changed to GUID type
    hBalloonIcon:    cHICON
})

// #region Functions

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * @link https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export function Shell_NotifyIcon(dwMessage: NIM_, lpData: NOTIFYICONDATA): boolean {
    // Convert strings to UTF-16 arrays if present
    const data = { ...lpData }
    if (typeof data.szTip === "string") {
        const tip = new Uint16Array(128) // Maximum length for tooltip
        const encoder = new TextEncoder()
        const bytes = encoder.encode(data.szTip)
        tip.set(bytes)
        data.szTip = tip
    }
    if (typeof data.szInfo === "string") {
        const info = new Uint16Array(256) // Maximum length for balloon text
        const encoder = new TextEncoder()
        const bytes = encoder.encode(data.szInfo)
        info.set(bytes)
        data.szInfo = info
    }
    if (typeof data.szInfoTitle === "string") {
        const title = new Uint16Array(64) // Maximum length for balloon title
        const encoder = new TextEncoder()
        const bytes = encoder.encode(data.szInfoTitle)
        title.set(bytes)
        data.szInfoTitle = title
    }
    return _Shell_NotifyIcon(dwMessage, data)
}

const _Shell_NotifyIcon: koffi.KoffiFunc<(
    dwMessage: NIM_,
    lpData: NOTIFYICONDATA
) => boolean> = shell32('Shell_NotifyIconW', cBOOL, [ cDWORD, cNOTIFYICONDATA ])
