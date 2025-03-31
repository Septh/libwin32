import { koffi, textDecoder } from '../../private.js'
import {
    cBOOL, cINT, cUINT, cLPWSTR, cLPCWSTR,
    cHINSTANCE, type HINSTANCE,
    cATOM, type ATOM
} from '../../ctypes.js'
import type { CS_ } from '../consts/CS.js'
import { user32 } from './_lib.js'
import { cHWND, cWNDPROC, type HWND, type WNDPROC } from './window.js'
import { cHICON, type HICON } from './icon.js'
import { cHCURSOR, type HCURSOR } from './cursor.js'
import { cHBRUSH, type HBRUSH } from './brush.js'

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS implements Disposable {
    declare style?:         CS_
    declare lpfnWndProc?:   koffi.IKoffiRegisteredCallback
    declare cbClsExtra?:    number
    declare cbWndExtra?:    number
    declare hInstance?:     HINSTANCE
    declare hIcon?:         HICON
    declare hCursor?:       HCURSOR
    declare hbrBackground?: HBRUSH
    declare lpszMenuName?:  string
    declare lpszClassName?: string

    constructor(wndProc?: WNDPROC) {
        if (typeof wndProc === 'function')
            this.lpfnWndProc = koffi.register(wndProc, cWNDPROC)
    }

    // For use with `using` (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        if (this.lpfnWndProc) {
            koffi.unregister(this.lpfnWndProc)
            this.lpfnWndProc = undefined
        }
    }
}

export const cWNDCLASS = koffi.struct({
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHINSTANCE,
    hIcon:         cHICON,
    hCursor:       cHCURSOR,
    hbrBackground: cHBRUSH,
    lpszMenuName:  cLPCWSTR,
    lpszClassName: cLPCWSTR
})

export const cLPWNDCLASS = koffi.pointer(cWNDCLASS)
export const cPWNDCLASS  = koffi.pointer(cWNDCLASS)

/**
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export const GetClassInfo: (
    hInstance: HINSTANCE | null,
    lpClassName: ATOM | string,
    lpWndClass: WNDCLASS
) => number = /*#__PURE__*/user32.func('GetClassInfoW', cBOOL, [ cHINSTANCE, cLPCWSTR, koffi.out(cLPWNDCLASS) ])



/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX implements Disposable {
    readonly cbSize = koffi.sizeof(cWNDCLASSEX)
    declare  style?:         CS_
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
            this.lpfnWndProc = undefined
        }
    }
}

export const cWNDCLASSEX = koffi.struct({
    cbSize:        cUINT,
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHINSTANCE,
    hIcon:         cHICON,
    hCursor:       cHCURSOR,
    hbrBackground: cHBRUSH,
    lpszMenuName:  cLPCWSTR,
    lpszClassName: cLPCWSTR,
    hIconSm:       cHICON
})

export const cLPWNDCLASSEX = koffi.pointer(cWNDCLASSEX)
export const cPWNDCLASSEX  = koffi.pointer(cWNDCLASSEX)

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export const GetClassInfoEx: (
    hInstance: HINSTANCE | null,
    lpClassName: ATOM | string,
    lpwcx: WNDCLASSEX
) => number = /*#__PURE__*/user32.func('GetClassInfoExW', cBOOL, [ cHINSTANCE, cLPCWSTR, koffi.inout(cLPWNDCLASSEX) ])



/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
/*#__NO_SIDE_EFFECTS__*/
export function GetClassName(hWnd: HWND): string | null {
    const out = new Uint16Array(256)
    const len = _GetClassNameW(hWnd, out, out.length)
    return len === 0
        ? null
        : textDecoder.decode(out).slice(0, len)
}

const _GetClassNameW: (
    hWnd: HWND,
    lpClassName: Uint16Array,
    nMaxCount: number
) => number = /*#__PURE__*/user32.func('GetClassNameW', cINT, [ cHWND, koffi.out(cLPWSTR), cINT ])



/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export const RegisterClass: (
    lpWndClass: WNDCLASS
) => ATOM = /*#__PURE__*/user32.func('RegisterClassW', cATOM, [ cWNDCLASS ])



/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClassEx: (
    lpWndClassEx: WNDCLASSEX
) => ATOM = /*#__PURE__*/user32.func('RegisterClassExW', cATOM, [ cWNDCLASSEX ])



/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export const UnregisterClass: (
    lpClassName: string,
    hInstance:   HINSTANCE | null
) => number = /*#__PURE__*/user32.func('UnregisterClassW', cATOM, [ cLPCWSTR, cHINSTANCE ])
