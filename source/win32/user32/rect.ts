import { pointer, struct } from '../../private.js'
import { cLONG } from '../../ctypes.js'

// #region Types

export const cRECT = struct('RECT', {
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export const cLPRECT = pointer('LPRECT', cRECT)
export const cPRECT  = pointer('PRECT',  cRECT)

export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

// #endregion

// #region Functions
// #endregion
