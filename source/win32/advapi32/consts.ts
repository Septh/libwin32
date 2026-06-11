import { Internals } from '../internals.js'
import { ACCESS_MASK } from '../misc/consts.js'
import type { SID_IDENTIFIER_AUTHORITY } from './types.js'

export const ACL_REVISION_DS = Internals.ACL_REVISION_DS
export const CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION = Internals.CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1

/**
 * Claim Security attributes flags.
 */
export enum CLAIM_SECURITY_ATTRIBUTE_ {
    NON_INHERITABLE      = 0x0001,
    VALUE_CASE_SENSITIVE = 0x0002,
    USE_FOR_DENY_ONLY    = 0x0004,
    DISABLED_BY_DEFAULT  = 0x0008,
    DISABLED             = 0x0010,
    MANDATORY            = 0x0020,
    CUSTOM_FLAGS         = 0xFFFF0000,

    VALID_FLAGS = (
        NON_INHERITABLE
        | VALUE_CASE_SENSITIVE
        | USE_FOR_DENY_ONLY
        | DISABLED_BY_DEFAULT
        | DISABLED
        | MANDATORY
    )
}

/**
 * Claim Security attributes.
 */
export enum CLAIM_SECURITY_ATTRIBUTE_TYPE_ {
    INVALID      = 0x00,
    INT64        = 0x01,
    UINT64       = 0x02,
    STRING       = 0x03,
    FQBN         = 0x04,
    SID          = 0x05,
    BOOLEAN      = 0x06,
    OCTET_STRING = 0x10
}

/**
 * well-known aliases...
 */
export enum DOMAIN_ALIAS_ {
    RID_ADMINS                         = 0x00000220,
    RID_USERS                          = 0x00000221,
    RID_GUESTS                         = 0x00000222,
    RID_POWER_USERS                    = 0x00000223,
    RID_ACCOUNT_OPS                    = 0x00000224,
    RID_SYSTEM_OPS                     = 0x00000225,
    RID_PRINT_OPS                      = 0x00000226,
    RID_BACKUP_OPS                     = 0x00000227,
    RID_REPLICATOR                     = 0x00000228,
    RID_RAS_SERVERS                    = 0x00000229,
    RID_PREW2KCOMPACCESS               = 0x0000022A,
    RID_REMOTE_DESKTOP_USERS           = 0x0000022B,
    RID_NETWORK_CONFIGURATION_OPS      = 0x0000022C,
    RID_INCOMING_FOREST_TRUST_BUILDERS = 0x0000022D,
    RID_MONITORING_USERS               = 0x0000022E,
    RID_LOGGING_USERS                  = 0x0000022F,
    RID_AUTHORIZATIONACCESS            = 0x00000230,
    RID_TS_LICENSE_SERVERS             = 0x00000231,
    RID_DCOM_USERS                     = 0x00000232,
    RID_IUSERS                         = 0x00000238,
    RID_CRYPTO_OPERATORS               = 0x00000239,
    RID_CACHEABLE_PRINCIPALS_GROUP     = 0x0000023B,
    RID_NON_CACHEABLE_PRINCIPALS_GROUP = 0x0000023C,
    RID_EVENT_LOG_READERS_GROUP        = 0x0000023D,
    RID_CERTSVC_DCOM_ACCESS_GROUP      = 0x0000023E,
    RID_RDS_REMOTE_ACCESS_SERVERS      = 0x0000023F,
    RID_RDS_ENDPOINT_SERVERS           = 0x00000240,
    RID_RDS_MANAGEMENT_SERVERS         = 0x00000241,
    RID_HYPER_V_ADMINS                 = 0x00000242,
    RID_ACCESS_CONTROL_ASSISTANCE_OPS  = 0x00000243,
    RID_REMOTE_MANAGEMENT_USERS        = 0x00000244,
    RID_DEFAULT_ACCOUNT                = 0x00000245,
    RID_STORAGE_REPLICA_ADMINS         = 0x00000246,
    RID_DEVICE_OWNERS                  = 0x00000247,
    RID_USER_MODE_HARDWARE_OPERATORS   = 0x00000248,
    RID_OPENSSH_USERS                  = 0x00000249,
}

