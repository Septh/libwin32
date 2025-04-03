import { koffi, textDecoder } from '../private.js'
import {
    cBOOL, cINT, cUINT, cLPWSTR, cLPCWSTR,
    cHANDLE, cATOM, type ATOM,
    cWNDPROC, type WNDPROC,
    type HINSTANCE, type HWND, type HICON, type HCURSOR, type HBRUSH
} from '../ctypes.js'
import type { CS_ } from '../consts.js'
import { user32 } from './_lib.js'

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS {
    style:         CS_              = 0
    lpfnWndProc:   WNDPROC | null   = null
    cbClsExtra:    number           = 0
    cbWndExtra:    number           = 0
    hInstance:     HINSTANCE | null = null
    hIcon:         HICON | null     = null
    hCursor:       HCURSOR | null   = null
    hbrBackground: HBRUSH | null    = null
    lpszMenuName:  string           = ''
    lpszClassName: string           = ''
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
})

/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX {
    readonly cbSize = koffi.sizeof(cWNDCLASSEX)
    style:         CS_              = 0
    lpfnWndProc:   WNDPROC | null   = null
    cbClsExtra:    number           = 0
    cbWndExtra:    number           = 0
    hInstance:     HINSTANCE | null = null
    hIcon:         HICON | null     = null
    hCursor:       HCURSOR | null   = null
    hbrBackground: HBRUSH | null    = null
    lpszMenuName:  string           = ''
    lpszClassName: string           = ''
    hIconSm:       HICON | null     = null
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
})

/**
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASS | null {
    GetClassInfo.fn ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cLPCWSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])

    const lpWndClass = new WNDCLASS()
    return GetClassInfo.fn(hInstance, lpClassName, lpWndClass) ? lpWndClass : null
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
export function GetClassInfoEx(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASSEX | null {
    GetClassInfoEx.fn ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cLPCWSTR, koffi.inout(koffi.pointer(cWNDCLASSEX)) ])

    const lpWndClassEx = new WNDCLASSEX()
    return GetClassInfoEx.fn(hInstance, lpClassName, lpWndClassEx) ? lpWndClassEx : null
}

/** @internal */
export declare namespace GetClassInfoEx {
    export var fn: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpClassName: ATOM | string, lpWndClassEx: WNDCLASSEX) => number>
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
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(lpWndClass: WNDCLASS): ATOM {
    RegisterClass.fn ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    if (typeof lpWndClass.lpfnWndProc === 'function') {
        lpWndClass = {
            ...lpWndClass,
            lpfnWndProc: koffi.register(lpWndClass.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
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
    RegisterClassEx.fn ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    if (typeof lpWndClassEx.lpfnWndProc === 'function') {
        lpWndClassEx = {
            ...lpWndClassEx,
            lpfnWndProc: koffi.register(lpWndClassEx.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
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
export function UnregisterClass(lpClassName: ATOM | string, hInstance?: HINSTANCE | null): boolean {
    UnregisterClass.fn ??= user32.func('UnregisterClassW', cBOOL, [ cLPCWSTR, cHANDLE ])
    return !!UnregisterClass.fn(lpClassName, hInstance ?? null)
}

/** @internal */
export declare namespace UnregisterClass {
    export var fn: koffi.KoffiFunc<(lpClassName: ATOM | string, hInstance: HINSTANCE | null) => number>
}
