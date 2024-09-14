import { koffi } from '../../private.js'
import { cPOINT, POINT } from './point.js'

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

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
