import koffi from 'koffi-cream'
import { StringOutputBuffer } from '../private.js'
import {
    cBOOL, cINT, cPVOID, cSTR,
    cATOM, type ATOM, cHANDLE, type HINSTANCE, type HWND
} from '../ctypes.js'
import {
    cWNDCLASS, type WNDCLASS,
    cWNDCLASSEX, WNDCLASSEX,
    cWNDPROC
} from '../structs.js'
import { user32 } from './lib.js'

const wndProcs = new Map<ATOM, koffi.IKoffiRegisteredCallback | undefined>()

/**
 * Retrieves information about a window class.
 *
 * Note: libwin32 only supports querying by class name (string).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfow
 */
export function GetClassInfo(hInstance: HINSTANCE | null, className: string): WNDCLASS | null {
    GetClassInfo.native ??= user32.func('GetClassInfoW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASS)) ])

    const wndClass = {} as WNDCLASS
    return GetClassInfo.native(hInstance, className, wndClass) !== 0 ? wndClass : null
}

/**
 * Retrieves information about a window class, including a handle to the small icon associated with the window class.
 *
 * Note: libwin32 only supports querying by class name (string).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassinfoexw
 */
export function GetClassInfoEx(hInstance: HINSTANCE | null, className: string): WNDCLASSEX | null {
    GetClassInfoEx.native ??= user32.func('GetClassInfoExW', cBOOL, [ cHANDLE, cSTR, koffi.out(koffi.pointer(cWNDCLASSEX)) ])

    const wndClassEx = new WNDCLASSEX()
    return GetClassInfoEx.native(hInstance, className, wndClassEx) !== 0 ? wndClassEx : null
}

/**
 * Retrieves the name of the class to which the specified window belongs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getclassnamew
 */
export function GetClassName(hWnd: HWND): string | null {
    GetClassName.native ??= user32.func('GetClassNameW', cINT, [ cHANDLE, koffi.out(cPVOID), cINT ])

    const className = new StringOutputBuffer(256)
    const len = GetClassName.native(hWnd, className.buffer, className.length)
    return len ? className.decode(len) : null
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindow function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassw
 */
export function RegisterClass(wndClass: WNDCLASS): ATOM | null {
    RegisterClass.native ??= user32.func('RegisterClassW', cATOM, [ koffi.pointer(cWNDCLASS) ])

    let wndProc: koffi.IKoffiRegisteredCallback | undefined
    if (typeof wndClass.lpfnWndProc === 'function') {
        wndProc = koffi.register(wndClass.lpfnWndProc, cWNDPROC)
        wndClass = {
            ...wndClass,
            lpfnWndProc: wndProc as any
        }
    }

    const atom = RegisterClass.native(wndClass)
    return atom
        ? (wndProcs.set(atom, wndProc), atom)
        : (wndProc && koffi.unregister(wndProc), null)
}

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export function RegisterClassEx(wndClassEx: WNDCLASSEX): ATOM | null {
    RegisterClassEx.native ??= user32.func('RegisterClassExW', cATOM, [ koffi.pointer(cWNDCLASSEX) ])

    let wndProc: koffi.IKoffiRegisteredCallback | undefined
    if (typeof wndClassEx.lpfnWndProc === 'function') {
        wndProc = koffi.register(wndClassEx.lpfnWndProc, cWNDPROC)
        wndClassEx = {
            ...wndClassEx,
            lpfnWndProc: wndProc as any
        }
    }

    const atom = RegisterClassEx.native(wndClassEx)
    return atom
        ? (wndProcs.set(atom, wndProc), atom)
        : (wndProc && koffi.unregister(wndProc), null)
}

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * Note: despite the parameter being named `className`, as in the native API,
 *       libwin32 only supports unregistering by ATOM -- the one you received
 *       from RegisterClass/RegisterClassEx.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export function UnregisterClass(className: ATOM, hInstance: HINSTANCE | null = null): boolean {
    UnregisterClass.native ??= user32.func('UnregisterClassW', cBOOL, [ cATOM, cHANDLE ])

    const ret = UnregisterClass.native(className, hInstance) !== 0
    if (ret) {
        const wndProc = wndProcs.get(className)
        if (wndProc) {
            koffi.unregister(wndProc)
            wndProcs.delete(className)
        }
    }
    return ret
}
