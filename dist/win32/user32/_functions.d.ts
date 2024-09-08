import { koffi } from '../../private.js';
import { type HINSTANCE } from '../../ctypes.js';
import { type WNDCLASS, type WNDCLASSEX, type HWND, type WNDPROC } from './window.js';
import { type MSG } from './msg.js';
import { type HICON } from './icon.js';
import { type HCURSOR } from './cursor.js';
import { type HMENU } from './menu.js';
import type { IDC, IDI, IMAGE, LR, OBM, OCR, OIC, SW, WS, WS_EX } from './_consts.js';
/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
export declare function CreateWindow(lpClassName: string | null, lpWindowName: string | null, dwStyle: WS, x: number, y: number, nWidth: number, nHeight: number, hWndParent: HWND | null, hMenu: HMENU | null, hInstance: HINSTANCE | null, lpParam: any): HWND;
/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export declare const CreateWindowEx: koffi.KoffiFunc<(dwExStyle: WS_EX, lpClassName: string | null, lpWindowName: string | null, dwStyle: WS, x: number, y: number, nWidth: number, nHeight: number, hWndParent: HWND | null, hMenu: HMENU | null, hInstance: HINSTANCE | null, lpParam: any) => HWND>;
/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export declare const DefWindowProc: koffi.KoffiFunc<WNDPROC>;
/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export declare const DestroyCursor: koffi.KoffiFunc<(hCursor: HCURSOR) => number>;
/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export declare const DestroyIcon: koffi.KoffiFunc<(hIcon: HICON) => number>;
/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export declare const DispatchMessage: koffi.KoffiFunc<(lpMsg: MSG) => number | BigInt>;
/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export declare const GetMessage: koffi.KoffiFunc<(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number) => number>;
/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export declare const LoadCursor: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpIconName: IDC | string) => HCURSOR>;
/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export declare const LoadIcon: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpIconName: IDI | string) => HICON>;
/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export declare const LoadImage: koffi.KoffiFunc<(hInstance: HINSTANCE | null, lpName: IDC | IDI | OIC | OCR | OBM | string, type: IMAGE, cx: number, cy: number, fuLoad: LR) => HICON>;
/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export declare const MessageBox: koffi.KoffiFunc<(hWnd: HWND | null, lpText: string | null, lpCaption: string | null, uType: number) => number>;
/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export declare const PostQuitMessage: koffi.KoffiFunc<(nExitCode: number) => void>;
/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export declare const RegisterClass: koffi.KoffiFunc<(lpWndClass: WNDCLASS) => number>;
/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export declare const RegisterClassEx: koffi.KoffiFunc<(lpWndClassEx: WNDCLASSEX) => number>;
/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export declare const ShowWindow: koffi.KoffiFunc<(hWnd: HWND, nCmdShow: SW) => boolean>;
/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export declare const ShowWindowAsync: koffi.KoffiFunc<(hWnd: HWND, nCmdShow: SW) => boolean>;
/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export declare const TranslateMessage: koffi.KoffiFunc<(lpMsg: MSG) => number>;
/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export declare const TranslateMessageEx: koffi.KoffiFunc<(lpMsg: MSG, flags: number) => number>;
/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export declare const UnregisterClass: koffi.KoffiFunc<(lpClassName: string, hInstance: HINSTANCE | null) => number>;
/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export declare const UpdateWindow: koffi.KoffiFunc<(hWnd: HWND) => boolean>;
//# sourceMappingURL=_functions.d.ts.map