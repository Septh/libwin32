import { cLONG } from '../ctypes.js'
import { koffi } from '../private.js'

/**
 * The SIZE structure defines the width and height of a rectangle.
 */
export interface SIZE {
    x: number
    y: number
}

export const cSIZE = koffi.struct('SIZE', {
    cx: cLONG,
    yy: cLONG
})
