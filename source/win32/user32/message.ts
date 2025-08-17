import koffi from 'koffi-cream'
import { type OUT } from '../private.js'
import {
    cVOID, cBOOL, cINT, cUINT, cLONG, cDWORD, cPDWORD,
    cHANDLE, type HWND,
    cLRESULT, type LRESULT, cWPARAM, type WPARAM, cLPARAM, type LPARAM
} from '../ctypes.js'
import { cBSMINFO, BSMINFO, cMSG, type MSG } from '../structs.js'
import { BSM_, type BSF_, type PM_ } from '../consts.js'
import { user32 } from './lib.js'

export interface BroadcastSystemMessageResult {
    success: boolean
    /**
     * If the flags parameter is `BSF_QUERY` and at least one recipient returned `BROADCAST_QUERY_DENY`,
     * `success` will be `true` and these flags tells you what components denied the query.
     */
    denied?: BSM_
}

export interface BroadcastSystemMessageExResult extends BroadcastSystemMessageResult {
    /**
     * If the flags parameter is `BSF_QUERY` and at least one recipient returned `BROADCAST_QUERY_DENY`,
     * `success` will be `true` and this structure tells you what recipient denied the query.
     */
    denier?: BSMINFO
}

/**
 * Sends a message to the specified recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
export function BroadcastSystemMessage(flags: BSF_, info: BSM_ | null, msg: number, wParam: WPARAM, lParam: LPARAM): BroadcastSystemMessageResult {
    BroadcastSystemMessage.native ??= user32.func('BroadcastSystemMessageW', cLONG, [ cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM ])

    const pBsm: OUT<BSM_> = [info ?? BSM_.ALLCOMPONENTS]
    const ret = BroadcastSystemMessage.native(flags, pBsm, msg, wParam, lParam)
    return ret === 0
        ? { success: true,  denied: pBsm[0] }
        : { success: ret > 0 }
}

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 *
 */
export function BroadcastSystemMessageEx(flags: BSF_, info: BSM_ | null, msg: number, wParam: WPARAM, lParam: LPARAM): BroadcastSystemMessageExResult {
    BroadcastSystemMessageEx.native ??= user32.func('BroadcastSystemMessageExW', cLONG, [ cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM, koffi.out(koffi.pointer(cBSMINFO)) ])

    const pBsm: OUT<BSM_> = [info ?? BSM_.ALLCOMPONENTS]
    const bsmInfo = new BSMINFO()
    const ret = BroadcastSystemMessageEx.native(flags, pBsm, msg, wParam, lParam, bsmInfo)
    return ret === 0
        ? { success: true, denied: pBsm[0], denier: bsmInfo }
        : { success: ret > 0 }
}

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export function DispatchMessage(msg: MSG): LRESULT {
    DispatchMessage.native ??= user32.func('DispatchMessageW', cLRESULT, [koffi.pointer(cMSG)])
    return DispatchMessage.native(msg)
}

/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export function GetMessage(hWnd: HWND | null | -1, msgFilterMin: number = 0, msgFilterMax: number = 0): MSG | null {
    GetMessage.native ??= user32.func('GetMessageW', cBOOL, [ koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT ])

    const msg = {} as MSG
    return GetMessage.native(msg, hWnd, msgFilterMin, msgFilterMax) !== 0 ? msg : null
}

/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export function PeekMessage(hWnd: HWND | null | -1, msgFilterMin: number, msgFilterMax: number, removeMsg: PM_): MSG | null {
    PeekMessage.native ??= user32.func('PeekMessageW', cBOOL, [ koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT, cUINT ])

    const msg = {} as MSG
    return PeekMessage.native(msg, hWnd, msgFilterMin, msgFilterMax, removeMsg) !== 0 ? msg : null
}

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export function PostQuitMessage(exitCode: number): void {
    PostQuitMessage.native ??= user32.func('PostQuitMessage', cVOID, [ cINT ])
    PostQuitMessage.native(exitCode)
}

/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export function SendMessage(hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    SendMessage.native ??= user32.func('SendMessageW', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ])
    return SendMessage.native(hWnd, msg, wParam, lParam)
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export function TranslateMessage(msg: MSG): boolean {
    TranslateMessage.native ??= user32.func('TranslateMessage', cBOOL, [ koffi.pointer(cMSG) ])
    return TranslateMessage.native(msg) !== 0
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export function TranslateMessageEx(msg: MSG, flags: number): boolean {
    TranslateMessageEx.native ??= user32.func('TranslateMessageEx', cBOOL, [ koffi.pointer(cMSG), cUINT ])
    return TranslateMessageEx.native(msg, flags) !== 0
}
