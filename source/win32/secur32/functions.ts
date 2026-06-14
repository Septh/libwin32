import koffi from 'koffi'
import {
    StringOutputBuffer, Internals,
    cBOOL, cINT, cP_DWORD, cWSTR
} from '../internals.js'
import type { EXTENDED_NAME_FORMAT } from '../consts.js'

const secur32 = koffi.load('secur32.dll')

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/secext/nf-secext-getusernameexw
 */
export function GetUserNameEx(nameFormat: EXTENDED_NAME_FORMAT): string | null {
    GetUserNameEx.native ??= secur32.func('GetUserNameExW', cBOOL, [ cINT, cWSTR, koffi.inout(cP_DWORD) ])

    const str = new StringOutputBuffer(Internals.UNLEN)
    return GetUserNameEx.native(nameFormat, str.buffer, str.pLength) !== 0 ? str.decode() : null
}
