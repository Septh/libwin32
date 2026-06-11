import koffi from 'koffi'
import { cLONG, cSHORT } from '../internals.js'

export const cLPARAM  = koffi.types.int64   // == LONG_PTR
export const cWPARAM  = koffi.types.uint64  // == UINT_PTR
export const cHRESULT = koffi.types.int32   // == LONG
export const cLRESULT = koffi.types.int64   // == LONG_PTR
export const cATOM    = koffi.types.uint16  // == WORD

export const cGUID = koffi.struct({
    Data1: koffi.types.uint32,
    Data2: koffi.types.uint16,
    Data3: koffi.types.uint16,
    Data4: koffi.array(koffi.types.uint8, 8, 'Array')
})

export const cUUID = koffi.alias('UUID', cGUID)

export const cPOINT = koffi.struct({
    x: cLONG,
    y: cLONG
})

export const cPOINTS = koffi.struct({
    x: cSHORT,
    y: cSHORT
})

export const cRECT = koffi.struct({
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export const cSIZE = koffi.struct({
    cx: cLONG,
    yy: cLONG
})
