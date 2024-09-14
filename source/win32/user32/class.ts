import { koffi } from '../../private.js'
import { user32 } from './_lib.js'
import {
    ctypes,
    cUINT, cLPCWSTR, cHINSTANCE, cATOM,
    type HINSTANCE
} from '../../ctypes.js'
import { cWNDPROC, type WNDPROC } from './window.js'
import { cHICON, type HICON } from './icon.js'
import { cHCURSOR, type HCURSOR } from './cursor.js'
import { cHBRUSH, type HBRUSH } from './brush.js'

// #region Types

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
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
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

// #endregion

// #region Functions

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClass: koffi.KoffiFunc<(
    lpWndClass: WNDCLASS
) => number> = user32.lib.func('RegisterClassW', cATOM, [ cWNDCLASS ])

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClassEx: koffi.KoffiFunc<(
    lpWndClassEx: WNDCLASSEX
) => number> = user32.lib.func('RegisterClassExW', cATOM, [ cWNDCLASSEX ])

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export const UnregisterClass: koffi.KoffiFunc<(
    lpClassName: string,
    hInstance:   HINSTANCE | null
) => number> = user32.lib.func('UnregisterClassW', cATOM, [ cLPCWSTR, cHINSTANCE ])

// #endregion

// #region Constants

/**
 * CS_xxx - Window Class styles
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-class-styles
 */
export const enum CS {
    NULL,
    BYTEALIGNCLIENT = 0x00001000,
    BYTEALIGNWINDOW = 0x00002000,
    CLASSDC         = 0x00000040,
    DBLCLKS         = 0x00000008,
    DROPSHADOW      = 0x00020000,
    GLOBALCLASS     = 0x00004000,
    HREDRAW         = 0x00000002,
    // IME             = 0x00010000,
    NOCLOSE         = 0x00000200,
    OWNDC           = 0x00000020,
    PARENTDC        = 0x00000080,
    SAVEBITS        = 0x00000800,
    VREDRAW         = 0x00000001,
}

// #endregion
