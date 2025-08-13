import {
    cBOOL, cUINT, cSTR,
    cHANDLE, type HMENU, type HWND
} from '../ctypes.js'
import { cRECT, type RECT } from '../structs.js'
import type { MF_, TPM_ } from '../consts.js'
import { user32 } from './lib.js'

/**
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export function AppendMenu(hMenu: HMENU, flags: MF_, idNewItem: number | HMENU, newItem: string | null): boolean {
    AppendMenu.native ??= user32.func('AppendMenuW', cBOOL, [ cHANDLE, cUINT, cUINT, cSTR ]);
    return AppendMenu.native(hMenu, flags, idNewItem, newItem) !== 0
}

/**
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export function CheckMenuItem(hMenu: HMENU, idCheckItem: number, check: MF_): MF_ | -1 {
    CheckMenuItem.native ??= user32.func('CheckMenuItem', cUINT, [ cHANDLE, cUINT, cUINT ])
    return CheckMenuItem.native(hMenu, idCheckItem, check)
}

/**
 * Creates a drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createpopupmenu
 */
export function CreatePopupMenu(): HMENU | null {
    CreatePopupMenu.native ??= user32.func('CreatePopupMenu', cHANDLE, [])
    return CreatePopupMenu.native()
}

/**
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export function TrackPopupMenu(hMenu: HMENU, flags: TPM_, x: number, y: number, hWnd: HWND, rect: RECT | null = null): boolean {
    TrackPopupMenu.native ??= user32.func('TrackPopupMenu', cBOOL, [ cHANDLE, cUINT, cUINT, cUINT, cUINT, cHANDLE, cRECT ])
    return TrackPopupMenu.native(hMenu, flags, x, y, 0, hWnd, rect) !== 0
}
