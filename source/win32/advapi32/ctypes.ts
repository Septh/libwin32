import koffi from 'koffi'
import {
    Internals,
    cBOOL, cINT, cCHAR, cBYTE,
    cWORD, cLONG, cULONG, cLONGLONG,
    cUSHORT, cDWORD, cDWORD64, cLONG64,
    cSTR, cPVOID, cHANDLE
} from '../internals.js'
import { cGUID } from '../misc/ctypes.js'

export const cACL = koffi.struct({
    AclRevision: cBYTE,
    Sbsz1:       cBYTE,
    AclSize:     cWORD,
    AceCount:    cWORD,
    Sbsz2:       cWORD
})

export const cLUID = koffi.struct({
    LowPart: cDWORD,
    HighPart: cLONG
})

export const cLUID_AND_ATTRIBUTES = koffi.struct({
    Luid: cLUID,
    Attributes: cDWORD
})

export const cLSA_UNICODE_STRING = koffi.struct({
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cSTR
})

export const cSID_IDENTIFIER_AUTHORITY = koffi.array(cBYTE, 6, 'Array')

export const cSID = koffi.struct({
    Revision:            cBYTE,
    SubAuthorityCount:   cBYTE,
    IdentifierAuthority: cSID_IDENTIFIER_AUTHORITY,
    SubAuthority:        koffi.array(cDWORD, 'SubAuthorityCount', Internals.SID_MAX_SUB_AUTHORITIES, 'Array')
}), cPSID = koffi.pointer(cSID)

export const cSID_AND_ATTRIBUTES = koffi.struct({
    Sid: cPSID,
    Attributes: cDWORD
})

export const cSID_AND_ATTRIBUTES_HASH = koffi.struct({
    SidCount: cDWORD,
    SidAttr:  koffi.pointer(null, cSID_AND_ATTRIBUTES, 'SidCount'),
    Hash:     koffi.array(cPVOID, Internals.SID_HASH_SIZE)
})

export const cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE = koffi.struct({
    Version: cDWORD64,
    Name:    cSTR
})

export const cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE = koffi.struct({
    pValue:      cPVOID,
    ValueLength: cDWORD
})

export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct({
    Name:       cSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     koffi.union('CSA_V1_Values', {
        pInt64:        koffi.pointer(cLONG64, Internals.ANYSIZE_ARRAY),
        pUint64:       koffi.pointer(cDWORD64, Internals.ANYSIZE_ARRAY),
        ppString:      koffi.pointer(cSTR, Internals.ANYSIZE_ARRAY),
        pFqbn:         koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE, Internals.ANYSIZE_ARRAY),
        pOctectString: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE, Internals.ANYSIZE_ARRAY)
    })
})

export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.struct({
    Version:        cWORD,
    Reserved:       cWORD,
    AttributeCount: cDWORD,
    Attribute:      koffi.struct({  // Should be a union, but since there is only one member...
        pAttributeV1: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_V1, Internals.ANYSIZE_ARRAY)
    })
})

export const cLSA_TRANSLATED_SID2 = koffi.struct({
    Use: cINT,
    Sid: cPSID,
    DomainIndex: cLONG,
    Flags: cULONG
})

export const cLSA_OBJECT_ATTRIBUTES = koffi.struct({
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})

export const SIZEOF_LSA_OBJECT_ATTRIBUTES = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)

export const cLSA_TRUST_INFORMATION = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})

export const cLSA_REFERENCED_DOMAIN_LIST = koffi.struct({
    Entries: cULONG,
    Domains: koffi.pointer(null, cLSA_TRUST_INFORMATION, 'Entries')
})

export const cTOKEN_APPCONTAINER_INFORMATION = koffi.struct({
    TokenAppContainer: cPSID
})

export const cTOKEN_DEFAULT_DACL = koffi.struct({
    DefaultDacl: koffi.pointer(cACL)
})

export const cTOKEN_ELEVATION = koffi.struct({
    TokenIsElevated: cDWORD
})

export const cTOKEN_GROUPS = koffi.struct({
    GroupCount: cDWORD,
    Groups: koffi.array(cSID_AND_ATTRIBUTES, 'GroupCount', Internals.TOKEN_GROUPS_MAX_GROUPS)
})

export const cTOKEN_GROUPS_AND_PRIVILEGES = koffi.struct({
    SidCount:            cDWORD,
    SidLength:           cDWORD,
    Sids:                koffi.pointer(null, cSID_AND_ATTRIBUTES, 'SidCount'),
    RestrictedSidCount:  cDWORD,
    RestrictedSidLength: cDWORD,
    RestrictedSids:      koffi.pointer(null, cSID_AND_ATTRIBUTES, 'RestrictedSidCount'),
    PrivilegeCount:      cDWORD,
    PrivilegeLength:     cDWORD,
    Privileges:          koffi.pointer(null, cLUID_AND_ATTRIBUTES, 'PrivilegeCount'),
    AuthenticationId:    cLUID,
})

