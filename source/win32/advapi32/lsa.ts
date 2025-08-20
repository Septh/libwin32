import koffi from 'koffi-cream'
import { Internals, type OUT } from '../private.js'
import {
    cDWORD, cULONG, cPDWORD, cPVOID, cNTSTATUS,
    cHANDLE, type LSA_HANDLE,
} from '../ctypes.js'
import {
    cLSA_OBJECT_ATTRIBUTES, LSA_OBJECT_ATTRIBUTES,
    cLSA_UNICODE_STRING, LSA_UNICODE_STRING,
    cSID, type SID,
    cLSA_TRANSLATED_SID2, type LSA_TRANSLATED_SID2,
    cLSA_REFERENCED_DOMAIN_LIST, type LSA_REFERENCED_DOMAIN_LIST
} from '../structs.js'
import { NTSTATUS_, LSA_LOOKUP, POLICY_ } from '../consts.js'
import { advapi32, lsaFree } from './lib.js'

export interface LsaLookupNames2Result {
    sids: LSA_TRANSLATED_SID2[]
    domains: LSA_REFERENCED_DOMAIN_LIST
}

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
 * Frees memory allocated for an output buffer by an LSA function call.
 *
 * Note: in libwin32, all LSA functions free the allocated memory, so this function is a NOOP.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsafreememory
 */
export function LsaFreeMemory(buffer: unknown): NTSTATUS_ {
    return NTSTATUS_.SUCCESS
}

/**
 * Retrieves the security identifiers (SIDs) for specified account names in any domain in a Windows forest.
 *
 * Notes:
 * - in libwin32, LsaLookupNames2 accepts 1 to 8 names max.
 * - any memory allocated by the system is immediately returned to the system. The net effect is that you don't need
 *   to call {@link LsaFreeMemory()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsalookupnames2
 */
export function LsaLookupNames2(policyHandle: LSA_HANDLE, flags: LSA_LOOKUP, ...names: string[]): LsaLookupNames2Result | NTSTATUS_ {
    LsaLookupNames2.native ??= advapi32.func('LsaLookupNames2', cNTSTATUS, [
        cHANDLE, cULONG, cULONG, koffi.pointer(koffi.array(cLSA_UNICODE_STRING, Internals.LSALOOKUPNAMES2_MAX_NAMES)),
        koffi.out(koffi.pointer(cPVOID)), koffi.out(koffi.pointer(cPVOID))
    ])

    const count = names.length
    if (count > 0 && count <= Internals.LSALOOKUPNAMES2_MAX_NAMES) {
        names.length = Internals.LSALOOKUPNAMES2_MAX_NAMES
        names.fill('', count)
    }
    else return NTSTATUS_.INVALID_PARAMETER

    const uNames = names.map(name => new LSA_UNICODE_STRING(name))
    const pReferencedDomains: OUT<unknown> = [null]
    const pSids: OUT<unknown> = [null]

    const status = LsaLookupNames2.native(policyHandle, flags, count, [uNames], pReferencedDomains, pSids)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const sids: LSA_TRANSLATED_SID2[] = koffi.decode(pSids[0], cLSA_TRANSLATED_SID2, count)
        sids.forEach(sid => sid.Sid = koffi.decode(sid.Sid, cSID))
        lsaFree(pSids[0])

        const domains: LSA_REFERENCED_DOMAIN_LIST = koffi.decode(pReferencedDomains[0], cLSA_REFERENCED_DOMAIN_LIST)
        domains.Domains.forEach(domain => domain.Sid = koffi.decode(domain.Sid, cSID))
        lsaFree(pReferencedDomains[0])

        return { sids, domains }
    }

    if (status === NTSTATUS_.NONE_MAPPED || status === NTSTATUS_.SOME_NOT_MAPPED) {
        lsaFree(pSids[0])
        lsaFree(pReferencedDomains[0])
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
