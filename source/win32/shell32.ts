import { koffi, Win32Dll } from './private.js'
import { cBOOL, cDWORD } from './ctypes.js'
import { cNOTIFYICONDATA, type NOTIFYICONDATA } from './structs.js'
import type { NIM_ } from './consts.js'

/** @internal */
export const shell32 = /*#__PURE__*/new Win32Dll('shell32.dll')

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export function Shell_NotifyIcon(message: NIM_, data: NOTIFYICONDATA): number {
    Shell_NotifyIcon.native ??= shell32.func('Shell_NotifyIconW', cBOOL, [ cDWORD, koffi.pointer(cNOTIFYICONDATA) ])
    return Shell_NotifyIcon.native(message, data)
}