export const cTOKEN_LINKED_TOKEN = koffi.struct({
    LinkedToken: cHANDLE
})

export const cTOKEN_MANDATORY_LABEL = koffi.struct({
    Label: cSID_AND_ATTRIBUTES
})

export const cTOKEN_MANDATORY_POLICY = koffi.struct({
    Policy: cDWORD
})

export const cTOKEN_ORIGIN = koffi.struct({
    OriginatingLogonSession: cLUID
})

export const cTOKEN_OWNER = koffi.struct({
    Owner: cPSID
})

export const cTOKEN_PRIMARY_GROUP = koffi.struct({
    PrimaryGroup: cPSID
})

export const cTOKEN_PRIVILEGES = koffi.struct({
    PrivilegeCount: cDWORD,
    Privileges: koffi.array(cLUID_AND_ATTRIBUTES, 'PrivilegeCount', Internals.TOKEN_PRIVILEGES_MAX_PRIVILEGES)
})

export const cTOKEN_SOURCE = koffi.struct({
    SourceName: koffi.array(cCHAR, Internals.TOKEN_SOURCE_LENGTH, 'String'),
    SourceIdentifier: cLUID
})

export const cTOKEN_STATISTICS = koffi.struct({
  TokenId:            cLUID,
  AuthenticationId:   cLUID,
  ExpirationTime:     cLONGLONG,
  TokenType:          cLONG,
  ImpersonationLevel: cLONG,
  DynamicCharged:     cDWORD,
  DynamicAvailable:   cDWORD,
  GroupCount:         cDWORD,
  PrivilegeCount:     cDWORD,
  ModifiedId:         cLUID,
})

export const cTOKEN_USER = koffi.struct({
    User: cSID_AND_ATTRIBUTES
})

export const cTOKEN_ACCESS_INFORMATION = koffi.struct({
    SidHash:            koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    RestrictedSidHash:  koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    Privileges:         koffi.pointer(cTOKEN_PRIVILEGES),
    AuthenticationId:   cLUID,
    TokenType:          cDWORD,
    ImpersonationLevel: cDWORD,
    MandatoryPolicy:    cTOKEN_MANDATORY_POLICY,
    Flags:              cDWORD,
    AppContainerNumber: cDWORD,
    PackageSid:         cPSID,
    CapabilitiesHash:   koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    TrustLevelSid:      cPSID,
    SecurityAttributes: cPVOID,
})

export const cPOLICY_ACCOUNT_DOMAIN_INFO = koffi.struct({
    DomainName: cLSA_UNICODE_STRING,
    DomainSid: cPSID
})

export const cPOLICY_AUDIT_EVENTS_INFO = koffi.struct({
    AuditingMode: cBOOL,
    EventAuditingOptions: koffi.pointer(null, cULONG, 'MaximumAuditEventCount'),
    MaximumAuditEventCount: cULONG
})

export const cPOLICY_LSA_SERVER_ROLE_INFO = koffi.struct({
    LsaServerRole: cINT
})

export const cPOLICY_MODIFICATION_INFO = koffi.struct({
    ModifiedId: cLONGLONG,
    DatabaseCreationTime: cLONGLONG
})

export const cPOLICY_PRIMARY_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})

export const cPOLICY_DNS_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    DnsDomainName: cLSA_UNICODE_STRING,
    DnsForestName: cLSA_UNICODE_STRING,
    DomainGuid: cGUID,
    Sid: cPSID
})

export const cPRIVILEGE_SET = koffi.struct({
    PrivilegeCount: cDWORD,
    Control:        cDWORD,
    Privilege:      koffi.array(cLUID_AND_ATTRIBUTES, 'PrivilegeCount', Internals.TOKEN_PRIVILEGES_SET_MAX_PRIVILEGES)
})

export const cSECURITY_DESCRIPTOR = koffi.struct({
    Revision: cBYTE,
    Sbsz1:    cBYTE,
    Control:  cWORD,
    Owner:    cPSID,
    Group:    cPSID,
    Sacl:     koffi.pointer(cACL),
    Dacl:     koffi.pointer(cACL)
})

export const cSECURITY_ATTRIBUTES = koffi.struct({
    nLength:              cDWORD,
    lpSecurityDescriptor: koffi.pointer(cSECURITY_DESCRIPTOR),
    bInheritHandle:       cBOOL
})

export const SIZEOF_SECURITY_ATTRIBUTES = koffi.sizeof(cSECURITY_ATTRIBUTES)

export const cVALENT = koffi.struct({
    ve_valuename: cSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cPVOID,
    ve_type:      cDWORD
})
