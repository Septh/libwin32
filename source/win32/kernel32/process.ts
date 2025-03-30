import { inout, koffi, out, textDecoder } from '../../private.js'
import { cBOOL, cDWORD, cHANDLE, cLPDWORD, cLPWSTR, HANDLE } from '../../ctypes.js'
import { kernel32 } from './_lib.js'

// #region Types


// #endregion

// #region Functions

/**
 * Opens a process and returns a handle to it.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
/*@__NO_SIDE_EFFECTS__*/
export function OpenProcess(  
    dwDesiredAccess: number,
    bInheritHandle: boolean,
    dwProcessId: number
): string | null {
    const flag = bInheritHandle ? 1 : 0
    return _OpenProcess(dwDesiredAccess, flag, dwProcessId)
}
const _OpenProcess = kernel32('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])

/**
 * Get full Image Name of Process
 * 
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
/*@__NO_SIDE_EFFECTS__*/
export function QueryFullProcessImageName(
    hProcess: string,
    dwFlags: number
): string | null {
    const exeName = new Uint16Array(256)
    const dwSize  = [ exeName.length ] as [ number ]
    return _QueryFullProcessImageName(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName).slice(0, dwSize[0])
}
const _QueryFullProcessImageName = kernel32('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, out(cLPWSTR), inout(cLPDWORD) ])

/**
 * 
 * Close handle to process
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 * 
 */
export const CloseHandle:koffi.KoffiFunc<(
    hObject: string
) => boolean> = kernel32('CloseHandle', cBOOL, [ cHANDLE ])

// #endregion