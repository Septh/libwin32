import { koffi, textDecoder } from '../private.js'
import { cBOOL, cDWORD, cHANDLE, cPDWORD, cPWSTR, type HANDLE, type OUT } from '../ctypes.js'
import type { PSAR_ } from '../consts/PSAR.js'
import { kernel32 } from './_lib.js'

/**
 *
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 *
 */
export function CloseHandle(hObject: HANDLE): number {
    CloseHandle.native ??= kernel32.func('CloseHandle', cBOOL, [ cHANDLE ])
    return CloseHandle.native(hObject)
}

/**
 * Retrieves a pseudo handle for the current process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocess
 */
export function GetCurrentProcess(): HANDLE {
    GetCurrentProcess.native ??= kernel32.func('GetCurrentProcess', cHANDLE, [])
    return GetCurrentProcess.native()
}

/**
 * Opens an existing local process object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
export function OpenProcess(dwDesiredAccess: PSAR_, bInheritHandle: boolean, dwProcessId: number): HANDLE | null {
    OpenProcess.native ??= kernel32.func('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])
    return OpenProcess.native(dwDesiredAccess, Number(bInheritHandle), dwProcessId)
}

/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
export function QueryFullProcessImageName(hProcess: HANDLE, dwFlags: number): string | null {
    QueryFullProcessImageName.native ??= kernel32.func('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, koffi.out(cPWSTR), koffi.inout(cPDWORD) ])

    const exeName = new Uint16Array(256)
    const dwSize: OUT<number> = [ exeName.length ]
    return QueryFullProcessImageName.native(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName.subarray(0, dwSize[0]))
}
