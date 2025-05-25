import { koffi } from '../private.js'
import {
    cBOOL, cDWORD
} from '../ctypes.js'
import { cNOTIFYICONDATA, type NOTIFYICONDATA } from '../structs/NOTIFYICONDATA.js'
import type { NIM_ } from '../consts/NIM.js'
import { shell32 } from './_lib.js'

/**
 * Adds, modifies, or deletes an icon from the taskbar status area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shell_notifyiconw
 */
export function Shell_NotifyIcon(dwMessage: NIM_, data: NOTIFYICONDATA): number {
    Shell_NotifyIcon.native ??= shell32.func('Shell_NotifyIconW', cBOOL, [ cDWORD, koffi.pointer(cNOTIFYICONDATA) ])
    return Shell_NotifyIcon.native(dwMessage, data)
}
