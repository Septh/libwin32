import { koffi } from '../../private.js'
import {
    cUINT, cINT_PTR,
    cWPARAM, cLPARAM,
    type LPARAM, type WPARAM
} from '../../ctypes.js'
import { cHWND, type HWND } from './window.js'

export const cDLGPROC = koffi.pointer(koffi.proto('__dlgproc', cINT_PTR, [ cHWND, cUINT, cWPARAM, cLPARAM ]))
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number
