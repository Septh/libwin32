import { koffi } from '../../private.js'
import { user32 } from './_alib.js'
import {
    ctypes,
    cVOID, cLPVOID, cBOOL, cINT, cUINT, cDWORD, cLPCWSTR,
    cLPARAM, cWPARAM, cLRESULT, cATOM,
    cHINSTANCE, type HINSTANCE
} from '../../ctypes.js'
import {
    cWNDCLASS, type WNDCLASS,
    cWNDCLASSEX, type WNDCLASSEX,
    cHWND, type HWND,
    type WNDPROC
} from './window.js'
import { cLPMSG, type MSG } from './msg.js'
import { cHICON, type HICON } from './icon.js'
import { cHCURSOR, type HCURSOR } from './cursor.js'
import { cHMENU, type HMENU } from './menu.js'
import type { IDC, IDI, IMAGE, LR, OBM, OCR, OIC, SW, WS, WS_EX } from './_consts.js'

/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
export function CreateWindow(
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS,
    x:            number,
    y:            number,
    nWidth:       number,
    nHeight:      number,
    hWndParent:   HWND | null,
    hMenu:        HMENU | null,
    hInstance:    HINSTANCE | null,
    lpParam:      any,
): HWND {
    return CreateWindowEx(0, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam)
}

/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export const CreateWindowEx: koffi.KoffiFunc<(
    dwExStyle:    WS_EX,
    lpClassName:  string | null,
    lpWindowName: string | null,
    dwStyle:      WS,
    x:            number,
    y:            number,
    nWidth:       number,
    nHeight:      number,
    hWndParent:   HWND | null,
    hMenu:        HMENU | null,
    hInstance:    HINSTANCE | null,
    lpParam:      any,
) => HWND> = user32.lib.func(
    'CreateWindowExW', cHWND,
    [ cDWORD, cLPCWSTR, cLPCWSTR, cDWORD, ctypes.int, ctypes.int, ctypes.int, ctypes.int, cHWND, cHMENU, cHINSTANCE, cLPVOID ]
)

/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export const DefWindowProc: koffi.KoffiFunc<WNDPROC> = user32.lib.func('DefWindowProcW', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ])

/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export const DestroyCursor: koffi.KoffiFunc<(
    hCursor: HCURSOR
) => number> = user32.lib.func('DestroyCursor', cBOOL, [ cHCURSOR ])

/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export const DestroyIcon: koffi.KoffiFunc<(
    hIcon: HICON
) => number> = user32.lib.func('DestroyIcon', cBOOL, [ cHICON ])

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export const DispatchMessage: koffi.KoffiFunc<(
    lpMsg: MSG
) => number | BigInt> = user32.lib.func('DispatchMessageW', cLRESULT, [ cLPMSG ])

/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export const GetMessage: koffi.KoffiFunc<(
    lpMsg:         MSG,
    hWnd:          HWND | null | -1,
    wMsgFilterMin: number,
    wMsgFilterMax: number
) => number> = user32.lib.func('GetMessageW', cBOOL, [ koffi.out(cLPMSG), cHWND, cUINT, cUINT ])

/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export const LoadCursor: koffi.KoffiFunc<(
    hInstance:  HINSTANCE | null,
    lpIconName: IDC | string
) => HCURSOR> = user32.lib.func('LoadCursorW', cHCURSOR, [ cHINSTANCE, cLPCWSTR ])

/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export const LoadIcon: koffi.KoffiFunc<(
    hInstance:  HINSTANCE | null,
    lpIconName: IDI | string
) => HICON> = user32.lib.func('LoadIconW', cHICON, [ cHINSTANCE, cLPCWSTR ])

/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export const LoadImage: koffi.KoffiFunc<(
    hInstance: HINSTANCE | null,
    lpName:    IDC | IDI | OIC | OCR | OBM | string,
    type:      IMAGE,
    cx:        number,
    cy:        number,
    fuLoad:    LR
) => HICON> = user32.lib.func('LoadImageW', cHICON, [ cHINSTANCE, cLPCWSTR, cUINT, ctypes.int, ctypes.int, cUINT ])

/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export const MessageBox: koffi.KoffiFunc<(
    hWnd:      HWND | null,
    lpText:    string | null,
    lpCaption: string | null,
    uType:     number
) => number> = user32.lib.func('MessageBoxW', cINT, [ cHWND, cLPCWSTR, cLPCWSTR, cUINT ])

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export const PostQuitMessage: koffi.KoffiFunc<(
    nExitCode: number
) => void> = user32.lib.func('PostQuitMessage', cVOID, [ cINT ])

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClass: koffi.KoffiFunc<(
    lpWndClass: WNDCLASS
) => number> = user32.lib.func('RegisterClassW', cATOM, [ cWNDCLASS ])

/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClassEx: koffi.KoffiFunc<(
    lpWndClassEx: WNDCLASSEX
) => number> = user32.lib.func('RegisterClassExW', cATOM, [ cWNDCLASSEX ])

/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export const ShowWindow: koffi.KoffiFunc<(
    hWnd:     HWND,
    nCmdShow: SW
) => boolean> = user32.lib.func('ShowWindow', cBOOL, [ cHWND, cINT ])

/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export const ShowWindowAsync: koffi.KoffiFunc<(
    hWnd:     HWND,
    nCmdShow: SW
) => boolean> = user32.lib.func('ShowWindowAsync', cBOOL, [ cHWND, cINT ])

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export const TranslateMessage: koffi.KoffiFunc<(
    lpMsg: MSG
) => number> = user32.lib.func('TranslateMessage', cBOOL, [ cLPMSG ])

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export const TranslateMessageEx: koffi.KoffiFunc<(
    lpMsg: MSG,
    flags: number
) => number> = user32.lib.func('TranslateMessageEx', cBOOL, [ cLPMSG, cUINT ])

/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export const UnregisterClass: koffi.KoffiFunc<(
    lpClassName: string,
    hInstance:   HINSTANCE | null
) => number> = user32.lib.func('UnregisterClassW', cATOM, [ cLPCWSTR, cHINSTANCE ])

/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export const UpdateWindow: koffi.KoffiFunc<(
    hWnd: HWND
) => boolean> = user32.lib.func('UpdateWindow', cBOOL, [ cHWND ])
