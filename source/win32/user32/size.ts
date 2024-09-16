import { pointer, struct } from '../../private.js'
import { cLONG } from '../../ctypes.js'

// #region Types

export const cSIZE = struct('SIZE', {
    cx: cLONG,
    yy: cLONG
})
export const cPSIZE = pointer('PSIZE', cSIZE)
export const cLPSIZE = pointer('LPSIZE', cPSIZE)

export interface SIZE {
    x: number
    y: number
}

// #endregion

// #region Functions
// #endregion
