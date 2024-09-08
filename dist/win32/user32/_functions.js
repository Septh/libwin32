import { koffi } from '../../private.js';
import { user32 } from './_alib.js';
import { ctypes, cVOID, cLPVOID, cBOOL, cINT, cUINT, cDWORD, cLPCWSTR, cLPARAM, cWPARAM, cLRESULT, cATOM, cHINSTANCE } from '../../ctypes.js';
import { cWNDCLASS, cWNDCLASSEX, cHWND } from './window.js';
import { cLPMSG } from './msg.js';
import { cHICON } from './icon.js';
import { cHCURSOR } from './cursor.js';
import { cHMENU } from './menu.js';
/**
 * Creates an overlapped, pop-up, or child window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindoww
 */
export function CreateWindow(lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam) {
    return CreateWindowEx(0, lpClassName, lpWindowName, dwStyle, x, y, nWidth, nHeight, hWndParent, hMenu, hInstance, lpParam);
}
/**
 * Creates an overlapped, pop-up, or child window with an extended window style.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-createwindowexw
 */
export const CreateWindowEx = user32.lib.func('CreateWindowExW', cHWND, [cDWORD, cLPCWSTR, cLPCWSTR, cDWORD, ctypes.int, ctypes.int, ctypes.int, ctypes.int, cHWND, cHMENU, cHINSTANCE, cLPVOID]);
/**
 * Calls the default window procedure to provide default processing for any window messages that an application does not process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-defwindowprocw
 */
export const DefWindowProc = user32.lib.func('DefWindowProcW', cLRESULT, [cHWND, cUINT, cWPARAM, cLPARAM]);
/**
 * Destroys a cursor and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroycursor
 */
export const DestroyCursor = user32.lib.func('DestroyCursor', cBOOL, [cHCURSOR]);
/**
 * Destroys an icon and frees any memory the cursor occupied.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-destroyicon
 */
export const DestroyIcon = user32.lib.func('DestroyIcon', cBOOL, [cHICON]);
/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export const DispatchMessage = user32.lib.func('DispatchMessageW', cLRESULT, [cLPMSG]);
/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export const GetMessage = user32.lib.func('GetMessageW', cBOOL, [koffi.out(cLPMSG), cHWND, cUINT, cUINT]);
/**
 * Loads the specified cursor resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadcursorw
 */
export const LoadCursor = user32.lib.func('LoadCursorW', cHCURSOR, [cHINSTANCE, cLPCWSTR]);
/**
 * Loads the specified icon resource from the executable (.exe) file associated with an application instance.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadiconw
 */
export const LoadIcon = user32.lib.func('LoadIconW', cHICON, [cHINSTANCE, cLPCWSTR]);
/**
 * Loads an icon, cursor, animated cursor, or bitmap.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-loadimagew
 */
export const LoadImage = user32.lib.func('LoadImageW', cHICON, [cHINSTANCE, cLPCWSTR, cUINT, ctypes.int, ctypes.int, cUINT]);
/**
 * Displays a modal dialog box that contains a system icon, a set of buttons, and a brief application-specific message, such as status or error information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw
 */
export const MessageBox = user32.lib.func('MessageBoxW', cINT, [cHWND, cLPCWSTR, cLPCWSTR, cUINT]);
/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export const PostQuitMessage = user32.lib.func('PostQuitMessage', cVOID, [cINT]);
/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClass = user32.lib.func('RegisterClassW', cATOM, [cWNDCLASS]);
/**
 * Registers a window class for subsequent use in calls to the CreateWindowEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerclassexw
 */
export const RegisterClassEx = user32.lib.func('RegisterClassExW', cATOM, [cWNDCLASSEX]);
/**
 * Sets the specified window's show state.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindow
 */
export const ShowWindow = user32.lib.func('ShowWindow', cBOOL, [cHWND, cINT]);
/**
 * Sets the show state of a window without waiting for the operation to complete.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
 */
export const ShowWindowAsync = user32.lib.func('ShowWindowAsync', cBOOL, [cHWND, cINT]);
/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export const TranslateMessage = user32.lib.func('TranslateMessage', cBOOL, [cLPMSG]);
/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export const TranslateMessageEx = user32.lib.func('TranslateMessageEx', cBOOL, [cLPMSG, cUINT]);
/**
 * Unregisters a window class, freeing the memory required for the class.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-unregisterclassw
 */
export const UnregisterClass = user32.lib.func('UnregisterClassW', cATOM, [cLPCWSTR, cHINSTANCE]);
/**
 * Updates the client area of the specified window by sending a WM_PAINT message to the window if the window's update region is not empty.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-updatewindow
 */
export const UpdateWindow = user32.lib.func('UpdateWindow', cBOOL, [cHWND]);
//# sourceMappingURL=_functions.js.map