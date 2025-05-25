import { koffi } from '../private.js'
import {
    cUINT, cDWORD,
    cHANDLE, type HWND,
    cWPARAM, type WPARAM,
    cLPARAM, type LPARAM,
} from '../ctypes.js'
import { cPOINT, type POINT } from './POINT.js'

/**
 * Contains message information from a thread's message queue.
 */
export interface MSG {
    HWND:     HWND
    message:  number
    wParam:   WPARAM
    lParam:   LPARAM
    time:     number
    pt:       POINT
    lPrivate: number
}

export const cMSG = koffi.struct('MSG', {
    HWND:     cHANDLE,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})
