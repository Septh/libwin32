import koffi from 'koffi-cream'
import { Internals, type OUT } from '../private.js'
import {
    cDWORD, cULONG, cPDWORD, cPVOID, cNTSTATUS,
    cHANDLE, type LSA_HANDLE,
} from '../ctypes.js'
import {
    cLSA_OBJECT_ATTRIBUTES, LSA_OBJECT_ATTRIBUTES,
    cLSA_UNICODE_STRING, LSA_UNICODE_STRING,
    cSID, type SID
} from '../structs.js'
import { NTSTATUS_, POLICY_ } from '../consts.js'
import { advapi32 } from './lib.js'

/**
 * Closes a handle to a Policy or TrustedDomain object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaclose
 */
export function LsaClose(objectHandle: LSA_HANDLE): NTSTATUS_ {
    LsaClose.native ??= advapi32.func('LsaClose', cNTSTATUS, [ cHANDLE ])
    return LsaClose.native(objectHandle)
}

/**
 * Enumerates the privileges assigned to an account.
 *
 * You must run the process "As Administrator" so that the call doesn't fail with ERROR_ACCESS_DENIED.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaenumerateaccountrights
 */
export function LsaEnumerateAccountRights(policyHandle: LSA_HANDLE, accountSid: SID): LSA_UNICODE_STRING[] | NTSTATUS_ {
    LsaEnumerateAccountRights.native ??= advapi32.func('LsaEnumerateAccountRights', cNTSTATUS, [
        cHANDLE, koffi.pointer(cSID), koffi.out(koffi.pointer(cPVOID)), koffi.out(cPDWORD)
    ])

    const pUserRights: OUT<unknown> = [null]
    const pCountOfRights: OUT<number> = [0]
    const status = LsaEnumerateAccountRights.native(policyHandle, accountSid, pUserRights, pCountOfRights)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const ret = koffi.decode(pUserRights[0], cLSA_UNICODE_STRING, pCountOfRights[0])
        return ret
    }
    return status
}

/**
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(status: NTSTATUS_ | number): number {
    LsaNtStatusToWinError.native ??= advapi32.func('LsaNtStatusToWinError', cULONG, [ cNTSTATUS ])
    return LsaNtStatusToWinError.native(status)
}

/**
 * Opens a handle to the Policy object on a local or remote system.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaopenpolicy
 */
export function LsaOpenPolicy(systemName: string | null, desiredAcces: POLICY_): LSA_HANDLE | NTSTATUS_ {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const name = typeof systemName === 'string' ? new LSA_UNICODE_STRING(systemName) : null
    const pHandle: OUT<LSA_HANDLE> = [null!]
    return LsaOpenPolicy.native(name, new LSA_OBJECT_ATTRIBUTES(), desiredAcces, pHandle) || pHandle[0]
}
