import { cBOOL, cUINT, cLPCWSTR } from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHWND, type HWND } from './window.js'
import type { MF_ } from '../consts/MF.js'
import type { TPM_ } from '../consts/TPM.js'
import { cPRECT, RECT } from './rect.js'
import { cHMENU, HMENU } from './menu.js'

/*
 * NOTE: This was split into a separate file as a quick way to work around
 * cyclical dependencies between the `menu` and `window` modules.
 */


/**
 * Creates a drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createpopupmenu
 */
export const CreatePopupMenu: () => HMENU = /*#__PURE__*/user32.func('CreatePopupMenu', cHMENU, [])

/**
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export const TrackPopupMenu: (
    hMenu: HMENU,
    uFlags: TPM_ | number,
    x: number,
    y: number,
    nReserved: number,
    hWnd: HWND,
    prcRect: RECT | null
) => number = /*#__PURE__*/user32.func('TrackPopupMenu', cBOOL, [ cHMENU, cUINT, cUINT, cUINT, cUINT, cHWND, cPRECT ])



/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export const DestroyMenu: (
    hMenu: HMENU
) => number = /*#__PURE__*/user32.func('DestroyMenu', cBOOL, [ cHMENU ])



/**
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export const AppendMenu: (
    hMenu: HMENU,
    uFlags: MF_ | number,
    uIDNewItem: number | HMENU,
    lpNewItem: string | null
) => number = /*#__PURE__*/user32.func('AppendMenuW', cBOOL, [ cHMENU, cUINT, cUINT, cLPCWSTR ]);



/**
 * Sets the checked state of a menu item.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export const CheckMenuItem: (
    hMenu: HMENU,
    uIDCheckItem: number,
    uCheck: MF_ | number
) => number = /*#__PURE__*/user32.func('CheckMenuItem', cUINT, [ cHMENU, cUINT, cUINT ])
