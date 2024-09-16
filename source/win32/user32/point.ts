import { pointer, struct } from '../../private.js'
import { cLONG, cSHORT } from '../../ctypes.js'

// #region Types

export const cPOINT = struct('POINT', {
    x: cLONG,
    y: cLONG
})

export const cLPPOINT = pointer('LPPOINT', cPOINT)
export const cPPOINT  = pointer('PPOINT',  cPOINT)

export interface POINT {
    x: number
    y: number
}

export const cPOINTS = struct('POINTS', {
    x: cSHORT,
    y: cSHORT
})

export const cLPPOINTS = pointer('LPPOINTS', cPOINTS)
export const cPPOINTS  = pointer('PPOINTS',  cPOINTS)

export interface POINTS {
    x: number
    y: number
}

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
