import assert from 'node:assert'
import { Union } from 'koffi'
import { Internals, textDecoder, type __HANDLE__, type HANDLE } from '../internals.js'
import type { GUID, LUID, LUID_AND_ATTRIBUTES } from '../misc/types.js'
import { SIZEOF_LSA_OBJECT_ATTRIBUTES, SIZEOF_SECURITY_ATTRIBUTES } from './ctypes.js'
import type {
    CLAIM_SECURITY_ATTRIBUTE_, CLAIM_SECURITY_ATTRIBUTE_TYPE_,
    POLICY_AUDIT_EVENT_, POLICY_LSA_SERVER_ROLE,
    REG_,
    SECURITY_DESCRIPTOR_CONTROL_, SECURITY_IMPERSONATION_LEVEL,
    SID_NAME_USE,
    TOKEN_TYPE
} from './consts.js'

export type HKEY       = __HANDLE__<'HKEY'>
export type HTOKEN     = __HANDLE__<'ACCESS_TOKEN'>
export type LSA_HANDLE = __HANDLE__<'LSA_HANDLE'>

/**
 * The ACL structure is the header of an access control list (ACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-acl
 */
export class ACL {
    readonly AclRevision = Internals.ACL_REVISION
    public AceCount = 0
    public AclSize = 0
}

export const ACL_REVISION = Internals.ACL_REVISION

/**
 * The security identifier (SID) structure is a variable-length structure used to uniquely identify users or groups.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid
 */
export class SID {
    readonly Revision = Internals.SID_REVISION
    public SubAuthorityCount!: number
    public SubAuthority!: number[]
    public IdentifierAuthority!: SID_IDENTIFIER_AUTHORITY
}

export const SID_REVISION = Internals.SID_REVISION

/**
 * The SID_IDENTIFIER_AUTHORITY structure represents the top-level authority of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_identifier_authority
 */
export type SID_IDENTIFIER_AUTHORITY = [ number, number, number, number, number, number ]

/**
 * The SID_AND_ATTRIBUTES structure represents a security identifier (SID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes
 */
export interface SID_AND_ATTRIBUTES {
    Sid: SID
    Attributes: number
}

/**
 * The SID_AND_ATTRIBUTES_HASH structure specifies a hash values for the specified array of security identifiers (SIDs).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes_hash
 */
export interface SID_AND_ATTRIBUTES_HASH {
    SidCount: number
    SidAttr:  SID_AND_ATTRIBUTES[]
    Hash:     readonly unknown[]
}

/**
 * The CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE structure specifies the fully qualified binary name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_fqbn_value
 */
export interface CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE {
    Version: bigint
    Name:    String
}

/**
 * The CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE structure specifies the OCTET_STRING value type of the claim security attribute.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_octet_string_value
 */
export interface CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE {
    pValue:      bigint
    ValueLength: number
}

/**
 * The CLAIM_SECURITY_ATTRIBUTE_V1 structure defines a security attribute that can be associated with a token or authorization context.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_v1
 */
export class CLAIM_SECURITY_ATTRIBUTE_V1 {
    public Name!: string
    public ValueType!: CLAIM_SECURITY_ATTRIBUTE_TYPE_
    public Flags!: CLAIM_SECURITY_ATTRIBUTE_
    public ValueCount!: number
    public Values = new Union('CSA_V1_Values') as {
        pInt64?:       bigint[]
        pUint64?:      bigint[]
        ppString?:     string[]
        pFqbn?:        CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE[]
        pOctetString?: CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE[]
    }
}

/**
 * The CLAIM_SECURITY_ATTRIBUTES_INFORMATION structure defines the security attributes for the claim.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attributes_information
 */
export interface CLAIM_SECURITY_ATTRIBUTES_INFORMATION {
    Version: number
    Reserved: 0
    AttributeCount: number
    Attribute: { pAttributeV1: CLAIM_SECURITY_ATTRIBUTE_V1[] | null }
}

/**
 * Used by various Local Security Authority (LSA) functions to specify a Unicode string.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_unicode_string
 */
export class LSA_UNICODE_STRING {
    readonly Length: number         // in bytes
    readonly MaximumLength: number  // in bytes
    readonly Buffer: Uint16Array

    constructor(maxBytes: number)
    constructor(string: string, maxBytes?: number)
    constructor(strOrLen: string | number, maxBytes?: number) {

        if (typeof strOrLen === 'string') {
            this.Length = strOrLen.length * Uint16Array.BYTES_PER_ELEMENT
            this.MaximumLength = maxBytes ?? this.Length
            assert(this.Length <= this.MaximumLength)

            this.Buffer = new Uint16Array(this.MaximumLength / Uint16Array.BYTES_PER_ELEMENT)
            for (let i = 0; i < strOrLen.length; i++)
                this.Buffer[i] = strOrLen.charCodeAt(i)
        }
        else {
            this.Length = this.MaximumLength = strOrLen
            this.Buffer = new Uint16Array(this.MaximumLength / Uint16Array.BYTES_PER_ELEMENT)
        }
    }