/**
 * Specifies a format for a directory service object name.
 */
export enum EXTENDED_NAME_FORMAT {
    NameUnknown          = 0,
    NameFullyQualifiedDN = 1,
    NameSamCompatible    = 2,
    NameDisplay          = 3,
    NameUniqueId         = 6,
    NameCanonical        = 7,
    NameUserPrincipal    = 8,
    NameCanonicalEx      = 9,
    NameServicePrincipal = 10,
    NameDnsDomain        = 12,
    NameGivenName        = 13,
    NameSurname          = 14
}

/**
 * Predefined Value Types.
 */
export enum REG_ {
    NONE                       = 0,     // No value type
    SZ                         = 1,     // Unicode nul terminated string
    EXPAND_SZ                  = 2,     // Unicode nul terminated string (with environment variable references)
    BINARY                     = 3,     // Free form binary
    DWORD                      = 4,     // 32-bit number
    DWORD_LITTLE_ENDIAN        = 4,     // 32-bit number (same as REG_DWORD)
    DWORD_BIG_ENDIAN           = 5,     // 32-bit number
    LINK                       = 6,     // Symbolic Link (unicode)
    MULTI_SZ                   = 7,     // Multiple Unicode strings
    RESOURCE_LIST              = 8,     // Resource list in the resource map
    FULL_RESOURCE_DESCRIPTOR   = 9,     // Resource list in the hardware description
    RESOURCE_REQUIREMENTS_LIST = 10,
    QWORD                      = 11,    // 64-bit number
    QWORD_LITTLE_ENDIAN        = 11,    // 64-bit number (same as REG_QWORD)
}

export enum REG_OPTION_ {
    RESERVED        = 0x00000000,
    NON_VOLATILE    = 0x00000000,
    VOLATILE        = 0x00000001,
    CREATE_LINK     = 0x00000002,
    BACKUP_RESTORE  = 0x00000004,
    OPEN_LINK       = 0x00000008,
    DONT_VIRTUALIZE = 0x00000010,
}

/**
 * Registry Routine Flags (for RegGetValue)
 */
export enum RRF_ {
    RT_REG_NONE       = 0x00000001,                         // restrict type to REG_NONE      (other data types will not return ERROR_SUCCESS)
    RT_REG_SZ         = 0x00000002,                         // restrict type to REG_SZ        (other data types will not return ERROR_SUCCESS) (automatically converts REG_EXPAND_SZ to REG_SZ unless RRF_NOEXPAND is specified)
    RT_REG_EXPAND_SZ  = 0x00000004,                         // restrict type to REG_EXPAND_SZ (other data types will not return ERROR_SUCCESS) (must specify RRF_NOEXPAND or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    RT_REG_BINARY     = 0x00000008,                         // restrict type to REG_BINARY    (other data types will not return ERROR_SUCCESS)
    RT_REG_DWORD      = 0x00000010,                         // restrict type to REG_DWORD     (other data types will not return ERROR_SUCCESS)
    RT_REG_MULTI_SZ   = 0x00000020,                         // restrict type to REG_MULTI_SZ  (other data types will not return ERROR_SUCCESS)
    RT_REG_QWORD      = 0x00000040,                         // restrict type to REG_QWORD     (other data types will not return ERROR_SUCCESS)
    RT_DWORD          = (RT_REG_BINARY | RT_REG_DWORD),     // restrict type to *32-bit* RRF_RT_REG_BINARY or RRF_RT_REG_DWORD (other data types will not return ERROR_SUCCESS)
    RT_QWORD          = (RT_REG_BINARY | RT_REG_QWORD),     // restrict type to *64-bit* RRF_RT_REG_BINARY or RRF_RT_REG_DWORD (other data types will not return ERROR_SUCCESS)
    RT_ANY            = 0x0000ffff,                         // no type restriction
    SUBKEY_WOW6464KEY = 0x00010000,                         // when opening the subkey (if provided) force open from the 64bit location (only one SUBKEY_WOW64* flag can be set or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    SUBKEY_WOW6432KEY = 0x00020000,                         // when opening the subkey (if provided) force open from the 32bit location (only one SUBKEY_WOW64* flag can be set or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    WOW64_MASK        = 0x00030000,
    NOEXPAND          = 0x10000000,                         // do not automatically expand environment strings if value is of type REG_EXPAND_SZ
    ZEROONFAILURE     = 0x20000000,                         // if pvData is not NULL, set content to all zeros on failure
}

