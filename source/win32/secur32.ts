import koffi from 'koffi-cream'
import { StringOutputBuffer, Internals } from './private.js'
import { cBOOL, cINT, cPDWORD, cSTR } from './ctypes.js'
import type { EXTENDED_NAME_FORMAT } from './consts.js'

/** @internal */
export const secur32 = koffi.load('secur32.dll')

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernameexw
 */
export function GetUserNameEx(nameFormat: EXTENDED_NAME_FORMAT): string | null {
    GetUserNameEx.native ??= secur32.func('GetUserNameExW', cBOOL, [ cINT, cSTR, koffi.inout(cPDWORD) ])

    const str = new StringOutputBuffer(Internals.UNLEN)
    return GetUserNameEx.native(nameFormat, str.buffer, str.pLength) !== 0 ? str.decode() : null
}
