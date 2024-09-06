import { koffi } from '../../private.js'
import { cLONG, cSHORT } from '../../ctypes.js'

export const cPOINT = koffi.struct('POINT', {
    x: cLONG,
    y: cLONG
})

export const cLPPOINT = koffi.pointer('LPPOINT', cPOINT)
export const cPPOINT  = koffi.pointer('PPOINT',  cPOINT)

export interface POINT {
    x: number
    y: number
}

export const cPOINTS = koffi.struct('POINTS', {
    x: cSHORT,
    y: cSHORT
})

export const cLPPOINTS = koffi.pointer('LPPOINTS', cPOINTS)
export const cPPOINTS  = koffi.pointer('PPOINTS',  cPOINTS)

export interface POINTS {
    x: number
    y: number
}
