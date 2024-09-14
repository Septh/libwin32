import { koffi } from '../../private.js'
import { cLONG } from '../../ctypes.js'

// #region Types

export const cRECT = koffi.struct('RECT', {
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export const cLPRECT = koffi.pointer('LPRECT', cRECT)
export const cPRECT  = koffi.pointer('PRECT',  cRECT)

export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
