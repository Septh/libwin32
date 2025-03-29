import { koffi } from '../../private.js'
import { cDWORD, cLONG } from '../../ctypes.js'
import { cPOINT, type POINT } from './point.js'

// #region Types

export const cMINMAXINFO = koffi.struct('MINMAXINFO', {
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export const cLPMINMAXINFO = koffi.pointer('LPMINMAXINFO', cMINMAXINFO)
export const cPMINMAXINFO  = koffi.pointer('PMINMAXINFO',  cMINMAXINFO)

export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

export const cLUID = koffi.struct('LUID', {
    LowPart: cDWORD,
    HighPart: cLONG,
})

export const cPLUID = koffi.pointer('PLUID', cLUID)

export interface LUID {
    LowPart: number
    HighPart: number
}

// #endregion

// #region Functions
// #endregion
