import { koffi } from '../../private.js'
import {
    ctypes,
    cHANDLE, cUINT, cHINSTANCE, cLPCWSTR, cINT_PTR,
    cWPARAM, cLPARAM, cLRESULT,
    type HINSTANCE, type HANDLE, type LPARAM, type WPARAM
} from '../../ctypes.js'
import { cHICON, type HICON } from './icon.js'
import { cHCURSOR, type HCURSOR } from './cursor.js'
import { cHBRUSH, type HBRUSH } from './brush.js'
import type { WM, CS } from './_consts.js'

export const cHWND = cHANDLE
export type HWND = HANDLE<'HWND'>

export const cWNDPROC = koffi.pointer('WNDPROC', koffi.proto('__wndproc', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ]))
export type WNDPROC = (hWnd: HWND, msg: WM, wParam: WPARAM, lParam: LPARAM) => number

export const cDLGPROC = koffi.pointer('DLGPROC', koffi.proto('__dlgproc', cINT_PTR, [ cHWND, cUINT, cWPARAM, cLPARAM ]))
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number

export const cWNDCLASS = koffi.struct('WNDCLASS', {
    style:          cUINT,
    lpfnWndProc:    cWNDPROC,
    cbClsExtra:     ctypes.int,
    cbWndExtra:     ctypes.int,
    hInstance:      cHINSTANCE,
    hIcon:          cHICON,
    hCursor:        cHCURSOR,
    hbrBackground:  cHBRUSH,
    lpszMenuName:   cLPCWSTR,
    lpszClassName:  cLPCWSTR
})

export const cLPWNDCLASS = koffi.pointer('LPWNDCLASS', cWNDCLASS)
export const cPWNDCLASS  = koffi.pointer('PWNDCLASS',  cWNDCLASS)

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS {
    style?:         CS
    lpfnWndProc?:   koffi.IKoffiRegisteredCallback
    cbClsExtra?:    number
    cbWndExtra?:    number
    hInstance?:     HINSTANCE
    hIcon?:         HICON
    hCursor?:       HCURSOR
    hbrBackground?: HBRUSH
    lpszMenuName?:  string
    lpszClassName?: string

    constructor(wndProc?: WNDPROC) {
        if (typeof wndProc === 'function')
            this.lpfnWndProc = koffi.register(wndProc, cWNDPROC)
    }

    // For use with `using` (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        if (this.lpfnWndProc) {
            koffi.unregister(this.lpfnWndProc)
        }
    }
}

export const cWNDCLASSEX = koffi.struct('WNDCLASSEX', {
    cbSize:         cUINT,
    style:          cUINT,
    lpfnWndProc:    cWNDPROC,
    cbClsExtra:     ctypes.int,
    cbWndExtra:     ctypes.int,
    hInstance:      cHINSTANCE,
    hIcon:          cHICON,
    hCursor:        cHCURSOR,
    hbrBackground:  cHBRUSH,
    lpszMenuName:   cLPCWSTR,
    lpszClassName:  cLPCWSTR,
    hIconSm:        cHICON
})

export const cLPWNDCLASSEX = koffi.pointer('LPWNDCLASSEX', cWNDCLASSEX)
export const cPWNDCLASSEX  = koffi.pointer('PWNDCLASSEX',  cWNDCLASSEX)

/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX {
    readonly cbSize = koffi.sizeof(cWNDCLASSEX)
    declare  style?:         CS
    declare  lpfnWndProc?:   koffi.IKoffiRegisteredCallback
    declare  cbClsExtra?:    number
    declare  cbWndExtra?:    number
    declare  hInstance?:     HINSTANCE
    declare  hIcon?:         HICON
    declare  hCursor?:       HCURSOR
    declare  hbrBackground?: HBRUSH
    declare  lpszMenuName?:  string
    declare  lpszClassName?: string
    declare  hIconSm?:       HICON

    constructor(wndProc?: WNDPROC) {
        if (typeof wndProc === 'function')
            this.lpfnWndProc = koffi.register(wndProc, cWNDPROC)
    }

    // For use with `using` (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        if (this.lpfnWndProc) {
            koffi.unregister(this.lpfnWndProc)
        }
    }
}
