import { koffi } from '../private.js'
import {
    cVOID, cBOOL, cDWORD, cINT, cUINT, cLONG, cPDWORD,
    cLPARAM, type LPARAM, cWPARAM, type WPARAM, cLRESULT, type LRESULT,
    cHANDLE, type HWND,
    type OUT
} from '../ctypes.js'
import type { BSF_ } from '../consts/BSF.js'
import { cMSG, type MSG } from '../structs/MSG.js'
import { cBSMINFO, type BSMINFO } from '../structs/BSMINFO.js'
import { user32 } from './_lib.js'

/**
 * Sends a message to the specified recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
export function BroadcastSystemMessage(flags: BSF_, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM): [number, number | null] {
    BroadcastSystemMessage.native ??= user32.func('BroadcastSystemMessageW', cLONG, [cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM])

    const out = typeof lpInfo === 'number' ? [lpInfo] as OUT<number> : null
    const ret = BroadcastSystemMessage.native(flags, out, Msg, wParam, lParam)
    return [ret, out?.[0] ?? null]
}

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 */
export function BroadcastSystemMessageEx(flags: BSF_, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM, psbmInfo: BSMINFO | null = null): [number, number | null] {
    BroadcastSystemMessageEx.native ??= user32.func('BroadcastSystemMessageExW', cLONG, [cDWORD, koffi.inout(cPDWORD), cUINT, cWPARAM, cLPARAM, koffi.out(koffi.pointer(cBSMINFO))])

    const out = typeof lpInfo === 'string' ? [lpInfo] as OUT<number> : null
    const ret = BroadcastSystemMessageEx.native(flags, out, Msg, wParam, lParam, psbmInfo)
    return [ret, out?.[0] ?? null]
}

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export function DispatchMessage(lpMsg: MSG): LRESULT {
    DispatchMessage.native ??= user32.func('DispatchMessageW', cLRESULT, [koffi.pointer(cMSG)])
    return DispatchMessage.native(lpMsg)
}

/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export function GetMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number): boolean {
    GetMessage.native ??= user32.func('GetMessageW', cBOOL, [koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT])
    return !!GetMessage.native(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax)
}

/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export function PeekMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number, wRemoveMsg: number): boolean {
    PeekMessage.native ??= user32.func('PeekMessageW', cBOOL, [koffi.out(koffi.pointer(cMSG)), cHANDLE, cUINT, cUINT, cUINT])
    return !!PeekMessage.native(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax, wRemoveMsg)
}

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export function PostQuitMessage(nExitCode: number): void {
    PostQuitMessage.native ??= user32.func('PostQuitMessage', cVOID, [cINT])
    return PostQuitMessage.native(nExitCode)
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export function TranslateMessage(lpMsg: MSG): boolean {
    TranslateMessage.native ??= user32.func('TranslateMessage', cBOOL, [koffi.pointer(cMSG)])
    return !!TranslateMessage.native(lpMsg)
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export function TranslateMessageEx(lpMsg: MSG, flags: number): boolean {
    TranslateMessageEx.native ??= user32.func('TranslateMessageEx', cBOOL, [koffi.pointer(cMSG), cUINT])
    return !!TranslateMessageEx.native(lpMsg, flags)
}

/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export function SendMessage(hWnd: HWND, Msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    SendMessage.native ??= user32.func('SendMessageW', cLRESULT, [cHANDLE, cUINT, cWPARAM, cLPARAM])
    return SendMessage.native(hWnd, Msg, wParam, lParam)
}