export const REG_CREATED_NEW_KEY              = 1
export const REG_OPENED_EXISTING_KEY          = 2
export const REG_PROCESS_APPKEY               = 0x00000001
export const REG_USE_CURRENT_SECURITY_CONTEXT = 0x00000002
export const REG_STANDARD_FORMAT              = 1
export const REG_LATEST_FORMAT                = 2
export const REG_NO_COMPRESSION               = 4

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
 * The SECURITY_DESCRIPTOR_CONTROL data type is a set of bit flags that qualify the meaning of a security descriptor or its components.
 *
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/security-descriptor-control
 */
export enum SECURITY_DESCRIPTOR_CONTROL_ {
    OWNER_DEFAULTED       = 0x0001,
    GROUP_DEFAULTED       = 0x0002,
    DACL_PRESENT          = 0x0004,
    DACL_DEFAULTED        = 0x0008,
    SACL_PRESENT          = 0x0010,
    SACL_DEFAULTED        = 0x0020,
    DACL_AUTO_INHERIT_REQ = 0x0100,
    SACL_AUTO_INHERIT_REQ = 0x0200,
    DACL_AUTO_INHERITED   = 0x0400,
    SACL_AUTO_INHERITED   = 0x0800,
    DACL_PROTECTED        = 0x1000,
    SACL_PROTECTED        = 0x2000,
    RM_CONTROL_VALID      = 0x4000,
    SELF_RELATIVE         = 0x8000,
}

/**
 * Group attributes
 */
export enum SE_GROUP_ {
    MANDATORY          = 0x00000001,
    ENABLED_BY_DEFAULT = 0x00000002,
    ENABLED            = 0x00000004,
    OWNER              = 0x00000008,
    USE_FOR_DENY_ONLY  = 0x00000010,
    INTEGRITY          = 0x00000020,
    INTEGRITY_ENABLED  = 0x00000040,
    LOGON_ID           = 0xC0000000,
    RESOURCE           = 0x20000000,

    VALID_ATTRIBUTES = (
        MANDATORY
        | ENABLED_BY_DEFAULT
        | ENABLED
        | OWNER
        | USE_FOR_DENY_ONLY
        | LOGON_ID
        | RESOURCE
        | INTEGRITY
        | INTEGRITY_ENABLED
    )
}

/**
 * Privilege Constants
 *
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/privilege-constants
 */
