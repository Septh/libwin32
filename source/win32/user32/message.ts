import { koffi } from '../../private.js'
import { user32 } from './_lib.js'
import { cVOID, cBOOL, cDWORD, cINT, cUINT, cLPARAM, cWPARAM, cLRESULT } from '../../ctypes.js'
import { cHWND, type HWND } from './window.js'
import { cPOINT, type POINT } from './point.js'

// #region Types

export const cMSG = koffi.struct('MSG', {
    HWND:     cHWND,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

export const cLPMSG = koffi.pointer('LPMSG', cMSG)
export const cPMSG  = koffi.pointer('PMSG',  cMSG)

export interface MSG {
    HWND:    HWND
    message: number
    wParam:  number
    lParam:  number
    time:    number
    pt:      POINT
}

// #endregion

// #region Functions

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
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export const PostQuitMessage: koffi.KoffiFunc<(
    nExitCode: number
) => void> = user32.lib.func('PostQuitMessage', cVOID, [ cINT ])

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

// #endregion

// #region Constants
// #endregion
