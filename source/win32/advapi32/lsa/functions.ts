import koffi from 'koffi'
import {
    Internals, isPointer,
    cINT, cDWORD, cPVOID, cPPVOID, cPDWORD, cULONG, cHANDLE, cNTSTATUS,
    type OUT, type Pointer
} from '../../internals.js'
import { NTSTATUS_ } from '../../misc/consts.js'

import { advapi32 } from '../dll.js'
import type { SID } from '../sid/types.js'
import { cSID } from '../sid/ctypes.js'

import {
    LSA_OBJECT_ATTRIBUTES, LSA_UNICODE_STRING,
    type LSA_HANDLE,
    type LSA_TRANSLATED_SID2, type LSA_REFERENCED_DOMAIN_LIST,
    type POLICY_ACCOUNT_DOMAIN_INFO, type POLICY_AUDIT_EVENTS_INFO,
    type POLICY_DNS_DOMAIN_INFO, type POLICY_LSA_SERVER_ROLE_INFO, type POLICY_MODIFICATION_INFO, type POLICY_PRIMARY_DOMAIN_INFO
} from './types.js'
import {
    POLICY_INFORMATION_CLASS,
    type LSA_LOOKUP, type POLICY_
} from './consts.js'
import {
    cLSA_UNICODE_STRING, cLSA_TRANSLATED_SID2,
    cLSA_REFERENCED_DOMAIN_LIST, cLSA_OBJECT_ATTRIBUTES, cPOLICY_ACCOUNT_DOMAIN_INFO, cPOLICY_AUDIT_EVENTS_INFO, cPOLICY_DNS_DOMAIN_INFO,
    cPOLICY_LSA_SERVER_ROLE_INFO, cPOLICY_MODIFICATION_INFO, cPOLICY_PRIMARY_DOMAIN_INFO
} from './ctypes.js'

