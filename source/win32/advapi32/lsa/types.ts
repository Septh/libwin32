import assert from 'node:assert'
import { textDecoder, type __HANDLE__, type HANDLE } from '../../internals.js'
import type { GUID } from '../../chore/types.js'
import type { SECURITY_DESCRIPTOR } from '../security/types.js'
import type { SID } from '../sid/types.js'
import type { SID_NAME_USE } from '../sid/consts.js'
import { SIZEOF_LSA_OBJECT_ATTRIBUTES, type POLICY_AUDIT_EVENT_, type POLICY_LSA_SERVER_ROLE } from './consts.js'

export type LSA_HANDLE = __HANDLE__<'LSA_HANDLE'>

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
 *  Contains information about the domains referenced in a lookup operation.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_referenced_domain_list
 */
export interface LSA_REFERENCED_DOMAIN_LIST {
    Entries: number
    Domains: LSA_TRUST_INFORMATION[]
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

export type POLICY_AUDIT_EVENT_OPTIONS = number

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
