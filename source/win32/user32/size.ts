import { koffi } from '../../private.js'
import { cLONG } from '../../ctypes.js'

// #region Types

export const cSIZE = koffi.struct('SIZE', {
    cx: cLONG,
    yy: cLONG
})
export const cPSIZE = koffi.pointer('PSIZE', cSIZE)
export const cLPSIZE = koffi.alias('LPSIZE', cPSIZE)

export interface SIZE {
    x: number
    y: number
}

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
