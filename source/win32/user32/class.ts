import koffi from 'koffi-cream'
import { StringOutputBuffer } from '../private.js'
import {
    cBOOL, cINT, cPVOID, cSTR,
    cATOM, type ATOM, cHANDLE, type HINSTANCE, type HWND
} from '../ctypes.js'
import {
    cWNDCLASS, WNDCLASS,
    cWNDCLASSEX, WNDCLASSEX
} from '../structs.js'
import { user32, registerCallback, unregisterCallback } from './lib.js'

/**
 * Retrieves information about a window class.
 *
 * FIXME: at the moment, libwin32 does not support passing an ATOM for `className`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, className: string): WNDCLASS | null {
    const wndClass = new WNDCLASS()
    return typeof className === 'number' ? GetClassInfo_ATOM() : GetClassInfo_String()

    function GetClassInfo_ATOM() {
        GetClassInfo_ATOM.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cATOM, koffi.out(koffi.pointer(cWNDCLASS)) ])
        return GetClassInfo_ATOM.native(hInstance, className, wndClass) !== 0 ? wndClass : null
    }

    function GetClassInfo_String() {
        GetClassInfo_String.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])
        return GetClassInfo_String.native(hInstance, className, wndClass) !== 0 ? wndClass : null
    }
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * FIXME: at the moment, libwin32 does not support passing an ATOM for `className`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, className: string): WNDCLASSEX | null {
    const wndClassEx = new WNDCLASSEX()
    return typeof className === 'number' ? GetClassInfoEx_ATOM() : GetClassInfoEx_String()

    function GetClassInfoEx_ATOM() {
        GetClassInfoEx_ATOM.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cATOM, koffi.out(koffi.pointer(cWNDCLASSEX)) ])
        return GetClassInfoEx_ATOM.native(hInstance, className, wndClassEx) !== 0 ? wndClassEx : null
    }

    function GetClassInfoEx_String() {
        GetClassInfoEx_String.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASSEX)) ])
        return GetClassInfoEx_String.native(hInstance, className, wndClassEx) !== 0 ? wndClassEx : null
    }
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string {
    GetClassName.native ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cPVOID), cINT ])

    const className = new StringOutputBuffer(256)
    const len = GetClassName.native(hWnd, className.buffer, className.length)
    return className.decode(len)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(wndClass: WNDCLASS): ATOM {
    RegisterClass.native ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    if (typeof wndClass.lpfnWndProc === 'function' && typeof wndClass.lpszClassName === 'string') {
        const cb = registerCallback(wndClass.lpszClassName, wndClass.lpfnWndProc)
        wndClass = {
            ...wndClass,
            lpfnWndProc: cb as any
        }
    }
    else wndClass.lpfnWndProc = null
    return RegisterClass.native(wndClass)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(wndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    if (typeof wndClassEx.lpfnWndProc === 'function' && typeof wndClassEx.lpszClassName === 'string') {
        const cb = registerCallback(wndClassEx.lpszClassName, wndClassEx.lpfnWndProc)
        wndClassEx = {
            ...wndClassEx,
            lpfnWndProc: cb as any
        }
    }
    else wndClassEx.lpfnWndProc = null
    return RegisterClassEx.native(wndClassEx)
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(className: ATOM | string, hInstance: HINSTANCE | null = null): boolean {
    return typeof className === 'number' ? UnregisterClass_ATOM() : UnregisterClass_String()

    function UnregisterClass_ATOM() {
        UnregisterClass_ATOM.native ??= user32.func('UnregisterClassW', cBOOL, [ cATOM, cHANDLE ])

        const wc = GetClassInfoEx(hInstance, className as string)
        if (wc)
            unregisterCallback(wc.lpszClassName ?? '')
        return UnregisterClass_ATOM.native(className, hInstance) !== 0
    }

    function UnregisterClass_String() {
        UnregisterClass_String.native ??= user32.func('UnregisterClassW', cBOOL, [ cSTR, cHANDLE ])

        unregisterCallback(className as string)
        return UnregisterClass_String.native(className, hInstance) !== 0
    }
}
