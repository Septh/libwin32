import {
    pointer, inout, out,
    struct, sizeof,
    type koffi
} from '../../private.js'
import {
    cVOID, cBOOL, cDWORD, cINT, cUINT, cLONG,
    cLPDWORD,
    cLPARAM, cWPARAM, cLRESULT,
    type WPARAM, type LPARAM
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHWND, type HWND } from './window.js'
import { cPOINT, type POINT } from './point.js'
import { cLUID, type LUID } from './misc.js'
import { cHDESK, type HDESK } from './desktop.js'

// #region Types

export const cMSG = struct('MSG', {
    HWND:     cHWND,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

export const cLPMSG = pointer('LPMSG', cMSG)
export const cPMSG  = pointer('PMSG',  cMSG)

export interface MSG {
    HWND:    HWND
    message: number
    wParam:  number
    lParam:  number
    time:    number
    pt:      POINT
}

export const cBSMINFO = struct('BSMINFO', {
    cbSize: cUINT,
    hdesk: cHDESK,
    hwnd: cHWND,
    luid: cLUID,
})

export const cLPBSMINFO = pointer('LPBSMINFO', cBSMINFO)
export const cPBSMINFO  = pointer('PBSMINFO', cBSMINFO)

export class BSMINFO {
    readonly cbSize = sizeof(cBSMINFO)
    hDesk?: HDESK
    hWnd?: HWND
    luid?: LUID
}



// #endregion

// #region Functions

/**
 * Sends a message to the specified recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
/*@__NO_SIDE_EFFECTS__*/
export function BroadcastSystemMessage(
    flags: number,
    lpInfo: number | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM
): [ number, number | null ] {
    const ptr = [ lpInfo ]
    const ret = _BroadcastSystemMessage(flags, ptr, Msg, wParam, lParam)
    return [ ret, ptr[0] ]
}
const _BroadcastSystemMessage = user32('BroadcastSystemMessageW', cLONG, [ cDWORD, inout(cLPDWORD), cUINT, cWPARAM, cLPARAM ])

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
/*@__NO_SIDE_EFFECTS__*/
export function BroadcastSystemMessageEx(
    flags: number,
    lpInfo: number | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM,
    psbmInfo: BSMINFO | null
): [ number, number | null ] {
    const ptr = [ lpInfo ]
    const ret = _BroadcastSystemMessageEx(flags, ptr, Msg, wParam, lParam, psbmInfo)
    return [ ret, ptr[0] ]
}
const _BroadcastSystemMessageEx = user32('BroadcastSystemMessageExW', cLONG, [ cDWORD, inout(cLPDWORD), cUINT, cWPARAM, cLPARAM, cPBSMINFO ])

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export const DispatchMessage: koffi.KoffiFunc<(
    lpMsg: MSG
) => number | BigInt> = user32('DispatchMessageW', cLRESULT, [ cLPMSG ])

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
) => number> = user32('GetMessageW', cBOOL, [ out(cLPMSG), cHWND, cUINT, cUINT ])

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export const PostQuitMessage: koffi.KoffiFunc<(
    nExitCode: number
) => void> = user32('PostQuitMessage', cVOID, [ cINT ])

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export const TranslateMessage: koffi.KoffiFunc<(
    lpMsg: MSG
) => number> = user32('TranslateMessage', cBOOL, [ cLPMSG ])

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export const TranslateMessageEx: koffi.KoffiFunc<(
    lpMsg: MSG,
    flags: number
) => number> = user32('TranslateMessageEx', cBOOL, [ cLPMSG, cUINT ])

// #endregion

// #region Constants

/** Broadcast Special Message Recipient list */
export const enum BSM {
    ALLCOMPONENTS      = 0x00000000,
    VXDS               = 0x00000001,
    NETDRIVER          = 0x00000002,
    INSTALLABLEDRIVERS = 0x00000004,
    APPLICATIONS       = 0x00000008,
    ALLDESKTOPS        = 0x00000010,
}

/** Broadcast Special Message Flags */
export const enum BSF {
    QUERY              = 0x00000001,
    IGNORECURRENTTASK  = 0x00000002,
    FLUSHDISK          = 0x00000004,
    NOHANG             = 0x00000008,
    POSTMESSAGE        = 0x00000010,
    FORCEIFHUNG        = 0x00000020,
    NOTIMEOUTIFNOTHUNG = 0x00000040,
    ALLOWSFW           = 0x00000080,
    SENDNOTIFYMESSAGE  = 0x00000100,
    RETURNHDESK        = 0x00000200,
    LUID               = 0x00000400,
}

/** Return this value to deny a query. */
export const BROADCAST_QUERY_DENY = 0x424D5144

// #endregion
