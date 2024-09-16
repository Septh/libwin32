import { pointer, struct } from '../../private.js'
import { cDWORD, cLONG } from '../../ctypes.js'
import { cPOINT, POINT } from './point.js'

// #region Types

export const cMINMAXINFO = struct('MINMAXINFO', {
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export const cLPMINMAXINFO = pointer('LPMINMAXINFO', cMINMAXINFO)
export const cPMINMAXINFO  = pointer('PMINMAXINFO',  cMINMAXINFO)

export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

export const cLUID = struct('LUID', {
    LowPart: cDWORD,
    HighPart: cLONG,
})

export const cPLUID = pointer('PLUID', cLUID)

export interface LUID {
    LowPart: number
    HighPart: number
}

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