    toString() {
        return textDecoder.decode(this.Buffer.subarray(0, this.Length / Uint16Array.BYTES_PER_ELEMENT))
    }
}

/**
 * Contains SIDs that are retrieved based on account names.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_translated_sid2
 */
export interface LSA_TRANSLATED_SID2 {
    Use: SID_NAME_USE
    Sid: SID,
    DomainIndex: number
    Flags: number
}

/**
 * Used with the LsaOpenPolicy function to specify the attributes of the connection to the Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_object_attributes
 */
export class LSA_OBJECT_ATTRIBUTES {
    readonly Length = SIZEOF_LSA_OBJECT_ATTRIBUTES
    constructor(
        public RootDirectory:            HANDLE              = null!,
        public ObjectName:               LSA_UNICODE_STRING  = null!,
        public Attributes:               number              = 0,
        public SecurityDescriptor:       SECURITY_DESCRIPTOR = null!,
        public SecurityQualityOfService: unknown             = null,     // TODO: SECURITY_QUALITY_OF_SERVICE
    ) {}
}

/**
 * Identifies a domain.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_trust_information
 */
export interface LSA_TRUST_INFORMATION {
    Name: LSA_UNICODE_STRING
    Sid: SID
}

export type TRUSTED_DOMAIN_INFORMATION_BASIC = LSA_TRUST_INFORMATION

/**
 *  Contains information about the domains referenced in a lookup operation.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_referenced_domain_list
 */
export interface LSA_REFERENCED_DOMAIN_LIST {
    Entries: number
    Domains: LSA_TRUST_INFORMATION[]
}

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

/**
 * Used to set and query the name and SID of the system's account domain.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-policy_account_domain_info
 */
export interface POLICY_ACCOUNT_DOMAIN_INFO {
    DomainName: LSA_UNICODE_STRING
    DomainSid: SID
}

/**
 * Used to set and query the system's auditing rules.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_audit_events_info
 */
export interface POLICY_AUDIT_EVENTS_INFO {
    AuditingMode: boolean
    EventAuditingOptions: POLICY_AUDIT_EVENT_[]
    MaximumAuditEventCount: number
}

/**
 * Used to set and query the role of an LSA server.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_lsa_server_role_info
 */
export interface POLICY_LSA_SERVER_ROLE_INFO {
    LsaServerRole: POLICY_LSA_SERVER_ROLE
}

/**
 * Used to query information about the creation time and last modification of the LSA database.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_modification_info
 */
export interface POLICY_MODIFICATION_INFO {
    ModifiedId: number | bigint
    DatabaseCreationTime: number | bigint
}

/**
 * The `PolicyPrimaryDomainInformation` value and `POLICY_PRIMARY_DOMAIN_INFO` structure are obsolete,
 * use `PolicyDnsDomainInformation` and the {@link POLICY_DNS_DOMAIN_INFO} structure instead.
 */
export interface POLICY_PRIMARY_DOMAIN_INFO {
    Name: LSA_UNICODE_STRING
    Sid: SID
}

/**
 * Used to set and query Domain Name System (DNS) information about the primary domain associated with a Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-policy_dns_domain_info
 */
export interface POLICY_DNS_DOMAIN_INFO {
    Name: LSA_UNICODE_STRING
    DnsDomainName: LSA_UNICODE_STRING
    DnsForestName: LSA_UNICODE_STRING
    DomainGuid: GUID
    Sid: SID
}

/**
 * Privilege Set - This is defined for a privilege set of one.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-privilege_set
 */
export interface PRIVILEGE_SET {
    PrivilegeCount: number
    Control:        number
    Privilege:      LUID_AND_ATTRIBUTES[]
}

/**
 * The SECURITY_DESCRIPTOR structure contains the security information associated with an object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-security_descriptor
 */
export interface SECURITY_DESCRIPTOR {
    Revision: number
    Sbsz1:    number
    Control:  SECURITY_DESCRIPTOR_CONTROL_
    Owner:    SID
    Group:    SID
    Sacl:     ACL
    Dacl:     ACL
}

/**
 * The SECURITY_ATTRIBUTES structure contains the security descriptor for an object and specifies whether the handle retrieved by specifying this structure is inheritable.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/wtypesbase/ns-wtypesbase-security_attributes
 */
export class SECURITY_ATTRIBUTES {
    readonly nLength = SIZEOF_SECURITY_ATTRIBUTES
    constructor(
        public lpSecurityDescriptor: SECURITY_DESCRIPTOR | null = null,
        public bInheritHandle:       number                     = 0,
    ) {}
}

/**
 * Contains information about a registry value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/ns-winreg-valentw
 */
export interface VALENT {
    ve_valuename: string
    ve_valuelen:  number
    ve_valueptr:  any
    ve_type:      REG_
}
