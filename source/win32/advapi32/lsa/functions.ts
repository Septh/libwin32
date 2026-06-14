import koffi from 'koffi'
import {
    Internals, isPointer,
    cDWORD, cHANDLE, cINT, cNTSTATUS, cP_DWORD, cP_VOID, cULONG,
    type OUT, type Pointer
} from '../../internals.js'
import { NTSTATUS_ } from '../../chore/consts.js'
import type { SID } from '../sid/types.js'
import { cSID } from '../sid/ctypes.js'
import { advapi32 } from '../_dll.js'
import {
    LSA_HANDLE, LSA_OBJECT_ATTRIBUTES, LSA_UNICODE_STRING,
    type LSA_REFERENCED_DOMAIN_LIST, type LSA_TRANSLATED_SID2,
    type POLICY_ACCOUNT_DOMAIN_INFO, type POLICY_AUDIT_EVENTS_INFO, type POLICY_DNS_DOMAIN_INFO, type POLICY_LSA_SERVER_ROLE_INFO,
    type POLICY_MODIFICATION_INFO, type POLICY_PRIMARY_DOMAIN_INFO
} from './types.js'
import { LSA_LOOKUP, POLICY_INFORMATION_CLASS, type POLICY_ } from './consts.js'
import {
    cLSA_OBJECT_ATTRIBUTES, cLSA_REFERENCED_DOMAIN_LIST, cLSA_TRANSLATED_SID2, cLSA_UNICODE_STRING,
    cPOLICY_ACCOUNT_DOMAIN_INFO, cPOLICY_AUDIT_EVENTS_INFO, cPOLICY_DNS_DOMAIN_INFO, cPOLICY_LSA_SERVER_ROLE_INFO,
    cPOLICY_MODIFICATION_INFO, cPOLICY_PRIMARY_DOMAIN_INFO
} from './ctypes.js'

