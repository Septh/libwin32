import { koffi } from '../../private.js'
import { cDWORD, cLONG } from '../../ctypes.js'
import { cPOINT, type POINT } from './point.js'

export const cMINMAXINFO = koffi.struct({
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export const cLPMINMAXINFO = koffi.pointer(cMINMAXINFO)
export const cPMINMAXINFO  = koffi.pointer(cMINMAXINFO)

export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

export const cLUID = koffi.struct({
    LowPart: cDWORD,
    HighPart: cLONG,
})

export const cPLUID = koffi.pointer(cLUID)

export interface LUID {
    LowPart: number
    HighPart: number
}
