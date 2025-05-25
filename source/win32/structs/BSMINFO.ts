import { koffi } from '../private.js'
import {
    cUINT,
    cHANDLE, type HDESK, type HWND,
} from '../ctypes.js'
import { cLUID, type LUID } from './LUID.js'

/**
 * Contains information about a window that denied a request from `BroadcastSystemMessageEx`.
 */
export class BSMINFO {
    readonly cbSize = koffi.sizeof(cBSMINFO)
    declare hDesk: HDESK
    declare hWnd:  HWND
    declare luid:  LUID
}

export const cBSMINFO = koffi.struct('BSMINFO', {
    cbSize: cUINT,
    hdesk:  cHANDLE,
    hwnd:   cHANDLE,
    luid:   cLUID
})