export enum SE_NAME {
    CREATE_TOKEN           = "SeCreateTokenPrivilege",
    ASSIGNPRIMARYTOKEN     = "SeAssignPrimaryTokenPrivilege",
    LOCK_MEMORY            = "SeLockMemoryPrivilege",
    INCREASE_QUOTA         = "SeIncreaseQuotaPrivilege",
    UNSOLICITED_INPUT      = "SeUnsolicitedInputPrivilege",
    MACHINE_ACCOUNT        = "SeMachineAccountPrivilege",
    TCB                    = "SeTcbPrivilege",
    SECURITY               = "SeSecurityPrivilege",
    TAKE_OWNERSHIP         = "SeTakeOwnershipPrivilege",
    LOAD_DRIVER            = "SeLoadDriverPrivilege",
    SYSTEM_PROFILE         = "SeSystemProfilePrivilege",
    SYSTEMTIME             = "SeSystemtimePrivilege",
    PROF_SINGLE_PROCESS    = "SeProfileSingleProcessPrivilege",
    INC_BASE_PRIORITY      = "SeIncreaseBasePriorityPrivilege",
    CREATE_PAGEFILE        = "SeCreatePagefilePrivilege",
    CREATE_PERMANENT       = "SeCreatePermanentPrivilege",
    BACKUP                 = "SeBackupPrivilege",
    RESTORE                = "SeRestorePrivilege",
    SHUTDOWN               = "SeShutdownPrivilege",
    DEBUG                  = "SeDebugPrivilege",
    AUDIT                  = "SeAuditPrivilege",
    SYSTEM_ENVIRONMENT     = "SeSystemEnvironmentPrivilege",
    CHANGE_NOTIFY          = "SeChangeNotifyPrivilege",
    REMOTE_SHUTDOWN        = "SeRemoteShutdownPrivilege",
    UNDOCK                 = "SeUndockPrivilege",
    SYNC_AGENT             = "SeSyncAgentPrivilege",
    ENABLE_DELEGATION      = "SeEnableDelegationPrivilege",
    MANAGE_VOLUME          = "SeManageVolumePrivilege",
    IMPERSONATE            = "SeImpersonatePrivilege",
    CREATE_GLOBAL          = "SeCreateGlobalPrivilege",
    TRUSTED_CREDMAN_ACCESS = "SeTrustedCredManAccessPrivilege",
    RELABEL                = "SeRelabelPrivilege",
    INC_WORKING_SET        = "SeIncreaseWorkingSetPrivilege",
    TIME_ZONE              = "SeTimeZonePrivilege",
    CREATE_SYMBOLIC_LINK   = "SeCreateSymbolicLinkPrivilege",
}

/**
 * Privilege attributes
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_privileges
 */
export enum SE_PRIVILEGE_ {
    ENABLED_BY_DEFAULT  = 0x00000001,
    ENABLED             = 0x00000002,
    REMOVED             = 0X00000004,
    USED_FOR_ACCESS     = 0x80000000,

    VALID_ATTRIBUTES    = (
        ENABLED_BY_DEFAULT
        | ENABLED
        | REMOVED
        | USED_FOR_ACCESS
    )
}

export const PRIVILEGE_SET_ALL_NECESSARY = 1

/**
 * Indicate the role of an LSA server.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ne-ntsecapi-policy_lsa_server_role
 */
export enum POLICY_LSA_SERVER_ROLE {
    PolicyServerRoleBackup = 2,
    PolicyServerRolePrimary
}

/**
 * (RID) The portion of a security identifier (SID) that identifies a user or group
 * in relation to the authority that issued the SID.
 */
