import { koffi } from '../private.js'
import {
    cDWORD, cUINT,
    cHANDLE, type HWND, type HICON,
} from '../ctypes.js'
import { cGUID, type GUID } from './GUID.js'
import type { NIF_ } from '../consts/NIF.js'

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

export const cNOTIFYICONDATA = koffi.struct('NOTIFYICONDATA', {
    cbSize:           cDWORD,
    hWnd:             cHANDLE,
    uID:              cUINT,
    uFlags:           cUINT,
    uCallbackMessage: cUINT,
    hIcon:            cHANDLE,
    szTip:            koffi.array(koffi.types.char16, 128, 'String'),     // Fixed size array. Koffi will automatically convert from string
    dwState:          cDWORD,
    dwStateMask:      cDWORD,
    szInfo:           koffi.array(koffi.types.char16, 256, 'String'),
    uVersion:         cUINT,    // Union field (can be uTimeout)
    szInfoTitle:      koffi.array(koffi.types.char16, 64, 'String'),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,    // Changed to GUID type
    hBalloonIcon:     cHANDLE
})
