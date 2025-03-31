import { koffi } from '../../private.js'
import { cBOOL, cLPPOINT, type POINT } from '../../ctypes.js'
import { user32 } from './_lib.js'

/**
 * Retrieves the cursor's position, in screen coordinates.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos
 */
export const GetCursorPos: (
    lpPoint: POINT
) => number = /*#__PURE__*/user32.func('GetCursorPos', cBOOL, [ koffi.out(cLPPOINT) ])
