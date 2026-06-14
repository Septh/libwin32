import koffi from 'koffi'
import {
    Internals, StringOutputBuffer,
    cBOOL, cHANDLE, cINT, cP_DWORD, cP_VOID, cSTR,
    type HANDLE, type OUT
} from '../../internals.js'
import type { LUID } from '../../chore/types.js'
import { cLUID } from '../../chore/ctypes.js'
import type { SID } from '../sid/types.js'
import type { SID_NAME_USE } from '../sid/consts.js'
import { cPSID, cSID } from '../sid/ctypes.js'
import { advapi32 } from '../_dll.js'
import type { PRIVILEGE_SET } from './types.js'
import type { SE_NAME } from './consts.js'
import { cPRIVILEGE_SET } from './ctypes.js'

/**
 * Retrieves a security identifier (SID) for the account and the name of the domain on which the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountnamew
 */
export function LookupAccountName(systemName: string | null, accountName: string): LookupAccountNameResult | null {
    LookupAccountName.native ??= advapi32.func('LookupAccountNameW', cBOOL, [ cSTR, cSTR, koffi.out(cPSID), koffi.inout(cP_DWORD), cP_VOID, koffi.inout(cP_DWORD), koffi.out(koffi.pointer(cINT)) ])

    const sid = {} as SID
    const pCbSid: OUT<number> = [koffi.sizeof(cSID)]
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const pUse: OUT<number> = [0]
    if (LookupAccountName.native(systemName, accountName, sid, pCbSid, domain.buffer, domain.pLength, pUse) !== 0) {
        return {
            sid,
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
    LookupPrivilegeName.native ??= advapi32.func('LookupPrivilegeNameW', cBOOL, [ cSTR, koffi.pointer(cLUID), cP_VOID, koffi.inout(cP_DWORD) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    return LookupPrivilegeName.native(systemName, luid, name.buffer, name.pLength) !== 0
        ? name.decode()
        : null
}

/**
 * Retrieves the locally unique identifier (LUID) used on a specified system to locally represent the specified privilege name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegevaluew
 */
export function LookupPrivilegeValue(systemName: string | null, name: SE_NAME): LUID | null {
    LookupPrivilegeValue.native ??= advapi32.func('LookupPrivilegeValueW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cLUID)) ])

    const LUID = {} as LUID
    return LookupPrivilegeValue.native(systemName, name, LUID) !== 0
        ? LUID
        : null
}

/**
 * Determines whether a specified set of privileges are enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-privilegecheck
 */
export function PrivilegeCheck(clientToken: HANDLE, requiredPrivileges: PRIVILEGE_SET): boolean | null {
    PrivilegeCheck.native ??= advapi32.func('PrivilegeCheck', cBOOL, [ cHANDLE, koffi.inout(koffi.pointer(cPRIVILEGE_SET)), koffi.out(koffi.pointer(cBOOL)) ])

    const pfResult: OUT<number> = [0]
    return PrivilegeCheck.native(clientToken, requiredPrivileges, pfResult) !== 0
        ? Boolean(pfResult[0])
        : null
}