function _LsaFree(ptr: Pointer): number {
    _LsaFree.native ??= advapi32.func('LsaFreeMemory', cNTSTATUS, [ cPVOID ])
    return _LsaFree.native(ptr)
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
        cHANDLE, koffi.pointer(cSID), koffi.out(cPPVOID), koffi.out(cPDWORD)
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
 * Note: in libwin32, all LSA functions automatically free the memory they allocate, so this function is a NOOP.
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
 * - in libwin32, LsaLookupNames2() accepts 1 to 8 names max. The function fails with `NTSTATUS_.INVALID_PARAMETER`
 *   if there are less than 1 or more than 8 name parameters.
 * - any memory allocated by the system is immediately returned to the system. The net effect is that you don't need
 *   to call {@link LsaFreeMemory()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsalookupnames2
 */
export function LsaLookupNames2(policyHandle: LSA_HANDLE, flags: LSA_LOOKUP, ...names: string[]): LsaLookupNames2Result | NTSTATUS_ {
    LsaLookupNames2.native ??= advapi32.func('LsaLookupNames2', cNTSTATUS, [
        cHANDLE, cULONG, cULONG, koffi.pointer(koffi.array(cLSA_UNICODE_STRING, Internals.LSALOOKUPNAMES2_MAX_NAMES)),
        koffi.out(cPPVOID), koffi.out(cPPVOID)
    ])

    const numNames = names.length
    if (numNames < 1 || numNames > Internals.LSALOOKUPNAMES2_MAX_NAMES)
        return NTSTATUS_.INVALID_PARAMETER

    names.length = Internals.LSALOOKUPNAMES2_MAX_NAMES
    names.fill('', numNames)

    const unicodeNames = names.map(name => new LSA_UNICODE_STRING(name))
    const pReferencedDomains: OUT<Pointer> = [0n]
    const pSids: OUT<Pointer> = [0n]

    const status = LsaLookupNames2.native(policyHandle, flags, numNames, [unicodeNames], pReferencedDomains, pSids)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const sids = koffi.decode(pSids[0], cLSA_TRANSLATED_SID2, numNames) as LSA_TRANSLATED_SID2[]
        for (let i = 0; i < numNames; i++) {
            if (isPointer(sids[i].Sid))
                sids[i].Sid = koffi.decode(sids[i].Sid, cSID)
        }
        _LsaFree(pSids[0])

        const domains = koffi.decode(pReferencedDomains[0], cLSA_REFERENCED_DOMAIN_LIST) as LSA_REFERENCED_DOMAIN_LIST
        for (let i = 0; i < domains.Domains.length; i++) {
            if (isPointer(domains.Domains[i].Sid))
                domains.Domains[i].Sid = koffi.decode(domains.Domains[i].Sid, cSID)
        }
        _LsaFree(pReferencedDomains[0])

        return { sids, domains }
    }

    if (status === NTSTATUS_.NONE_MAPPED || status === NTSTATUS_.SOME_NOT_MAPPED) {
        _LsaFree(pSids[0])
        _LsaFree(pReferencedDomains[0])
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
export function LsaOpenPolicy(systemName: LSA_UNICODE_STRING | string | null, desiredAccess: POLICY_): LSA_HANDLE | NTSTATUS_ {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

    const name = systemName instanceof LSA_UNICODE_STRING ? systemName
        : typeof systemName === 'string' ? new LSA_UNICODE_STRING(systemName)
        : null
    const pHandle: OUT<LSA_HANDLE> = [null!]
    const ret = LsaOpenPolicy.native(name, new LSA_OBJECT_ATTRIBUTES(), desiredAccess, pHandle)
    return ret === 0 ? pHandle[0] : ret
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
 * Retrieves information about a Policy object.
 *
 * Notes:
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
    LsaQueryInformationPolicy.native ??= advapi32.func('LsaQueryInformationPolicy', cNTSTATUS, [ cHANDLE, cINT, koffi.out(cPPVOID) ])

    const pBuffer: OUT<Pointer> = [0n]
    const status = LsaQueryInformationPolicy.native(policyHandle, infoClass, pBuffer)
    if (status !== NTSTATUS_.SUCCESS)
        return status

    switch (infoClass) {
        case POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_AUDIT_EVENTS_INFO) as POLICY_AUDIT_EVENTS_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_PRIMARY_DOMAIN_INFO) as POLICY_PRIMARY_DOMAIN_INFO
            ret.Sid = koffi.decode(ret.Sid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_ACCOUNT_DOMAIN_INFO) as POLICY_ACCOUNT_DOMAIN_INFO
            if (isPointer(ret.DomainSid))
                ret.DomainSid = koffi.decode(ret.DomainSid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_LSA_SERVER_ROLE_INFO) as POLICY_LSA_SERVER_ROLE_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyModificationInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_MODIFICATION_INFO) as POLICY_MODIFICATION_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_DNS_DOMAIN_INFO) as POLICY_DNS_DOMAIN_INFO
            if (isPointer(ret.Sid))
                ret.Sid = koffi.decode(ret.Sid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyAuditLogInformation:
        case POLICY_INFORMATION_CLASS.PolicyPdAccountInformation:
        case POLICY_INFORMATION_CLASS.PolicyReplicaSourceInformation:
        case POLICY_INFORMATION_CLASS.PolicyDefaultQuotaInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullSetInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullQueryInformation:
        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformationInt:
        case POLICY_INFORMATION_CLASS.PolicyLocalAccountDomainInformation:
        case POLICY_INFORMATION_CLASS.PolicyMachineAccountInformation:
            if (pBuffer[0] !== 0n)
                _LsaFree(pBuffer[0])
            return NTSTATUS_.NOT_SUPPORTED

        default:
            if (pBuffer[0] !== 0n)
                _LsaFree(pBuffer[0])
            return NTSTATUS_.INVALID_PARAMETER
    }
}
