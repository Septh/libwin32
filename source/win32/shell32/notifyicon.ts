import {
    pointer, out, textDecoder,
    struct, sizeof,
    register, unregister,
    type koffi
} from '../../private.js'
import {
    cBOOL, cDWORD, cUINT, cLPWSTR, cLPCWSTR,
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
    declare szTip?:          string
    declare dwState?:        number
    declare dwStateMask?:    number
    declare szInfo?:         string
    declare uVersion?:       number
    declare szInfoTitle?:    string
    declare dwInfoFlags?:    number
    declare guidItem?:       number
    declare hBalloonIcon?:   HICON
}

export const cNOTIFYICONDATA = struct('NOTIFYICONDATA', {
    cbSize:           cDWORD,
    hWnd:            cHWND,
    uID:             cUINT,
    uFlags:          cUINT,
    uCallbackMessage: cUINT,
    hIcon:           cHICON,
    szTip:           cLPWSTR,
    dwState:         cDWORD,
    dwStateMask:     cDWORD,
    szInfo:          cLPWSTR,
    uVersion:        cUINT,
    szInfoTitle:     cLPWSTR,
    dwInfoFlags:     cDWORD,
    guidItem:        cDWORD,
    hBalloonIcon:    cHICON
})

// #region Functions

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * @link https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export const Shell_NotifyIcon: koffi.KoffiFunc<(
    dwMessage: NIM_,
    lpData: NOTIFYICONDATA
) => boolean> = shell32('Shell_NotifyIconW', cBOOL, [ cDWORD, cNOTIFYICONDATA ])
