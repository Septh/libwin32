import { opaque, pointer, type koffi } from '../../private.js'
import { cBOOL, cUINT, cHINSTANCE, cLPCWSTR, type HANDLE } from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHWND, type HWND } from './window.js'
import { cPOINT, type POINT } from './point.js'
import type { MF_ } from '../consts/MF.js'
import type { TPM_ } from '../consts/TPM.js'
import { cPRECT, RECT } from './rect.js'
import { cHMENU, HMENU } from './menu.js'

/**
 * NOTE: This was split into a separate file as a quick way to work around
 * cyclical dependencies between the `menu` and `window` modules.
 */

// #region Functions

/**
 * Creates a drop-down menu, submenu, or shortcut menu.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createpopupmenu
 */
export const CreatePopupMenu: koffi.KoffiFunc<() => HMENU> = user32('CreatePopupMenu', cHMENU, [])

/**
 * Displays a shortcut menu at the specified location and tracks the selection of items on the menu.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-trackpopupmenu
 */
export const TrackPopupMenu: koffi.KoffiFunc<(
    hMenu: HMENU,
    uFlags: TPM_ | number,
    x: number,
    y: number,
    nReserved: number,
    hWnd: HWND,
    prcRect: RECT | null
) => number> = user32('TrackPopupMenu', cBOOL, [ cHMENU, cUINT, cUINT, cUINT, cUINT, cHWND, cPRECT ])

/**
 * Destroys the specified menu and frees any memory that the menu occupies.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroymenu
 */
export const DestroyMenu: koffi.KoffiFunc<(
    hMenu: HMENU
) => number> = user32('DestroyMenu', cBOOL, [ cHMENU ])

 /**
 * Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-appendmenuw
 */
export const AppendMenu: koffi.KoffiFunc<(
    hMenu: HMENU,
    uFlags: MF_ | number,
    uIDNewItem: number,
    lpNewItem: string | null
) => number> = user32('AppendMenuW', cBOOL, [ cHMENU, cUINT, cUINT, cLPCWSTR ])

/**
 * Sets the checked state of a menu item.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-checkmenuitem
 */
export const CheckMenuItem: koffi.KoffiFunc<(
    hMenu: HMENU,
    uIDCheckItem: number,
    uCheck: MF_ | number
) => number> = user32('CheckMenuItem', cUINT, [ cHMENU, cUINT, cUINT ])

// #endregion