function lsaFree(ptr: Pointer) {
    lsaFree.native ??= advapi32.func('LsaFreeMemory', cNTSTATUS, [ cP_VOID ])
    return lsaFree.native(ptr)
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
        cHANDLE, koffi.pointer(cSID), koffi.out(koffi.pointer(cP_VOID)), koffi.out(cP_DWORD)
    ])

    const pUserRights: OUT<Pointer> = [null!]
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
 * - in libwin32, LsaLookupNames2() accepts 1 to 8 names max.
 * - any memory allocated by the system is immediately returned to the system. The net effect is that you don't need
 *   to call {@link LsaFreeMemory()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsalookupnames2
 */
export function LsaLookupNames2(policyHandle: LSA_HANDLE, flags: LSA_LOOKUP, ...names: string[]): LsaLookupNames2Result | NTSTATUS_ {
    LsaLookupNames2.native ??= advapi32.func('LsaLookupNames2', cNTSTATUS, [
        cHANDLE, cULONG, cULONG, koffi.pointer(koffi.array(cLSA_UNICODE_STRING, Internals.LSALOOKUPNAMES2_MAX_NAMES)),
        koffi.out(koffi.pointer(cP_VOID)), koffi.out(koffi.pointer(cP_VOID))
    ])

    const namesCount = names.length
    if (namesCount < 1 || namesCount > Internals.LSALOOKUPNAMES2_MAX_NAMES)
        return NTSTATUS_.INVALID_PARAMETER

    names.length = Internals.LSALOOKUPNAMES2_MAX_NAMES
    names.fill('', namesCount)

    const unicodeNames = names.map(name => new LSA_UNICODE_STRING(name))
    const pReferencedDomains: OUT<Pointer> = [0n]
    const pSids: OUT<Pointer> = [0n]

    const status = LsaLookupNames2.native(policyHandle, flags, namesCount, [unicodeNames], pReferencedDomains, pSids)
    if (status === Internals.NTSTATUS_SUCCESS) {

        const domains: LSA_REFERENCED_DOMAIN_LIST = koffi.decode(pReferencedDomains[0], cLSA_REFERENCED_DOMAIN_LIST)
        for (let i = 0; i < domains.Domains.length; i++) {
            if (isPointer(domains.Domains[i].Sid))
                domains.Domains[i].Sid = koffi.decode(domains.Domains[i].Sid, cSID)
        }

        const sids: LSA_TRANSLATED_SID2[] = koffi.decode(pSids[0], cLSA_TRANSLATED_SID2, namesCount)
        for (let i = 0; i < namesCount; i++) {
            if (isPointer(sids[i].Sid))
                sids[i].Sid = koffi.decode(sids[i].Sid, cSID)
        }

        lsaFree(pReferencedDomains[0])
        lsaFree(pSids[0])
        return { sids, domains }
    }

    if (pReferencedDomains[0] !== 0n)
        lsaFree(pReferencedDomains[0])
    if (pSids[0] !== 0n)
        lsaFree(pSids[0])

    return status
}

export interface LsaLookupNames2Result {
    sids: LSA_TRANSLATED_SID2[]
    domains: LSA_REFERENCED_DOMAIN_LIST
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

/**
 * Retrieves the system's auditing rules.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryAuditEventsInformationPolicy(policyHandle: LSA_HANDLE): POLICY_AUDIT_EVENTS_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)
}

/**
 * Retrieves the name and SID of the system's primary domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryPrimaryDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)
}

/**
 * Retrieves the name and SID of the system's account domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryAccountDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)
}

/**
 * Query the role of an LSA server.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryLsaServerRoleInformationPolicy(policyHandle: LSA_HANDLE): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)
}

/**
 * Retrieves information about the creation time and last modification of the LSA database.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyModificationInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryModificationInformationPolicy(policyHandle: LSA_HANDLE): POLICY_MODIFICATION_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyModificationInformation)
}

/**
 * Query Domain Name System (DNS) information about the account domain associated with a Policy object.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryDnsDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_DNS_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)
}

/**
 * Retrieves information about a Policy object.
 *
 * Note: in libwin32, the function only supports the values of the `POLICY_INFORMATION_CLASS` enumeration
 *       that are listed on the function's doc (link below). All other POLICY_INFORMATION_CLASS values
 *       return `STATUS_NOT_SUPPORTED`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation):   POLICY_AUDIT_EVENTS_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyModificationInformation):  POLICY_MODIFICATION_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation):     POLICY_DNS_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: number): POLICY_INFORMATION | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: number) {
    LsaQueryInformationPolicy.native ??= advapi32.func('LsaQueryInformationPolicy', cNTSTATUS, [ cHANDLE, cINT, koffi.out(koffi.pointer(cP_VOID)) ])

    const pInfo: OUT<Pointer> = [0n]
    const status = LsaQueryInformationPolicy.native(policyHandle, infoClass, pInfo)
    if (status !== NTSTATUS_.SUCCESS)
        return status

    switch (infoClass) {
        case POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_AUDIT_EVENTS_INFO) as POLICY_AUDIT_EVENTS_INFO
            if (ret.EventAuditingOptions instanceof Uint32Array)
                ret.EventAuditingOptions = Array.from(ret.EventAuditingOptions)
            return lsaFree(pInfo[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_PRIMARY_DOMAIN_INFO) as POLICY_PRIMARY_DOMAIN_INFO
            if (isPointer(ret.Sid))
                ret.Sid = koffi.decode(ret.Sid, cSID)
            return lsaFree(pInfo[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_ACCOUNT_DOMAIN_INFO) as POLICY_ACCOUNT_DOMAIN_INFO
            if (isPointer(ret.DomainSid))
                ret.DomainSid = koffi.decode(ret.DomainSid, cSID)
            return lsaFree(pInfo[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_LSA_SERVER_ROLE_INFO) as POLICY_LSA_SERVER_ROLE_INFO
            return lsaFree(pInfo[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyModificationInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_MODIFICATION_INFO) as POLICY_MODIFICATION_INFO
            return lsaFree(pInfo[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation: {
            const ret = koffi.decode(pInfo[0], cPOLICY_DNS_DOMAIN_INFO) as POLICY_DNS_DOMAIN_INFO
            if (isPointer(ret.Sid))
                ret.Sid = koffi.decode(ret.Sid, cSID)
            return lsaFree(pInfo[0]), ret
        }

        default:
            if (pInfo[0] !== 0n)
                lsaFree(pInfo[0])
            return NTSTATUS_.NOT_SUPPORTED
    }
}

type POLICY_INFORMATION =
    | POLICY_AUDIT_EVENTS_INFO | POLICY_PRIMARY_DOMAIN_INFO | POLICY_ACCOUNT_DOMAIN_INFO
    | POLICY_LSA_SERVER_ROLE_INFO | POLICY_MODIFICATION_INFO | POLICY_DNS_DOMAIN_INFO
