import koffi from 'koffi'
import { Internals } from '../../internals.js'
import { cSECURITY_ATTRIBUTES } from './ctypes.js'

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
 * CLAIM_SECURITY_ATTRIBUTE_V1 flags.
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
 * CLAIM_SECURITY_ATTRIBUTE_V1 attributes.
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
 * Specifies a format for a directory service object name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/secext/ne-secext-extended_name_format
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

    MAX_BASE_RID                                  = 0x0000006F,
    MAX_ALWAYS_FILTERED                           = 0x000003E7,
    MIN_NEVER_FILTERED                            = 0x000003E8,
    OTHER_ORGANIZATION_RID                        = 0x000003E8,

    WINDOWSMOBILE_ID_BASE_RID                     = 0x00000070,

    INSTALLER_GROUP_CAPABILITY_BASE               = 0x20,
    INSTALLER_GROUP_CAPABILITY_RID_COUNT          = 9,
    INSTALLER_CAPABILITY_RID_COUNT                = 10,

    LOCAL_ACCOUNT_RID                             = 0x00000071,
    LOCAL_ACCOUNT_AND_ADMIN_RID                   = 0x00000072,
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

export const ACL_REVISION    = Internals.ACL_REVISION
export const ACL_REVISION_DS = Internals.ACL_REVISION_DS

export const SIZEOF_SECURITY_ATTRIBUTES = koffi.sizeof(cSECURITY_ATTRIBUTES)
export const PRIVILEGE_SET_ALL_NECESSARY = 1

export const CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION = Internals.CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1
