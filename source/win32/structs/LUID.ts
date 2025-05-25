import { koffi } from '../private.js'
import { cDWORD, cLONG } from '../ctypes.js'

/**
 * The LUID structure is an opaque structure that specifies an identifier that is guaranteed to be unique on the local machine.
 */
export interface LUID {
    LowPart: number
    HighPart: number
}

export const cLUID = koffi.struct('LUID', {
    LowPart: cDWORD,
    HighPart: cLONG
})
