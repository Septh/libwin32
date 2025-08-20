import koffi from 'koffi-cream'
import type { LSA_HANDLE } from '../ctypes.js'
import {
    cPOLICY_AUDIT_EVENTS_INFO, type POLICY_AUDIT_EVENTS_INFO,
    cPOLICY_PRIMARY_DOMAIN_INFO, type POLICY_PRIMARY_DOMAIN_INFO,
    cPOLICY_ACCOUNT_DOMAIN_INFO, type POLICY_ACCOUNT_DOMAIN_INFO,
    cPOLICY_LSA_SERVER_ROLE_INFO, type POLICY_LSA_SERVER_ROLE_INFO,
    cPOLICY_MODIFICATION_INFO, type POLICY_MODIFICATION_INFO,
    cPOLICY_DNS_DOMAIN_INFO, type POLICY_DNS_DOMAIN_INFO,
    cSID
} from '../structs.js'
import { NTSTATUS_, POLICY_INFORMATION_CLASS } from '../consts.js'
import { INTERNAL_POLICY_INFORMATION_CLASS, queryPolicyInfo, lsaFree } from './lib.js'

/**
 * Retrieves the system's auditing rules.
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
 * Note: in libwin32, the function only supports the values of the `POLICY_INFORMATION_CLASS` enumeration
 *       that are listed on the function's doc (link below). All other POLICY_INFORMATION_CLASS values
 *       return `STATUS_NOT_SUPPORTED`, and values outside the enumeration return STATUS_INVALID_PARAMETER.
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
