import { koffi } from '../../private.js'
import { user32 } from './_lib.js'
import {
    ctypes,
    cLPVOID, cBOOL, cINT, cUINT, cDWORD, cLPCWSTR,
    cHANDLE, cHINSTANCE, cINT_PTR,
    cWPARAM, cLPARAM, cLRESULT,
    type HINSTANCE, type HANDLE, type LPARAM, type WPARAM
} from '../../ctypes.js'
import { cHWND, type HWND } from './window.js'

// #region Types

export const cDLGPROC = koffi.pointer('DLGPROC', koffi.proto('__dlgproc', cINT_PTR, [ cHWND, cUINT, cWPARAM, cLPARAM ]))
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number

// #endregion

// #region Functions
// TODO
// #endregion

// #region Constants
// TODO
// #endregion
