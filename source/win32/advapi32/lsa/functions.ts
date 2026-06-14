import koffi from 'koffi'
import {
    Internals,
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
import { cLSA_OBJECT_ATTRIBUTES, cLSA_REFERENCED_DOMAIN_LIST, cLSA_TRANSLATED_SID2, cLSA_UNICODE_STRING,
    cPOLICY_ACCOUNT_DOMAIN_INFO, cPOLICY_AUDIT_EVENTS_INFO, cPOLICY_DNS_DOMAIN_INFO, cPOLICY_LSA_SERVER_ROLE_INFO,
    cPOLICY_MODIFICATION_INFO, cPOLICY_PRIMARY_DOMAIN_INFO
} from './ctypes.js'

const enum INTERNAL_POLICY_INFORMATION_CLASS {
    /** @deprecated */PolicyAuditLogInformation = 1,
    PolicyAuditEventsInformation,
    PolicyPrimaryDomainInformation,
    /** @deprecated */PolicyPdAccountInformation,
    PolicyAccountDomainInformation,
    PolicyLsaServerRoleInformation,
    /** @deprecated */PolicyReplicaSourceInformation,
    /** @deprecated */PolicyDefaultQuotaInformation,
    PolicyModificationInformation,
    /** @deprecated */PolicyAuditFullSetInformation,
    /** @deprecated */PolicyAuditFullQueryInformation,
    PolicyDnsDomainInformation,
    /** @deprecated */PolicyDnsDomainInformationInt,
    /** @deprecated */PolicyLocalAccountDomainInformation,
    /** @deprecated */PolicyMachineAccountInformation,
}

function queryPolicyInfo(policyHandle: LSA_HANDLE, infoClass: INTERNAL_POLICY_INFORMATION_CLASS): NTSTATUS_ | unknown {
    queryPolicyInfo.native ??= advapi32.func('LsaQueryInformationPolicy', cNTSTATUS, [ cHANDLE, cINT, koffi.out(koffi.pointer(cP_VOID)) ])

    const pBuffer: OUT<unknown> = [null!]
    return queryPolicyInfo.native(policyHandle, infoClass, pBuffer) || pBuffer[0]
}

function lsaFree(ptr: unknown) {
    return (lsaFree.native ??= advapi32.func('LsaFreeMemory', cNTSTATUS, [ cP_VOID ]))(ptr)
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

    const count = names.length
    if (count < 1 || count > Internals.LSALOOKUPNAMES2_MAX_NAMES)
        return NTSTATUS_.INVALID_PARAMETER

    names.length = Internals.LSALOOKUPNAMES2_MAX_NAMES
    names.fill('', count)

    const uNames = names.map(name => new LSA_UNICODE_STRING(name))
    const pReferencedDomains: OUT<unknown> = [null]
    const pSids: OUT<unknown> = [null]

    const status = LsaLookupNames2.native(policyHandle, flags, count, [uNames], pReferencedDomains, pSids)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const sids: LSA_TRANSLATED_SID2[] = koffi.decode(pSids[0], cLSA_TRANSLATED_SID2, count)
        for (let i = 0; i < count; i++)
            sids[i].Sid = koffi.decode(sids[i].Sid, cSID)
        lsaFree(pSids[0])

        const domains: LSA_REFERENCED_DOMAIN_LIST = koffi.decode(pReferencedDomains[0], cLSA_REFERENCED_DOMAIN_LIST)
        for (let i = 0; i < domains.Domains.length; i++)
            domains.Domains[i].Sid = koffi.decode(domains.Domains[i].Sid, cSID)
        lsaFree(pReferencedDomains[0])

        return { sids, domains }
    }

    if (status === NTSTATUS_.NONE_MAPPED || status === NTSTATUS_.SOME_NOT_MAPPED) {
        lsaFree(pSids[0])
        lsaFree(pReferencedDomains[0])
    }

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
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_AUDIT_EVENTS_INFO = koffi.decode(ptr, cPOLICY_AUDIT_EVENTS_INFO)
    return lsaFree(ret), ret
}

