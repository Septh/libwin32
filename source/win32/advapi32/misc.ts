import { koffi, textDecoder } from '../private.js'
import { cBOOL, cPDWORD, cPWSTR, type OUT } from '../ctypes.js'
import { UNLEN } from '../consts/EXTENDED_NAME_FORMAT.js'
import { advapi32 } from './_lib.js'

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPWSTR, koffi.inout(cPDWORD) ])

    const out = new Uint16Array(UNLEN + 1)
    const len: OUT<number> = [ out.length ]
    return GetUserName.native(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0] - 1))   // -1 because GetUserName() includes the final \0
}
