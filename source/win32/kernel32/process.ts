import { koffi, textDecoder } from '../../private.js'
import { cBOOL, cDWORD, cHANDLE, cLPDWORD, cLPWSTR, type HANDLE } from '../../ctypes.js'
import type { PSAR_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 *
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 *
 */
export const CloseHandle: (
    hObject: HANDLE
) => number = /*#__PURE__*/kernel32.func('CloseHandle', cBOOL, [ cHANDLE ])


/**
 * Opens an existing local process object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
/*@__NO_SIDE_EFFECTS__*/
export function OpenProcess(
    dwDesiredAccess: PSAR_ | number,
    bInheritHandle: boolean,
    dwProcessId: number
): HANDLE | null {
    return _OpenProcess(dwDesiredAccess, Number(bInheritHandle), dwProcessId)
}

const _OpenProcess: (
    dwDesiredAccess: PSAR_ | number,
    bInheritHandle: number,
    dwProcessId: number
) => HANDLE = /*#__PURE__*/kernel32.func('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])


/**
 * Retrieves a pseudo handle for the current process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocess
 */
export const GetCurrentProcess: () => HANDLE = /*#__PURE__*/kernel32.func('GetCurrentProcess', cHANDLE, [])


/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
/*#__NO_SIDE_EFFECTS__*/
export function QueryFullProcessImageName(
    hProcess: HANDLE,
    dwFlags: number
): string | null {
    const exeName = new Uint16Array(256)
    const dwSize: [ number ]  = [ exeName.length ]
    return _QueryFullProcessImageNameW(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName.slice(0, dwSize[0]))
}

const _QueryFullProcessImageNameW: (
    hProcess: HANDLE,
    dwFlags: number,
    lpExeName: Uint16Array,
    lpdwSize: [ number ]
) => number = /*#__PURE__*/kernel32.func('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, koffi.out(cLPWSTR), koffi.inout(cLPDWORD) ])
