import { koffi, textDecoder } from '../private.js'
import {
    cBOOL, cINT, cUINT, cPWSTR,
    cHANDLE, cATOM, type ATOM,
    cWNDPROC, type WNDPROC,
    type HINSTANCE, type HWND, type HICON, type HCURSOR, type HBRUSH
} from '../ctypes.js'
import type { CS_ } from '../consts/CS.js'
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
    lpszMenuName:  cPWSTR,
    lpszClassName: cPWSTR
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
    lpszMenuName:  cPWSTR,
    lpszClassName: cPWSTR,
    hIconSm:       cHANDLE
})

/**
 * Retrieves information about a window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASS | null {
    GetClassInfo.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cPWSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])

    const lpWndClass = new WNDCLASS()
    return GetClassInfo.native(hInstance, lpClassName, lpWndClass) ? lpWndClass : null
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, lpClassName: ATOM | string): WNDCLASSEX | null {
    GetClassInfoEx.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cPWSTR, koffi.inout(koffi.pointer(cWNDCLASSEX)) ])

    const lpWndClassEx = new WNDCLASSEX()
    return GetClassInfoEx.native(hInstance, lpClassName, lpWndClassEx) ? lpWndClassEx : null
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string {
    GetClassName.native ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cPWSTR), cINT ])

    const out = new Uint16Array(128)
    const len = GetClassName.native(hWnd, out, out.length)
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(lpWndClass: WNDCLASS): ATOM {
    RegisterClass.native ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    if (typeof lpWndClass.lpfnWndProc === 'function') {
        lpWndClass = {
            ...lpWndClass,
            lpfnWndProc: koffi.register(lpWndClass.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClass.native(lpWndClass)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(lpWndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    if (typeof lpWndClassEx.lpfnWndProc === 'function') {
        lpWndClassEx = {
            ...lpWndClassEx,
            lpfnWndProc: koffi.register(lpWndClassEx.lpfnWndProc, cWNDPROC) as unknown as WNDPROC
        }
    }
    return RegisterClassEx.native(lpWndClassEx)
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(lpClassName: ATOM | string, hInstance?: HINSTANCE | null): boolean {
    UnregisterClass.native ??= user32.func('UnregisterClassW', cBOOL, [ cPWSTR, cHANDLE ])
    return !!UnregisterClass.native(lpClassName, hInstance ?? null)
}
