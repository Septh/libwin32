import { Union } from 'koffi'
import type { LUID } from '../../misc/types.js'
import type { SID } from '../sid/types.js'
import {
    ACL_REVISION, SIZEOF_SECURITY_ATTRIBUTES,
    type CLAIM_SECURITY_ATTRIBUTE_, type CLAIM_SECURITY_ATTRIBUTE_TYPE_, type SECURITY_DESCRIPTOR_CONTROL_
} from './consts.js'

/**
 * The ACL structure is the header of an access control list (ACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-acl
 */
export class ACL {
    readonly AclRevision = ACL_REVISION
    public AceCount = 0
    public AclSize = 0
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
 * The LUID_AND_ATTRIBUTES structure represents a locally unique identifier (LUID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid_and_attributes
 */
export interface LUID_AND_ATTRIBUTES {
    Luid: LUID
    Attributes: number
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
    public lpSecurityDescriptor: SECURITY_DESCRIPTOR | null = null
    public bInheritHandle:       number                     = 0
}
