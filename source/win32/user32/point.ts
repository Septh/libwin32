import { koffi } from '../../private.js'
import { cLONG, cSHORT, cBOOL } from '../../ctypes.js'
import { user32 } from './_lib.js'

export const cPOINT = koffi.struct({
    x: cLONG,
    y: cLONG
})

export const cLPPOINT = koffi.pointer(cPOINT)
export const cPPOINT  = koffi.pointer(cPOINT)

export interface POINT {
    x: number
    y: number
}

export const cPOINTS = koffi.struct({
    x: cSHORT,
    y: cSHORT
})

export const cLPPOINTS = koffi.pointer(cPOINTS)
export const cPPOINTS  = koffi.pointer(cPOINTS)

export interface POINTS {
    x: number
    y: number
}


/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export const GetCursorPos: (
    lpPoint: POINT
) => number = /*#__PURE__*/user32.func('GetCursorPos', cBOOL, [ koffi.out(cLPPOINT) ])
