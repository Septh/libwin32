import type { __HANDLE__ } from '../../internals.js'
import type { LUID } from '../../misc/types.js'
import type { LUID_AND_ATTRIBUTES } from '../security/types.js'
import type { SECURITY_IMPERSONATION_LEVEL } from '../security/consts.js'
import type { ACL } from '../security/types.js'
import type { SID, SID_AND_ATTRIBUTES, SID_AND_ATTRIBUTES_HASH } from '../sid/types.js'
import type { TOKEN_TYPE } from './consts.js'

export type HTOKEN = __HANDLE__<'ACCESS_TOKEN'>

/**
 * The TOKEN_APPCONTAINER_INFORMATION structure specifies all the information in a token that is necessary for an app container.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_appcontainer_information
 */
export interface TOKEN_APPCONTAINER_INFORMATION {
    TokenAppContainer: SID | null
}

/**
 * The TOKEN_DEFAULT_DACL structure specifies a discretionary access control list (DACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_default_dacl
 */
export interface TOKEN_DEFAULT_DACL {
    DefaultDacl: ACL | null
}

/**
 * The TOKEN_ELEVATION structure indicates whether a token has elevated privileges.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_elevation
 */
export interface TOKEN_ELEVATION {
    TokenIsElevated: number
}

/**
 * The TOKEN_GROUPS structure contains information about the group security identifiers (SIDs) in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_groups
 */
export interface TOKEN_GROUPS {
    GroupCount: number
    Groups: SID_AND_ATTRIBUTES[]
}

/**
 * The TOKEN_GROUPS_AND_PRIVILEGES structure contains information about the group security identifiers (SIDs) and privileges in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_groups_and_privileges
 */
export interface TOKEN_GROUPS_AND_PRIVILEGES {
    SidCount:            number,
    SidLength:           number,
    Sids:                SID_AND_ATTRIBUTES[],
    RestrictedSidCount:  number,
    RestrictedSidLength: number,
    RestrictedSids:      SID_AND_ATTRIBUTES[],
    PrivilegeCount:      number,
    PrivilegeLength:     number,
    Privileges:          LUID_AND_ATTRIBUTES[],
    AuthenticationId:    LUID,
}

/**
 * The TOKEN_LINKED_TOKEN structure contains a handle to a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_linked_token
 */
export interface TOKEN_LINKED_TOKEN {
    LinkedToken: HTOKEN
}

/**
 * The TOKEN_MANDATORY_LABEL structure specifies the mandatory integrity level for a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_mandatory_label
 */
export interface TOKEN_MANDATORY_LABEL {
    Label: SID_AND_ATTRIBUTES
}

/**
 * The TOKEN_MANDATORY_POLICY structure specifies the mandatory integrity policy for a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_mandatory_policy
 */
export interface TOKEN_MANDATORY_POLICY {
    Policy: number
}

/**
 * The TOKEN_ORIGIN structure contains information about the origin of the logon session.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_origin
 */
export interface TOKEN_ORIGIN {
    OriginatingLogonSession: LUID
}

/**
 * The TOKEN_OWNER structure contains the default owner security identifier (SID) that will be applied to newly created objects.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_owner
 */
export interface TOKEN_OWNER {
    Owner: SID
}

/**
 * The TOKEN_PRIMARY_GROUP structure specifies a group security identifier (SID) for an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_primary_group
 */
export interface TOKEN_PRIMARY_GROUP {
    PrimaryGroup: SID
}

/**
 * The TOKEN_PRIVILEGES structure contains information about a set of privileges for an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_privileges
 */
export interface TOKEN_PRIVILEGES {
    PrivilegeCount: number
    Privileges: LUID_AND_ATTRIBUTES[]
}

/**
 * The TOKEN_SOURCE structure identifies the source of an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_source
 */
export interface TOKEN_SOURCE {
    SourceName: string
    SourceIdentifier: LUID
}

/**
 * The TOKEN_STATISTICS structure contains information about an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_statistics
 */
export interface TOKEN_STATISTICS {
    TokenId:            LUID
    AuthenticationId:   LUID
    ExpirationTime:     bigint
    TokenType:          TOKEN_TYPE
    ImpersonationLevel: SECURITY_IMPERSONATION_LEVEL
    DynamicCharged:     number
    DynamicAvailable:   number
    GroupCount:         number
    PrivilegeCount:     number
    ModifiedId:         LUID
}

/**
 * The TOKEN_USER structure identifies the user associated with an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_user
 */
export interface TOKEN_USER {
    User: SID_AND_ATTRIBUTES
}

/**
 * The TOKEN_ACCESS_INFORMATION structure specifies all the information in a token that is necessary to perform an access check.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_access_information
 */
export interface TOKEN_ACCESS_INFORMATION {
    SidHash:            SID_AND_ATTRIBUTES_HASH
    RestrictedSidHash:  SID_AND_ATTRIBUTES_HASH
    Privileges:         TOKEN_PRIVILEGES
    AuthenticationId:   LUID
    TokenType:          TOKEN_TYPE
    ImpersonationLevel: SECURITY_IMPERSONATION_LEVEL
    MandatoryPolicy:    TOKEN_MANDATORY_POLICY
    Flags:              0       // Reserved, must be 0
    AppContainerNumber: number
    PackageSid:         SID | null
    CapabilitiesHash:   SID_AND_ATTRIBUTES_HASH
    TrustLevelSid:      SID | null
    SecurityAttributes: null    // Reserved, must be null
}
