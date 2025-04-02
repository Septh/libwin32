import {
    cBOOL, cUINT, cLPCWSTR, cHANDLE,
    cRECT, type RECT,
    type HWND, type HMENU
} from '../ctypes.js'
import type { MF_, TPM_ } from '../consts.js'
import { user32 } from './_lib.js'
import type { koffi } from '../private.js'

/**
 * Creates a drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createpopupmenu
 */
export function CreatePopupMenuX(): HMENU | null {
    CreatePopupMenuX.fn ??= user32.func('CreatePopupMenu', cHANDLE, [])
    return CreatePopupMenuX.fn()
}

/** @internal */
export declare namespace CreatePopupMenuX {
    export var fn: koffi.KoffiFunc<() => HMENU | null>
}

/**
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export function TrackPopupMenu(hMenu: HMENU, uFlags: TPM_ | number, x: number, y: number, nReserved: number, hWnd: HWND, prcRect?: RECT): boolean {
    TrackPopupMenu.fn ??= user32.func('TrackPopupMenu', cBOOL, [ cHANDLE, cUINT, cUINT, cUINT, cUINT, cHANDLE, cRECT ])
    return !!TrackPopupMenu.fn(hMenu, uFlags, x, y, nReserved, hWnd, prcRect ?? null)
}

/** @internal */
export declare namespace TrackPopupMenu {
    export var fn: koffi.KoffiFunc<(hMenu: HMENU, uFlags: TPM_ | number, x: number, y: number, nReserved: number, hWnd: HWND, prcRect: RECT | null) => number>
}

/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export function DestroyMenu(hMenu: HMENU): boolean {
    DestroyMenu.fn ??= user32.func('DestroyMenu', cBOOL, [ cHANDLE ])
    return !!DestroyMenu.fn(hMenu)
}

/** @internal */
export declare namespace DestroyMenu {
    export var fn: koffi.KoffiFunc<(hMenu: HMENU) => number>
}

/**
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export function AppendMenu(hMenu: HMENU, uFlags: MF_ | number, uIDNewItem: number | HMENU, lpNewItem: string | null): boolean {
    AppendMenu.fn ??= user32.func('AppendMenuW', cBOOL, [ cHANDLE, cUINT, cUINT, cLPCWSTR ]);
    return !!AppendMenu.fn(hMenu, uFlags, uIDNewItem, lpNewItem)
}

/** @internal */
export declare namespace AppendMenu {
    export var fn: koffi.KoffiFunc<(hMenu: HMENU, uFlags: MF_ | number, uIDNewItem: number | HMENU, lpNewItem: string | null) => number>
}

/**
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export function CheckMenuItem(hMenu: HMENU, uIDCheckItem: number, uCheck: MF_ | number): number {
    CheckMenuItem.fn ??= user32.func('CheckMenuItem', cUINT, [ cHANDLE, cUINT, cUINT ])
    return CheckMenuItem.fn(hMenu, uIDCheckItem, uCheck)
}

/** @internal */
export declare namespace CheckMenuItem {
    export var fn: koffi.KoffiFunc<(hMenu: HMENU, uIDCheckItem: number, uCheck: MF_ | number) => number>
}
