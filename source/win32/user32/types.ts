import type { __HANDLE__ } from '../internals.js'
import type { HINSTANCE, LPARAM, LRESULT, LUID, WPARAM } from '../chore/types.js'
import { SIZEOF_BSMINFO, SIZEOF_WNDCLASSEX, type CS_ } from './consts.js'

// Handles
export type HWND     = __HANDLE__<'HWND'>
export type HBRUSH   = __HANDLE__<'HBRUSH'>
export type HICON    = __HANDLE__<'HICON'>
export type HCURSOR  = HICON                     // HCURSOR is the same as HICON
export type HBITMAP  = __HANDLE__<'HBITMAP'>
export type HMENU    = __HANDLE__<'HMENU'>
export type HACCEL   = __HANDLE__<'HACCEL'>
export type HDC      = __HANDLE__<'HDC'>
export type HRGN     = __HANDLE__<'HRGN'>
export type HMONITOR = __HANDLE__<'HMONITOR'>
export type HDESK    = __HANDLE__<'HDESK'>

/**
 * Contains information about a window that denied a request from `BroadcastSystemMessageEx`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-bsminfo
 */
export class BSMINFO {
    readonly cbSize = SIZEOF_BSMINFO
    public hDesk: HDESK | null = null
    public hWnd:  HWND | null = null
    public luid:  LUID | null = null
}

/**
 * The POINT structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-point
 */
export interface POINT {
    x: number
    y: number
}

/**
 * The POINTS structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-points
 */
export interface POINTS {
    x: number
    y: number
}

/**
 * The RECT structure defines a rectangle by the coordinates of its upper-left and lower-right corners.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-rect
 */
export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

/**
 * The SIZE structure defines the width and height of a rectangle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-size
 */
export interface SIZE {
    x: number
    y: number
}

/**
 * Contains information about a window's maximized size and position and its minimum and maximum tracking size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-minmaxinfo
 */
export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

/**
 * Contains message information from a thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-msg
 */
export interface MSG {
    HWND:     HWND
    message:  number
    wParam:   WPARAM
    lParam:   LPARAM
    time:     number
    pt:       POINT
    lPrivate: number
}

/**
 * An application-defined function that processes messages sent to a window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nc-winuser-wndproc
 */
export type WNDPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => LRESULT

/**
 * An application-defined callback function used with the EnumWindows or EnumDesktopWindows function.
 *
 * https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633498(v=vs.85)
 */
export type WNDENUMPROC = (hWnd: HWND, lParam: LPARAM) => number

/**
 * Application-defined callback function used with the CreateDialog and DialogBox families of functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nc-winuser-dlgproc
 */
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number | bigint

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export interface WNDCLASS {
    hInstance:     HINSTANCE | null
    lpszClassName: string | null
    style:         CS_
    lpfnWndProc:   WNDPROC | null
    hCursor:       HCURSOR | null
    hIcon:         HICON   | null
    hbrBackground: HBRUSH  | null
    lpszMenuName:  string  | null
    cbClsExtra:    number
    cwWndExtra:    number
}

/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX {
    readonly cbSize = SIZEOF_WNDCLASSEX
    constructor(
        public hInstance:     HINSTANCE | null = null,
        public lpszClassName: string  | null   = null,
        public style:         CS_              = 0,
        public lpfnWndProc:   WNDPROC | null   = null,
        public hCursor:       HCURSOR | null   = null,
        public hIcon:         HICON   | null   = null,
        public hIconSm:       HICON   | null   = null,
        public hbrBackground: HBRUSH  | null   = null,
        public lpszMenuName:  string  | null   = null,
        public cbClsExtra:    number           = 0,
        public cwWndExtra:    number           = 0
    ) {}
}
