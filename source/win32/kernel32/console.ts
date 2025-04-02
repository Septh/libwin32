import type { koffi } from '../private.js'
import { cHANDLE, type HWND } from '../ctypes.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves the window handle used by the console associated with the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/console/getconsolewindow
 */
export function GetConsoleWindow(): HWND | null {
    GetConsoleWindow.fn ??= kernel32.func('GetConsoleWindow', cHANDLE, [])
    return GetConsoleWindow.fn()
}

/** @internal */
export declare namespace GetConsoleWindow {
    export var fn: koffi.KoffiFunc<() => HWND | null>
}
