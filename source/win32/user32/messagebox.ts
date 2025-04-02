import { cINT, cUINT, cLPCWSTR, cHANDLE, type HWND } from '../ctypes.js'
import type { MB_ } from '../consts.js'
import { user32 } from './_lib.js'
import type { koffi } from '../private.js'

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export function MessageBox(hWnd: HWND | null, lpText: string | null, lpCaption: string | null, uType: MB_ | number): number {
    MessageBox.fn ??= user32.func('MessageBoxW', cINT, [ cHANDLE, cLPCWSTR, cLPCWSTR, cUINT ])
    return MessageBox.fn(hWnd, lpText, lpCaption, uType)
}

/** @internal */
export declare namespace MessageBox {
    export var fn: koffi.KoffiFunc<(hWnd: HWND | null, lpText: string | null, lpCaption: string | null, uType: MB_ | number) => number>
}