/**
 * Retrieves the name and SID of the system's primary domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryPrimaryDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_ {
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_PRIMARY_DOMAIN_INFO = koffi.decode(ptr, cPOLICY_PRIMARY_DOMAIN_INFO)
    ret.Sid = koffi.decode(ret.Sid, cSID)
    return lsaFree(ret), ret
}

/**
 * Retrieves the name and SID of the system's account domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryAccountDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_ {
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_ACCOUNT_DOMAIN_INFO = koffi.decode(ptr, cPOLICY_ACCOUNT_DOMAIN_INFO)
    ret.DomainSid = koffi.decode(ret.DomainSid, cSID)
    return lsaFree(ret), ret
}

/**
 * Query the role of an LSA server.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryLsaServerRoleInformationPolicy(policyHandle: LSA_HANDLE): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_ {
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_LSA_SERVER_ROLE_INFO = koffi.decode(ptr, cPOLICY_LSA_SERVER_ROLE_INFO)
    return lsaFree(ret), ret
}

/**
 * Retrieves information about the creation time and last modification of the LSA database.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyModificationInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryModificationInformationPolicy(policyHandle: LSA_HANDLE): POLICY_MODIFICATION_INFO | NTSTATUS_ {
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyModificationInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_MODIFICATION_INFO = koffi.decode(ptr, cPOLICY_MODIFICATION_INFO)
    return lsaFree(ret), ret
}

/**
 * Query Domain Name System (DNS) information about the account domain associated with a Policy object.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryDnsDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_DNS_DOMAIN_INFO | NTSTATUS_ {
    const ptr = queryPolicyInfo(policyHandle, INTERNAL_POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)
    if (typeof ptr === 'number')
        return ptr

    const ret: POLICY_DNS_DOMAIN_INFO = koffi.decode(ptr, cPOLICY_DNS_DOMAIN_INFO)
    ret.Sid = koffi.decode(ret.Sid, cSID)
    return lsaFree(ret), ret
}

/**
 * Retrieves information about a Policy object.
 *
 * Note:
 * - In libwin32, the function only supports the values of the `POLICY_INFORMATION_CLASS` enumeration
 *   that are listed on the function's doc (link below).
 * - All other POLICY_INFORMATION_CLASS values return `STATUS_NOT_SUPPORTED`
 * - Values outside the enumeration return STATUS_INVALID_PARAMETER.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation):   POLICY_AUDIT_EVENTS_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyModificationInformation):  POLICY_MODIFICATION_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation):     POLICY_DNS_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS): any
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS) {
    switch (infoClass) {
        case POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation:   return LsaQueryAuditEventsInformationPolicy(policyHandle)
        case POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation: return LsaQueryPrimaryDomainInformationPolicy(policyHandle)
        case POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation: return LsaQueryAccountDomainInformationPolicy(policyHandle)
        case POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation: return LsaQueryLsaServerRoleInformationPolicy(policyHandle)
        case POLICY_INFORMATION_CLASS.PolicyModificationInformation:  return LsaQueryModificationInformationPolicy(policyHandle)
        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation:     return LsaQueryDnsDomainInformationPolicy(policyHandle)

        case POLICY_INFORMATION_CLASS.PolicyAuditLogInformation:
        case POLICY_INFORMATION_CLASS.PolicyPdAccountInformation:
        case POLICY_INFORMATION_CLASS.PolicyReplicaSourceInformation:
        case POLICY_INFORMATION_CLASS.PolicyDefaultQuotaInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullSetInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullQueryInformation:
        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformationInt:
        case POLICY_INFORMATION_CLASS.PolicyLocalAccountDomainInformation:
        case POLICY_INFORMATION_CLASS.PolicyMachineAccountInformation:
            return NTSTATUS_.NOT_SUPPORTED

        default:
            return NTSTATUS_.INVALID_PARAMETER
    }
}
