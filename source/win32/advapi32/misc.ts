import koffi from 'koffi-cream'
import { StringOutputBuffer, Internals, type OUT } from '../private.js'
import {
    cBOOL, cINT, cDWORD, cPVOID, cSTR,
    cHANDLE, type HANDLE, type HTOKEN
} from '../ctypes.js'
import {
    cSID, type SID,
    cLUID, type LUID,
    cPRIVILEGE_SET, type PRIVILEGE_SET
} from '../structs.js'
import type { TOKEN_, SID_NAME_USE, SE_NAME } from '../consts.js'
import { advapi32 } from './lib.js'

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.UNLEN + 1)
    if (GetUserName.native(name.buffer, name.pLength) !== 0)
        return name.decode(name.length - 1)   // GetUserName() returned length includes the final \0
    return null
}

/**
 * Retrieves a security identifier (SID) for the account and the name of the domain on which the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountnamew
 */
export function LookupAccountName(systemName: string | null, accountName: string): LookupAccountNameResult | null {
    LookupAccountName.native ??= advapi32.func('LookupAccountNameW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cSID)), koffi.inout(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cINT)) ])

    const sid = {} as SID
    const pcbSid: OUT<number> = [koffi.sizeof(cSID)]
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const peUse: OUT<number> = [0]
    if (LookupAccountName.native(systemName, accountName, sid, pcbSid, domain.buffer, domain.pLength, peUse) !== 0) {
        return {
            sid,
            referencedDomainName: domain.decode(),
            use: peUse[0]
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
    LookupPrivilegeName.native ??= advapi32.func('LookupPrivilegeNameW', cBOOL, [ cSTR, koffi.pointer(cLUID), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    if (LookupPrivilegeName.native(systemName, luid, name.buffer, name.pLength) !== 0)
        return name.decode()
    return null
}

/**
 * Retrieves the locally unique identifier (LUID) used on a specified system to locally represent the specified privilege name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegevaluew
 */
export function LookupPrivilegeValue(systemName: string | null, name: SE_NAME): LUID | null {
    LookupPrivilegeValue.native ??= advapi32.func('LookupPrivilegeValueW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cLUID)) ])

    const LUID = {} as LUID
    if (LookupPrivilegeValue.native(systemName, name, LUID) !== 0)
        return LUID
    return null
}

/**
 * Opens the access token associated with a process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function OpenProcessToken(processHandle: HANDLE, desiredAccess: TOKEN_): HTOKEN | null {
    OpenProcessToken.native ??= advapi32.func('OpenProcessToken', cBOOL, [ cHANDLE, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HTOKEN> = [null!]
    if (OpenProcessToken.native(processHandle, desiredAccess, pHandle) !== 0)
        return pHandle[0]
    return null
}

/**
 * The PrivilegeCheck function determines whether a specified set of privileges are enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-privilegecheck
 */
export function PrivilegeCheck(clientToken: HANDLE, requiredPrivileges: PRIVILEGE_SET): boolean | null {
    PrivilegeCheck.native ??= advapi32.func('PrivilegeCheck', cBOOL, [ cHANDLE, koffi.inout(koffi.pointer(cPRIVILEGE_SET)), koffi.out(koffi.pointer(cBOOL)) ])

    const pfResult: OUT<number> = [0]
    if (PrivilegeCheck.native(clientToken, requiredPrivileges, pfResult) !== 0)
        return Boolean(pfResult[0])
    return null
}
