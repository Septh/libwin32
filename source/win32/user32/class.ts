import koffi from 'koffi-cream'
import { StringOutputBuffer } from '../private.js'
import {
    cBOOL, cINT, cPVOID, cSTR,
    cATOM, type ATOM, cHANDLE, type HINSTANCE, type HWND
} from '../ctypes.js'
import {
    cWNDCLASS, WNDCLASS,
    cWNDCLASSEX, WNDCLASSEX,
    cWNDPROC
} from '../structs.js'
import { user32 } from './lib.js'

const wndProcs = new Map<string | ATOM, koffi.IKoffiRegisteredCallback>()

/**
 * Retrieves information about a window class.
 *
 * FIXME: at the moment, libwin32 does not support passing an ATOM for `className`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, className: string): WNDCLASS | null {
    const wndClass = new WNDCLASS()
    return typeof className === 'number' ? info_by_atom() : info_by_string()

    function info_by_atom() {
        info_by_atom.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cATOM, koffi.out(koffi.pointer(cWNDCLASS)) ])
        return info_by_atom.native(hInstance, className, wndClass) !== 0 ? wndClass : null
    }

    function info_by_string() {
        info_by_string.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])
        return info_by_string.native(hInstance, className, wndClass) !== 0 ? wndClass : null
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
    return typeof className === 'number' ? info_by_atom() : info_by_string()

    function info_by_atom() {
        info_by_atom.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cATOM, koffi.out(koffi.pointer(cWNDCLASSEX)) ])
        return info_by_atom.native(hInstance, className, wndClassEx) !== 0 ? wndClassEx : null
    }

    function info_by_string() {
        info_by_string.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASSEX)) ])
        return info_by_string.native(hInstance, className, wndClassEx) !== 0 ? wndClassEx : null
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

    let wndProc: koffi.IKoffiRegisteredCallback | undefined = undefined
    if (typeof wndClass.lpfnWndProc === 'function') {
        wndProc = koffi.register(wndClass.lpfnWndProc, cWNDPROC)
        wndClass = {
            ...wndClass,
            lpfnWndProc: wndProc as any
        }
    }

    const atom = RegisterClass.native(wndClass)
    if (atom && wndProc) {
        wndProcs.set(atom, wndProc)
        if (wndClass.lpszClassName)
            wndProcs.set(wndClass.lpszClassName, wndProc)
    }
    else if (wndProc)
        koffi.unregister(wndProc)

    return atom
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(wndClassEx: WNDCLASSEX): ATOM {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    let wndProc: koffi.IKoffiRegisteredCallback | undefined = undefined
    if (typeof wndClassEx.lpfnWndProc === 'function') {
        wndProc = koffi.register(wndClassEx.lpfnWndProc, cWNDPROC)
        wndClassEx = {
            ...wndClassEx,
            lpfnWndProc: wndProc as any
        }
    }

    const atom = RegisterClassEx.native(wndClassEx)
    if (atom && wndProc) {
        wndProcs.set(atom, wndProc)
        if (wndClassEx.lpszClassName)
            wndProcs.set(wndClassEx.lpszClassName, wndProc)
    }
    else if (wndProc)
        koffi.unregister(wndProc)

    return atom
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(className: ATOM | string, hInstance: HINSTANCE | null = null): boolean {
    const wndProc = wndProcs.get(className)
    const ret = typeof className === 'number' ? unregister_by_atom() : unregister_by_string()
    if (wndProc) {
        koffi.unregister(wndProc)
        wndProcs.forEach((v, k) => v === wndProc && wndProcs.delete(k))
    }
    return ret

    function unregister_by_atom() {
        unregister_by_atom.native ??= user32.func('UnregisterClassW', cBOOL, [ cATOM, cHANDLE ])
        return unregister_by_atom.native(className, hInstance) !== 0
    }

    function unregister_by_string() {
        unregister_by_string.native ??= user32.func('UnregisterClassW', cBOOL, [ cSTR, cHANDLE ])
        return unregister_by_string.native(className, hInstance) !== 0
    }
}
