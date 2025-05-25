import { cLONG } from '../ctypes.js'
import { koffi } from '../private.js'

/**
 * The RECT structure defines a rectangle by the coordinates of its upper-left and lower-right corners.
 */
export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

export const cRECT = koffi.struct('RECT', {
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})
