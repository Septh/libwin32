import koffi from 'koffi'
import {
    Internals,
    cCHAR, cDWORD, cHANDLE, cLONG, cLONGLONG, cP_VOID
} from '../../internals.js'
import { cLUID } from '../../chore/ctypes.js'
import { cACL, cLUID_AND_ATTRIBUTES } from '../security/ctypes.js'
import { cPSID, cSID_AND_ATTRIBUTES, cSID_AND_ATTRIBUTES_HASH } from '../sid/ctypes.js'

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
    SecurityAttributes: cP_VOID,
})
