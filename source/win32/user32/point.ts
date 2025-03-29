import { koffi } from '../../private.js'
import { cLONG, cSHORT, cBOOL } from '../../ctypes.js'
import { user32 } from './_lib.js'

// #region Types

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

// #endregion

// #region Functions

/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export const GetCursorPos: (
    lpPoint: POINT
) => number = /*#__PURE__*/user32.func('GetCursorPos', cBOOL, [ koffi.out(cLPPOINT) ])

// #endregion
