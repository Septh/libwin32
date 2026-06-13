import koffi from 'koffi'
import {
    Internals, StringOutputBuffer,
    cBOOL, cPVOID, cPDWORD
} from '../internals.js'
import { advapi32 } from './dll.js'

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPVOID, koffi.inout(cPDWORD) ])

    const name = new StringOutputBuffer(Internals.UNLEN + 1)
    return GetUserName.native(name.buffer, name.pLength) !== 0
        ? name.decode(name.length - 1)   // GetUserName() returned length includes the final \0
        : null
}

export * from './lsa/functions.js'
export * from './reg/functions.js'
export * from './security/functions.js'
export * from './sid/functions.js'
export * from './token/functions.js'
