import { koffi } from '../../private.js'
import { cLONG } from '../../ctypes.js'

export const cRECT = koffi.struct({
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export const cLPRECT = koffi.pointer(cRECT)
export const cPRECT  = koffi.pointer(cRECT)

export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}