export enum SECURITY_ {
    DIALUP_RID                                    = 0x00000001,
    NETWORK_RID                                   = 0x00000002,
    BATCH_RID                                     = 0x00000003,
    INTERACTIVE_RID                               = 0x00000004,
    LOGON_IDS_RID                                 = 0x00000005,
    LOGON_IDS_RID_COUNT                           = 3,
    SERVICE_RID                                   = 0x00000006,
    ANONYMOUS_LOGON_RID                           = 0x00000007,
    PROXY_RID                                     = 0x00000008,
    ENTERPRISE_CONTROLLERS_RID                    = 0x00000009,
    SERVER_LOGON_RID                              = ENTERPRISE_CONTROLLERS_RID,
    PRINCIPAL_SELF_RID                            = 0x0000000A,
    AUTHENTICATED_USER_RID                        = 0x0000000B,
    RESTRICTED_CODE_RID                           = 0x0000000C,
    TERMINAL_SERVER_RID                           = 0x0000000D,
    REMOTE_LOGON_RID                              = 0x0000000E,
    THIS_ORGANIZATION_RID                         = 0x0000000F,
    IUSER_RID                                     = 0x00000011,
    LOCAL_SYSTEM_RID                              = 0x00000012,
    LOCAL_SERVICE_RID                             = 0x00000013,
    NETWORK_SERVICE_RID                           = 0x00000014,
    NT_NON_UNIQUE                                 = 0x00000015,
    NT_NON_UNIQUE_SUB_AUTH_COUNT                  = 3,
    ENTERPRISE_READONLY_CONTROLLERS_RID           = 0x00000016,
    BUILTIN_DOMAIN_RID                            = 0x00000020,
    WRITE_RESTRICTED_CODE_RID                     = 0x00000021,
    PACKAGE_BASE_RID                              = 0x00000040,
    PACKAGE_RID_COUNT                             = 2,
    PACKAGE_NTLM_RID                              = 0x0000000A,
    PACKAGE_SCHANNEL_RID                          = 0x0000000E,
    PACKAGE_DIGEST_RID                            = 0x00000015,
    CRED_TYPE_BASE_RID                            = 0x00000041,
    CRED_TYPE_RID_COUNT                           = 2,
    CRED_TYPE_THIS_ORG_CERT_RID                   = 0x00000001,
    MIN_BASE_RID                                  = 0x00000050,
    SERVICE_ID_BASE_RID                           = 0x00000050,
    SERVICE_ID_RID_COUNT                          = 6,
    RESERVED_ID_BASE_RID                          = 0x00000051,
    APPPOOL_ID_BASE_RID                           = 0x00000052,
    APPPOOL_ID_RID_COUNT                          = 6,
    VIRTUALSERVER_ID_BASE_RID                     = 0x00000053,
    VIRTUALSERVER_ID_RID_COUNT                    = 6,
    USERMODEDRIVERHOST_ID_BASE_RID                = 0x00000054,
    USERMODEDRIVERHOST_ID_RID_COUNT               = 6,
    CLOUD_INFRASTRUCTURE_SERVICES_ID_BASE_RID     = 0x00000055,
    CLOUD_INFRASTRUCTURE_SERVICES_ID_RID_COUNT    = 6,
    WMIHOST_ID_BASE_RID                           = 0x00000056,
    WMIHOST_ID_RID_COUNT                          = 6,
    TASK_ID_BASE_RID                              = 0x00000057,
    NFS_ID_BASE_RID                               = 0x00000058,
    COM_ID_BASE_RID                               = 0x00000059,
    WINDOW_MANAGER_BASE_RID                       = 0x0000005A,
    RDV_GFX_BASE_RID                              = 0x0000005B,
    DASHOST_ID_BASE_RID                           = 0x0000005C,
    DASHOST_ID_RID_COUNT                          = 6,
    USERMANAGER_ID_BASE_RID                       = 0x0000005D,
    USERMANAGER_ID_RID_COUNT                      = 6,
    WINRM_ID_BASE_RID                             = 0x0000005E,
    WINRM_ID_RID_COUNT                            = 6,
    CCG_ID_BASE_RID                               = 0x0000005F,
    UMFD_BASE_RID                                 = 0x00000060,
    UNIQUIFIED_SERVICE_BASE_RID                   = 0x00000061,
    VIRTUALACCOUNT_ID_RID_COUNT                   = 6,
    EDGE_CLOUD_INFRASTRUCTURE_SERVICE_ID_BASE_RID = 0x00000062,
    RESTRICTED_SERVICES_BASE_RID                  = 0x00000063,
    RESTRICTED_SERVICES_RID_COUNT                 = 6,
    //
    // Virtual account logon is not limited to inbox callers.  Reserve base RID 0x6F for application usage.
    //
    MAX_BASE_RID                                  = 0x0000006F,
    MAX_ALWAYS_FILTERED                           = 0x000003E7,
    MIN_NEVER_FILTERED                            = 0x000003E8,
    OTHER_ORGANIZATION_RID                        = 0x000003E8,
    //
    //Service SID type RIDs are in the range 0x50- 0x6F.  Therefore, we are giving  the next available RID to Windows Mobile team.
    //
    WINDOWSMOBILE_ID_BASE_RID                     = 0x00000070,
    //
    // Installer Capability Group Sid related. Currently Base RID is same as LOCAL DOMAIN.
    //
    INSTALLER_GROUP_CAPABILITY_BASE               = 0x20,
    INSTALLER_GROUP_CAPABILITY_RID_COUNT          = 9,
    // Note: This is because the App Capability Rid is S-1-15-3-1024-...
    //       whereas the service group rid is          S-1-5-32-...
    //	The number of RIDs from hash (8) are the same for both
    INSTALLER_CAPABILITY_RID_COUNT                = 10,
    //
    //Well-known group for local accounts
    //
    LOCAL_ACCOUNT_RID                             = 0x00000071,
    LOCAL_ACCOUNT_AND_ADMIN_RID                   = 0x00000072,
}

