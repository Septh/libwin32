import { out, pointer, struct, type koffi } from '../../private.js'
import { cLONG, cSHORT, cBOOL } from '../../ctypes.js'
import { user32 } from './_lib.js'

// #region Types

export const cPOINT = struct('POINT', {
    x: cLONG,
    y: cLONG
})

export const cLPPOINT = pointer('LPPOINT', cPOINT)
export const cPPOINT  = pointer('PPOINT',  cPOINT)

export interface POINT {
    x: number
    y: number
}

export const cPOINTS = struct('POINTS', {
    x: cSHORT,
    y: cSHORT
})

export const cLPPOINTS = pointer('LPPOINTS', cPOINTS)
export const cPPOINTS  = pointer('PPOINTS',  cPOINTS)

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
export const GetCursorPos: koffi.KoffiFunc<(
    lpPoint: POINT
) => number> = user32('GetCursorPos', cBOOL, [ out(cLPPOINT) ])

// #endregion
