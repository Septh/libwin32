import { koffi } from '../../private.js'
import { cDWORD, cLPARAM, cUINT, cWPARAM } from '../../ctypes.js'
import { cHWND, type HWND } from './window.js'
import { cPOINT, type POINT } from './point.js'

export const cMSG = koffi.struct('MSG', {
    HWND:     cHWND,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

export const cLPMSG = koffi.pointer('LPMSG', cMSG)
export const cPMSG  = koffi.pointer('PMSG',  cMSG)

export interface MSG {
    HWND:    HWND
    message: number
    wParam:  number
    lParam:  number
    time:    number
    pt:      POINT
}
