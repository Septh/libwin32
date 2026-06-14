import koffi from 'koffi'
import { Internals, cBYTE, cDWORD, cP_VOID } from '../../internals.js'

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
    Hash:     koffi.array(cP_VOID, Internals.SID_HASH_SIZE)
})