/**
 * Token Specific Access Rights.
 */
export enum TOKEN_ {
    ASSIGN_PRIMARY    = 0x0001,
    DUPLICATE         = 0x0002,
    IMPERSONATE       = 0x0004,
    QUERY             = 0x0008,
    QUERY_SOURCE      = 0x0010,
    ADJUST_PRIVILEGES = 0x0020,
    ADJUST_GROUPS     = 0x0040,
    ADJUST_DEFAULT    = 0x0080,
    ADJUST_SESSIONID  = 0x0100,

    ALL_ACCESS = ACCESS_MASK.STANDARD_RIGHTS_REQUIRED
                 | ASSIGN_PRIMARY
                 | DUPLICATE | IMPERSONATE | QUERY | QUERY_SOURCE
                 | ADJUST_PRIVILEGES | ADJUST_GROUPS | ADJUST_DEFAULT
}

/**
 * The TOKEN_ELEVATION_TYPE enumeration indicates the elevation type of token being queried by the GetTokenInformation() function.
 */
export enum TOKEN_ELEVATION_TYPE {
    TokenElevationTypeDefault = 1,
    TokenElevationTypeFull,
    TokenElevationTypeLimited
}

/**
 * Token information class values for GetTokenInformation() and SetTokenInformation().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-token_information_class
 */
export enum TOKEN_INFORMATION_CLASS {
    TokenUser = 1,
    TokenGroups,
    TokenPrivileges,
    TokenOwner,
    TokenPrimaryGroup,
    TokenDefaultDacl,
    TokenSource,
    TokenType,
    TokenImpersonationLevel,
    TokenStatistics,
    TokenRestrictedSids,
    TokenSessionId,
    TokenGroupsAndPrivileges,
    /** @deprecated */TokenSessionReference,
    TokenSandBoxInert,
    /** @deprecated */TokenAuditPolicy,
    TokenOrigin,
    TokenElevationType,
    TokenLinkedToken,
    TokenElevation,
    TokenHasRestrictions,
    TokenAccessInformation,
    TokenVirtualizationAllowed,
    TokenVirtualizationEnabled,
    TokenIntegrityLevel,
    TokenUIAccess,
    TokenMandatoryPolicy,
    TokenLogonSid,
    TokenIsAppContainer,
    TokenCapabilities,
    TokenAppContainerSid,
    TokenAppContainerNumber,
    TokenUserClaimAttributes,
    TokenDeviceClaimAttributes,
    /** @deprecated */TokenRestrictedUserClaimAttributes,
    /** @deprecated */TokenRestrictedDeviceClaimAttributes,
    TokenDeviceGroups,
    TokenRestrictedDeviceGroups,
    /** @deprecated */TokenSecurityAttributes,
    /** @deprecated */TokenIsRestricted,
    /** @deprecated */TokenProcessTrustLevel,
    /** @deprecated */TokenPrivateNameSpace,
    /** @deprecated */TokenSingletonAttributes,
    /** @deprecated */TokenBnoIsolation,
    /** @deprecated */TokenChildProcessFlags,
    /** @deprecated */TokenIsLessPrivilegedAppContainer,
    /** @deprecated */TokenIsSandboxed,
    /** @deprecated */TokenIsAppSilo,
    /** @deprecated */TokenLastEnforce = TokenIsAppSilo
}

