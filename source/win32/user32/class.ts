import { koffi, textDecoder } from '../private.js'
import {
    cBOOL, cINT, cUINT, cLPWSTR, cLPCWSTR, cHANDLE,
    cATOM, type ATOM,
    cWNDPROC, type WNDPROC,
    type HINSTANCE, type HWND, type HICON, type HCURSOR, type HBRUSH } from '../ctypes.js'
import type { CS_ } from '../consts.js'
import { user32 } from './_lib.js'

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
    declare hInstance?:     HINSTANCE | null
    declare hIcon?:         HICON | null
    declare hCursor?:       HCURSOR | null
    declare hbrBackground?: HBRUSH | null
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
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cLPCWSTR,
    lpszClassName: cLPCWSTR
}), cPWNDCLASS = koffi.pointer(cWNDCLASS), cLPWNDCLASS = koffi.pointer(cWNDCLASS)

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
    declare  hInstance?:     HINSTANCE | null
    declare  hIcon?:         HICON | null
    declare  hCursor?:       HCURSOR | null
    declare  hbrBackground?: HBRUSH | null
    declare  lpszMenuName?:  string
    declare  lpszClassName?: string
    declare  hIconSm?:       HICON | null

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
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cLPCWSTR,
    lpszClassName: cLPCWSTR,
    hIconSm:       cHANDLE
}), cPWNDCLASSEX = koffi.pointer(cWNDCLASSEX), cLPWNDCLASSEX = koffi.pointer(cWNDCLASSEX)

/**
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, lpClassName: ATOM | string, lpWndClass: WNDCLASS): boolean {
    GetClassInfo.fn ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cLPCWSTR, koffi.out(cLPWNDCLASS) ])
    return !!GetClassInfo.fn(hInstance, lpClassName, lpWndClass)
}

/** @internal */
export declare namespace GetClassInfo {
    export var fn: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpClassName: ATOM | string, lpWndClass: WNDCLASS) => number>
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, lpClassName: ATOM | string, lpwcx: WNDCLASSEX): boolean {
    GetClassInfoEx.fn ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cLPCWSTR, koffi.inout(cLPWNDCLASSEX) ])
    return !!GetClassInfoEx.fn(hInstance, lpClassName, lpwcx)
}

/** @internal */
export declare namespace GetClassInfoEx {
    export var fn: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpClassName: ATOM | string, lpwcx: WNDCLASSEX) => number>
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string {
    GetClassName.fn ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cLPWSTR), cINT ])

    const out = new Uint16Array(128)
    const len = GetClassName.fn(hWnd, out, out.length)
    return textDecoder.decode(out.slice(0, len))
}

/** @internal */
export declare namespace GetClassName {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, lpClassName: Uint16Array, nMaxCount: number) => number>
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(lpWndClass: WNDCLASS): ATOM {
    RegisterClass.fn ??= user32.func('RegisterClassW', cATOM, [ cLPWNDCLASS ])
    return RegisterClass.fn(lpWndClass)
}

/** @internal */
export declare namespace RegisterClass {
    export var fn: koffi.KoffiFunc<(lpWndClass: WNDCLASS) => ATOM>
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(lpWndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.fn ??= user32.func('RegisterClassExW', cATOM, [ cLPWNDCLASSEX ])
    return RegisterClassEx.fn(lpWndClassEx)
}

/** @internal */
export declare namespace RegisterClassEx {
    export var fn: koffi.KoffiFunc<(lpWndClassEx: WNDCLASSEX) => ATOM>
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(lpClassName: string, hInstance?: HINSTANCE | null): boolean {
    UnregisterClass.fn ??= user32.func('UnregisterClassW', cATOM, [ cLPCWSTR, cHANDLE ])
    return !!UnregisterClass.fn(lpClassName, hInstance ?? null)
}

/** @internal */
export declare namespace UnregisterClass {
    export var fn: koffi.KoffiFunc<(lpClassName: string, hInstance: HINSTANCE | null) => number>
}
