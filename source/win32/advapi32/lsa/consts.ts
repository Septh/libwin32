import koffi from 'koffi'
import { ACCESS_MASK } from '../../chore/consts.js'
import { cLSA_OBJECT_ATTRIBUTES } from './ctypes.js'

export const SIZEOF_LSA_OBJECT_ATTRIBUTES = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)

/**
 * Flags for LsaLookupNames2()
 */
export enum LSA_LOOKUP {
    None = 0,
    ISOLATED_AS_LOCAL = 0x80000000
}

/**
 * Access types for the Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/secmgmt/policy-object-access-rights
 */
export enum POLICY_ {
    VIEW_LOCAL_INFORMATION   = 0x00000001,
    VIEW_AUDIT_INFORMATION   = 0x00000002,
    GET_PRIVATE_INFORMATION  = 0x00000004,
    TRUST_ADMIN              = 0x00000008,
    CREATE_ACCOUNT           = 0x00000010,
    CREATE_SECRET            = 0x00000020,
    CREATE_PRIVILEGE         = 0x00000040,
    SET_DEFAULT_QUOTA_LIMITS = 0x00000080,
    SET_AUDIT_REQUIREMENTS   = 0x00000100,
    AUDIT_LOG_ADMIN          = 0x00000200,
    SERVER_ADMIN             = 0x00000400,
    LOOKUP_NAMES             = 0x00000800,
    NOTIFICATION             = 0x00001000,

    ALL_ACCESS = (
        ACCESS_MASK.STANDARD_RIGHTS_REQUIRED |
        VIEW_LOCAL_INFORMATION |
        VIEW_AUDIT_INFORMATION |
        GET_PRIVATE_INFORMATION |
        TRUST_ADMIN |
        CREATE_ACCOUNT |
        CREATE_SECRET |
        CREATE_PRIVILEGE |
        SET_DEFAULT_QUOTA_LIMITS |
        SET_AUDIT_REQUIREMENTS |
        AUDIT_LOG_ADMIN |
        SERVER_ADMIN |
        LOOKUP_NAMES
    ),

    READ = (
        ACCESS_MASK.STANDARD_RIGHTS_READ |
        VIEW_AUDIT_INFORMATION |
        GET_PRIVATE_INFORMATION
    ),

    WRITE = (
        ACCESS_MASK.STANDARD_RIGHTS_WRITE |
        TRUST_ADMIN |
        CREATE_ACCOUNT |
        CREATE_SECRET |
        CREATE_PRIVILEGE |
        SET_DEFAULT_QUOTA_LIMITS |
        SET_AUDIT_REQUIREMENTS |
        AUDIT_LOG_ADMIN |
        SERVER_ADMIN
    ),

    EXECUTE = (
        ACCESS_MASK.STANDARD_RIGHTS_EXECUTE |
        VIEW_LOCAL_INFORMATION |
        LOOKUP_NAMES
    )
}

/**
 * Describes the auditing options for each event type.
 */
export enum POLICY_AUDIT_EVENT_ {
    UNCHANGED       = 0x00000000,
    SUCCESS         = 0x00000001,
    FAILURE         = 0x00000002,
    NONE            = 0x00000004,
    MASK = (
        SUCCESS |
        FAILURE |
        UNCHANGED |
        NONE
    )
}

/**
 * Defines values that indicate the types of events the system can audit.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ne-ntsecapi-policy_audit_event_type
 */
export enum POLICY_AUDIT_EVENT_TYPE {
    AuditCategorySystem = 0,
    AuditCategoryLogon,
    AuditCategoryObjectAccess,
    AuditCategoryPrivilegeUse,
    AuditCategoryDetailedTracking,
    AuditCategoryPolicyChange,
    AuditCategoryAccountManagement,
    AuditCategoryDirectoryServiceAccess,
    AuditCategoryAccountLogon
}

/**
 * Values for LsaQueryInformationPolicy() and LsaSetInformationPolicy().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ne-ntsecapi-policy_information_class
 */
export enum POLICY_INFORMATION_CLASS {
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
    // PolicyMachineAccountInformation2,
    // PolicyLastEntry
}

/**
 * Indicate the role of an LSA server.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ne-ntsecapi-policy_lsa_server_role
 */
export enum POLICY_LSA_SERVER_ROLE {
    PolicyServerRoleBackup = 2,
    PolicyServerRolePrimary
}
