import { koffi, textDecoder, type INT_PTR } from '../private.js'
import { cBOOL, cDWORD, cHANDLE, cLPDWORD, cLPWSTR, type HANDLE } from '../ctypes.js'
import type { PSAR_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 *
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 *
 */
export function CloseHandle(hObject: HANDLE): number {
    CloseHandle.fn ??= kernel32.func('CloseHandle', cBOOL, [ cHANDLE ])
    return CloseHandle.fn(hObject)
}

/** @internal */
export declare namespace CloseHandle {
    export var fn: koffi.KoffiFunc<(hObject: HANDLE) => number>
}

/**
 * Retrieves a pseudo handle for the current process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocess
 */
export function GetCurrentProcess(): HANDLE {
    GetCurrentProcess.fn ??= kernel32.func('GetCurrentProcess', cHANDLE, [])
    return GetCurrentProcess.fn()
}

/** @internal */
export declare namespace GetCurrentProcess {
    export var fn: koffi.KoffiFunc<() => HANDLE>
}

/**
 * Opens an existing local process object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
export function OpenProcess(dwDesiredAccess: PSAR_ | number, bInheritHandle: boolean, dwProcessId: number): HANDLE | null {
    OpenProcess.fn ??= kernel32.func('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])
    return OpenProcess.fn(dwDesiredAccess, Number(bInheritHandle), dwProcessId)
}

/** @internal */
export declare namespace OpenProcess {
    export var fn: koffi.KoffiFunc<(dwDesiredAccess: PSAR_ | number, bInheritHandle: number, dwProcessId: number) => HANDLE>
}

/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
export function QueryFullProcessImageName(hProcess: HANDLE, dwFlags: number): string | null {
    QueryFullProcessImageName.fn ??= kernel32.func('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, koffi.out(cLPWSTR), koffi.inout(cLPDWORD) ])

    const exeName = new Uint16Array(256)
    const dwSize: INT_PTR = [ exeName.length ]
    return QueryFullProcessImageName.fn(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName.slice(0, dwSize[0]))
}

/** @internal */
export declare namespace QueryFullProcessImageName {
    export var fn: koffi.KoffiFunc<(hProcess: HANDLE, dwFlags: number, lpExeName: Uint16Array, lpdwSize: INT_PTR) => number>
}
