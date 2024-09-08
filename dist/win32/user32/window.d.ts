import { koffi } from '../../private.js';
import { type HINSTANCE, type HANDLE, type LPARAM, type WPARAM } from '../../ctypes.js';
import { type HICON } from './icon.js';
import { type HCURSOR } from './cursor.js';
import { type HBRUSH } from './brush.js';
import type { WM, CS } from './_consts.js';
export declare const cHWND: koffi.IKoffiCType;
export type HWND = HANDLE<'HWND'>;
export declare const cWNDPROC: koffi.IKoffiCType;
export type WNDPROC = (hWnd: HWND, msg: WM, wParam: WPARAM, lParam: LPARAM) => number;
export declare const cDLGPROC: koffi.IKoffiCType;
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number;
export declare const cWNDCLASS: koffi.IKoffiCType;
export declare const cLPWNDCLASS: koffi.IKoffiCType;
export declare const cPWNDCLASS: koffi.IKoffiCType;
/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export declare class WNDCLASS {
    style?: CS;
    lpfnWndProc?: koffi.IKoffiRegisteredCallback;
    cbClsExtra?: number;
    cbWndExtra?: number;
    hInstance?: HINSTANCE;
    hIcon?: HICON;
    hCursor?: HCURSOR;
    hbrBackground?: HBRUSH;
    lpszMenuName?: string;
    lpszClassName?: string;
    constructor(wndProc?: WNDPROC);
    [Symbol.dispose](): void;
}
export declare const cWNDCLASSEX: koffi.IKoffiCType;
export declare const cLPWNDCLASSEX: koffi.IKoffiCType;
export declare const cPWNDCLASSEX: koffi.IKoffiCType;
/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export declare class WNDCLASSEX {
    readonly cbSize: number;
    style?: CS;
    lpfnWndProc?: koffi.IKoffiRegisteredCallback;
    cbClsExtra?: number;
    cbWndExtra?: number;
    hInstance?: HINSTANCE;
    hIcon?: HICON;
    hCursor?: HCURSOR;
    hbrBackground?: HBRUSH;
    lpszMenuName?: string;
    lpszClassName?: string;
    hIconSm?: HICON;
    constructor(wndProc?: WNDPROC);
    [Symbol.dispose](): void;
}
//# sourceMappingURL=window.d.ts.map