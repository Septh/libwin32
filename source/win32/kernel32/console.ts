import { kernel32 } from './_lib.js'
import { cHANDLE, type HWND } from '../ctypes.js'

/**
 * Retrieves the window handle used by the console associated with the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/console/getconsolewindow
 */
export const GetConsoleWindow: () => HWND | null = /*#__PURE__*/kernel32.func('GetConsoleWindow', cHANDLE, [])
