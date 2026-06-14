import koffi from 'koffi'
import { cBOOL, cDWORD } from '../internals.js'
import type { NOTIFYICONDATA, SHELLEXECUTEINFO } from './types.js'
import { cNOTIFYICONDATA, cSHELLEXECUTEINFO } from './ctypes.js'
import type { NIM_ } from './consts.js'

const shell32 = koffi.load('shell32.dll')

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export function Shell_NotifyIcon(message: NIM_, data: NOTIFYICONDATA): number {
    Shell_NotifyIcon.native ??= shell32.func('Shell_NotifyIconW', cBOOL, [ cDWORD, koffi.pointer(cNOTIFYICONDATA) ])
    return Shell_NotifyIcon.native(message, data)
}

/**
 * Performs an operation on a specified file.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shellexecuteexw
 */
export function ShellExecuteEx(execInfo: SHELLEXECUTEINFO): boolean {
    ShellExecuteEx.native ??= shell32.func('ShellExecuteExW', cBOOL, [ koffi.inout(koffi.pointer(cSHELLEXECUTEINFO)) ])
    return ShellExecuteEx.native(execInfo) !== 0
}
