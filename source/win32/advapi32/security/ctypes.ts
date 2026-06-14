import koffi from 'koffi'
import {
    Internals,
    cBOOL, cBYTE, cDWORD, cDWORD64, cLONG64, cP_VOID, cWSTR, cWORD
} from '../../internals.js'
import { cLUID } from '../../chore/ctypes.js'
import { cPSID } from '../sid/ctypes.js'

export const cACL = koffi.struct({
    AclRevision: cBYTE,
    Sbsz1:       cBYTE,
    AclSize:     cWORD,
    AceCount:    cWORD,
    Sbsz2:       cWORD
})

export const cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE = koffi.struct({
    Version: cDWORD64,
    Name:    cWSTR
})

export const cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE = koffi.struct({
    pValue:      cP_VOID,
    ValueLength: cDWORD
})

export const cCLAIM_SECURITY_ATTRIBUTE_V1_VALUES = koffi.union(null, {
    pInt64:        koffi.pointer(cLONG64, Internals.ANYSIZE_ARRAY),
    pUint64:       koffi.pointer(cDWORD64, Internals.ANYSIZE_ARRAY),
    ppString:      koffi.pointer(cWSTR, Internals.ANYSIZE_ARRAY),
    pFqbn:         koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE, Internals.ANYSIZE_ARRAY),
    pOctectString: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE, Internals.ANYSIZE_ARRAY)
})

export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct({
    Name:       cWSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     cCLAIM_SECURITY_ATTRIBUTE_V1_VALUES
})

export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION_ATTRIBUTE = koffi.union({
    pAttributeV1: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_V1, Internals.ANYSIZE_ARRAY)
})

export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.struct({
    Version:        cWORD,
    Reserved:       cWORD,
    AttributeCount: cDWORD,
    Attribute:      cCLAIM_SECURITY_ATTRIBUTES_INFORMATION_ATTRIBUTE
})

export const cLUID_AND_ATTRIBUTES = koffi.struct({
    Luid: cLUID,
    Attributes: cDWORD
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
