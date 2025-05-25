import { cLONG, cSHORT } from '../ctypes.js'
import { koffi } from '../private.js'

/**
 * The POINT structure defines the x- and y-coordinates of a point.
 */
export interface POINT {
    x: number
    y: number
}

export const cPOINT = koffi.struct('POINT', {
    x: cLONG,
    y: cLONG
})

/**
 * The POINTS structure defines the x- and y-coordinates of a point.
 */
export interface POINTS {
    x: number
    y: number
}

export const cPOINTS = koffi.struct('POINTS', {
    x: cSHORT,
    y: cSHORT
})
