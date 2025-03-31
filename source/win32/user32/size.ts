import { koffi } from '../../private.js'
import { cLONG } from '../../ctypes.js'

export const cSIZE = koffi.struct({
    cx: cLONG,
    yy: cLONG
})

export const cPSIZE = koffi.pointer(cSIZE)
export const cLPSIZE = koffi.pointer(cPSIZE)

export interface SIZE {
    x: number
    y: number
}
