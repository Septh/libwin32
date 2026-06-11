import koffi from 'koffi'
import { cDWORD } from '../internals.js'

export const cFILETIME = koffi.struct({
    dwLowDateTime: cDWORD,
    dwHighDateTime: cDWORD
})

export const cSYSTEMTIME = koffi.struct({
    wYear:         cDWORD,
    wMonth:        cDWORD,
    wDayOfWeek:    cDWORD,
    wDay:          cDWORD,
    wHour:         cDWORD,
    wMinute:       cDWORD,
    wSecond:       cDWORD,
    wMilliseconds: cDWORD
})
