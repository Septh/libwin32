import { koffi, textDecoder } from '../private.js'
import { cBOOL, cINT, cLPDWORD, cLPWSTR, type OUT } from '../ctypes.js'
import { UNLEN, type EXTENDED_NAME_FORMAT } from '../consts/EXTENDED_NAME_FORMAT.js'
import { secur32 } from './_lib.js'

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernameexw
 */
export function GetUserNameEx(NameFormat: EXTENDED_NAME_FORMAT): string | null {
    GetUserNameEx.native ??= secur32.func('GetUserNameExW', cBOOL, [ cINT, cLPWSTR, koffi.inout(cLPDWORD) ])

    const out = new Uint16Array(UNLEN)
    const len: OUT<number> = [ out.length ]
    return GetUserNameEx.native(NameFormat, out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0]))   // -GetUserNameEx() does *not* includes the final \0
}
