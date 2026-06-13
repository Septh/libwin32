import koffi from 'koffi'
import {
    Internals, StringOutputBuffer,
    cBOOL, cINT, cPVOID, cPDWORD, cWSTR,
    type OUT
} from '../../internals.js'
import type { LUID } from '../../misc/types.js'
import { cLUID } from '../../misc/ctypes.js'

import { advapi32 } from '../dll.js'
import type { SID } from '../sid/types.js'
import type { SID_NAME_USE } from '../sid/consts.js'
import { cPSID, cSID } from '../sid/ctypes.js'
import type { SE_NAME } from '../consts.js'

/**
 * Retrieves a security identifier (SID) for the account and the name of the domain on which the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountnamew
 */
export function LookupAccountName(systemName: string | null, accountName: string): LookupAccountNameResult | null {
    LookupAccountName.native ??= advapi32.func('LookupAccountNameW', cBOOL, [
        cWSTR, cWSTR, koffi.out(cPSID), koffi.inout(cPDWORD), cPVOID, koffi.inout(cPDWORD), koffi.out(koffi.pointer(cINT))
    ])

    const pSid: OUT<SID> = [{} as SID]
    const pCbSid: OUT<number> = [koffi.sizeof(cSID)]
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const pUse: OUT<number> = [0]
    if (LookupAccountName.native(systemName, accountName, pSid, pCbSid, domain.buffer, domain.pLength, pUse)) {
        return {
            sid: pSid[0],
            referencedDomainName: domain.decode(),
            use: pUse[0]
        }
    }
    return null
}

export interface LookupAccountNameResult {
    sid: SID,
    referencedDomainName: string
    use: SID_NAME_USE
}

/**
 * Retrieves the name that corresponds to the privilege represented on a specific system by a specified locally unique identifier (LUID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegenamew
 */
export function LookupPrivilegeName(systemName: string | null, luid: LUID): string | null {
    LookupPrivilegeName.native ??= advapi32.func('LookupPrivilegeNameW', cBOOL, [ cWSTR, koffi.pointer(cLUID), cPVOID, koffi.inout(cPDWORD) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    return LookupPrivilegeName.native(systemName, luid, name.buffer, name.pLength) ? name.decode() : null
}

/**
 * Retrieves the locally unique identifier (LUID) used on a specified system to locally represent the specified privilege name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegevaluew
 */
export function LookupPrivilegeValue(systemName: string | null, name: SE_NAME): LUID | null {
    LookupPrivilegeValue.native ??= advapi32.func('LookupPrivilegeValueW', cBOOL, [ cWSTR, cWSTR, koffi.out(koffi.pointer(cLUID)) ])

    const pLUID: OUT<LUID> = [{} as LUID]
    return LookupPrivilegeValue.native(systemName, name, pLUID) ? pLUID[0] : null
}
