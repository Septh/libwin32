import { koffi } from '../../private.js'
import {
    cVOID, cBOOL, cDWORD, cINT, cUINT, cLONG,
    cLPDWORD,
    cLPARAM, cWPARAM, cLRESULT,
    type WPARAM, type LPARAM,
    type LRESULT
} from '../../ctypes.js'
import { user32 } from './_lib.js'
import { cHWND, type HWND } from './window.js'
import { cPOINT, type POINT } from './point.js'
import { cLUID, type LUID } from './misc.js'
import { cHDESK, type HDESK } from './desktop.js'
import type { BSF_ } from '../consts/BSF.js'

export const cMSG = koffi.struct({
    HWND:     cHWND,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

export const cLPMSG = koffi.pointer(cMSG)
export const cPMSG  = koffi.pointer(cMSG)

export interface MSG {
    HWND:    HWND
    message: number
    wParam:  number
    lParam:  number
    time:    number
    pt:      POINT
}

export const cBSMINFO = koffi.struct({
    cbSize: cUINT,
    hdesk: cHDESK,
    hwnd: cHWND,
    luid: cLUID,
})

export const cLPBSMINFO = koffi.pointer(cBSMINFO)
export const cPBSMINFO  = koffi.pointer(cBSMINFO)

export class BSMINFO {
    readonly cbSize = koffi.sizeof(cBSMINFO)
    declare hDesk?: HDESK
    declare hWnd?: HWND
    declare luid?: LUID
}


/**
 * Sends a message to the specified recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
/*#__NO_SIDE_EFFECTS__*/
export function BroadcastSystemMessage(
    flags: BSF_ | number,
    lpInfo: number | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM
): [ number, number | null ] {
    const out = typeof lpInfo === 'number' ? [ lpInfo ] as [ number ] : null
    const ret = _BroadcastSystemMessageW(flags, out, Msg, wParam, lParam)
    return [ ret, out?.[0] ?? null ]
}

const _BroadcastSystemMessageW: (
    flags: BSF_ | number,
    lpInfo: [ number ] | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM
) => number = /*#__PURE__*/user32.func('BroadcastSystemMessageW', cLONG, [ cDWORD, koffi.inout(cLPDWORD), cUINT, cWPARAM, cLPARAM ])



/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 */
/*#__NO_SIDE_EFFECTS__*/
export function BroadcastSystemMessageEx(
    flags: BSF_ | number,
    lpInfo: number | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM,
    psbmInfo: BSMINFO | null = null
): [ number, number | null ] {
    const out = typeof lpInfo === 'string' ? [ lpInfo ] as [ number ] : null
    const ret = _BroadcastSystemMessageExW(flags, out, Msg, wParam, lParam, psbmInfo)
    return [ ret, out?.[0] ?? null ]
}

const _BroadcastSystemMessageExW: (
    flags: BSF_ | number,
    lpInfo: [ number ] | null,
    Msg: number,
    wParam: WPARAM,
    lParam: LPARAM,
    psbmInfo: BSMINFO | null
) => number = /*#__PURE__*/user32.func('BroadcastSystemMessageExW', cLONG, [ cDWORD, koffi.inout(cLPDWORD), cUINT, cWPARAM, cLPARAM, koffi.out(cPBSMINFO) ])

/** Return this value to deny a query. */
export const BROADCAST_QUERY_DENY = 0x424D5144



/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export const DispatchMessage: (
    lpMsg: MSG
) => LRESULT = /*#__PURE__*/user32.func('DispatchMessageW', cLRESULT, [ cLPMSG ])



/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export const GetMessage: (
    lpMsg:         MSG,
    hWnd:          HWND | null | -1,
    wMsgFilterMin: number,
    wMsgFilterMax: number
) => number = /*#__PURE__*/user32.func('GetMessageW', cBOOL, [ koffi.out(cLPMSG), cHWND, cUINT, cUINT ])



/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export const PeekMessage: (
    lpMsg:         MSG,
    hWnd:          HWND | null | -1,
    wMsgFilterMin: number,
    wMsgFilterMax: number,
    wRemoveMsg:    number
) => number = /*#__PURE__*/user32.func('PeekMessageW', cBOOL, [ koffi.out(cLPMSG), cHWND, cUINT, cUINT, cUINT ])



/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export const PostQuitMessage: (
    nExitCode: number
) => void = /*#__PURE__*/user32.func('PostQuitMessage', cVOID, [ cINT ])



/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export const TranslateMessage: (
    lpMsg: MSG
) => number = /*#__PURE__*/user32.func('TranslateMessage', cBOOL, [ cLPMSG ])



/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export const TranslateMessageEx: (
    lpMsg: MSG,
    flags: number
) => number = /*#__PURE__*/user32.func('TranslateMessageEx', cBOOL, [ cLPMSG, cUINT ])



/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export const SendMessage: (
    hWnd:    HWND,
    Msg:     number,
    wParam:  WPARAM,
    lParam:  LPARAM
) => number | BigInt = /*#__PURE__*/user32.func('SendMessageW', cLRESULT, [ cHWND, cUINT, cWPARAM, cLPARAM ])
