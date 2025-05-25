import { koffi } from '../private.js'
import { cBYTE, cPVOID } from '../ctypes.js'

export const SID_REVISION = 1                       // Current revision level
export const SID_MAX_SUB_AUTHORITIES = 15
export const SID_RECOMMENDED_SUB_AUTHORITIES = 1    // Will change to around 6

/**
 * The security identifier (SID) structure is a variable-length structure used to uniquely identify users or groups.
 */
export interface SID {
    Revision:            number
    IdentifierAuthority: [ number, number, number, number, number, number ]
    SubAuthorityCount:   number
    SubAuthority:        Uint32Array
}

export const cSID = koffi.struct('SID', {
    Revision:            cBYTE,
    IdentifierAuthority: koffi.array(koffi.types.uint8, 6, 'Array'),
    SubAuthorityCount:   cBYTE,
    SubAuthority:        cPVOID   // DWORD *SubAuthority[]
})
