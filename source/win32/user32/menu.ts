import {
    cBOOL, cUINT, cPWSTR, cHANDLE,
    cRECT, type RECT,
    type HWND, type HMENU
} from '../ctypes.js'
import type { MF_ } from '../consts/MF.js'
import type { TPM_ } from '../consts/TPM.js'
import { user32 } from './_lib.js'

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
export function TrackPopupMenu(hMenu: HMENU, uFlags: TPM_, x: number, y: number, nReserved: number, hWnd: HWND, prcRect?: RECT): boolean {
    TrackPopupMenu.native ??= user32.func('TrackPopupMenu', cBOOL, [ cHANDLE, cUINT, cUINT, cUINT, cUINT, cHANDLE, cRECT ])
    return !!TrackPopupMenu.native(hMenu, uFlags, x, y, nReserved, hWnd, prcRect ?? null)
}

/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export function DestroyMenu(hMenu: HMENU): boolean {
    DestroyMenu.native ??= user32.func('DestroyMenu', cBOOL, [ cHANDLE ])
    return !!DestroyMenu.native(hMenu)
}

/**
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export function AppendMenu(hMenu: HMENU, uFlags: MF_, uIDNewItem: number | HMENU, lpNewItem: string | null): boolean {
    AppendMenu.native ??= user32.func('AppendMenuW', cBOOL, [ cHANDLE, cUINT, cUINT, cPWSTR ]);
    return !!AppendMenu.native(hMenu, uFlags, uIDNewItem, lpNewItem)
}

/**
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export function CheckMenuItem(hMenu: HMENU, uIDCheckItem: number, uCheck: MF_): number {
    CheckMenuItem.native ??= user32.func('CheckMenuItem', cUINT, [ cHANDLE, cUINT, cUINT ])
    return CheckMenuItem.native(hMenu, uIDCheckItem, uCheck)
}