export enum TOKEN_TYPE {
    TokenPrimary = 1,
    TokenImpersonation
}

export const SECURITY_NULL_SID_AUTHORITY         = [ 0, 0, 0, 0, 0,  0 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_WORLD_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  1 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_LOCAL_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  2 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_CREATOR_SID_AUTHORITY      = [ 0, 0, 0, 0, 0,  3 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NON_UNIQUE_AUTHORITY       = [ 0, 0, 0, 0, 0,  4 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NT_AUTHORITY               = [ 0, 0, 0, 0, 0,  5 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_RESOURCE_MANAGER_AUTHORITY = [ 0, 0, 0, 0, 0,  9 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_APP_PACKAGE_AUTHORITY      = [ 0, 0, 0, 0, 0, 15 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_MANDATORY_LABEL_AUTHORITY  = [ 0, 0, 0, 0, 0, 16 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_SCOPED_POLICY_ID_AUTHORITY = [ 0, 0, 0, 0, 0, 17 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_AUTHENTICATION_AUTHORITY   = [ 0, 0, 0, 0, 0, 18 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_PROCESS_TRUST_AUTHORITY    = [ 0, 0, 0, 0, 0, 19 ] as const satisfies SID_IDENTIFIER_AUTHORITY

/**
 * The SECURITY_IMPERSONATION_LEVEL enumeration contains values that specify security impersonation levels.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-security_impersonation_level
 */
export enum SECURITY_IMPERSONATION_LEVEL {
    SecurityAnonymous,
    SecurityIdentification,
    SecurityImpersonation,
    SecurityDelegation
}

/**
 * The SID_NAME_USE enumeration contains values that specify the type of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-sid_name_use
 */
export enum SID_NAME_USE {
    SidTypeUser = 1,
    SidTypeGroup,
    SidTypeDomain,
    SidTypeAlias,
    SidTypeWellKnownGroup,
    SidTypeDeletedAccount,
    SidTypeInvalid,
    SidTypeUnknown,
    SidTypeComputer,
    SidTypeLabel,
    SidTypeLogonSession
}

/**
 * Reserved Registry Key Handles.
 */
export enum HKEY_ {
    CLASSES_ROOT                = 0x80000000,
    CURRENT_USER                = 0x80000001,
    LOCAL_MACHINE               = 0x80000002,
    USERS                       = 0x80000003,
    PERFORMANCE_DATA            = 0x80000004,
    PERFORMANCE_TEXT            = 0x80000050,
    PERFORMANCE_NLSTEXT         = 0x80000060,
    CURRENT_CONFIG              = 0x80000005,
    DYN_DATA                    = 0x80000006,
    CURRENT_USER_LOCAL_SETTINGS = 0x80000007,
}

/**
 * Registry Specific Access Rights.
 *
 * https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry-key-security-and-access-rights
 */
export enum KEY_ {
    QUERY_VALUE          = 0x0001,
    SET_VALUE            = 0x0002,
    CREATE_SUB_KEY       = 0x0004,
    ENUMERATE_SUB_KEYS   = 0x0008,
    NOTIFY               = 0x0010,
    CREATE_LINK          = 0x0020,
    WOW64_64KEY          = 0x0100,
    WOW64_32KEY          = 0x0200,
    WOW64_RES            = 0x0300,

    READ = (
        (ACCESS_MASK.STANDARD_RIGHTS_READ | QUERY_VALUE | ENUMERATE_SUB_KEYS | NOTIFY)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),

    WRITE = (
        (ACCESS_MASK.STANDARD_RIGHTS_WRITE | SET_VALUE | CREATE_SUB_KEY)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),

    EXECUTE = (
        (READ)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),

    ALL_ACCESS = (
        (ACCESS_MASK.STANDARD_RIGHTS_ALL | QUERY_VALUE | SET_VALUE | CREATE_SUB_KEY | ENUMERATE_SUB_KEYS | NOTIFY | CREATE_LINK)
        & (~ACCESS_MASK.SYNCHRONIZE)
    )
}
