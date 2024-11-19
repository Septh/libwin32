
import { type koffi } from '../../private.js'
import { kernel32 } from './_lib.js'
import { cHWND, type HWND } from '../user32/window.js'

// #region Types



// #endregion

// #region Functions

/**
 * Retrieves the window handle used by the console associated with the calling process.
 * 
 * https://learn.microsoft.com/en-us/windows/console/getconsolewindow
 */
export const GetConsoleWindow: koffi.KoffiFunc<() => HWND> = kernel32('GetConsoleWindow', cHWND, [])

// #endregion
