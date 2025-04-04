import { koffi, type NUMBER_OUT } from '../private.js'
import {
    cVOID, cBOOL, cDWORD, cINT, cUINT, cLONG, cLPDWORD,
    cLPARAM, type LPARAM, cWPARAM, type WPARAM, cLRESULT, type LRESULT,
    cHANDLE, type HWND, type POINT, type HDESK,
    cLUID, type LUID,
} from '../ctypes.js'
import type { BSF_ } from '../consts.js'
import { user32 } from './_lib.js'

export const cMSG = koffi.struct({
    HWND: cHANDLE,
    message: cUINT,
    wParam: cWPARAM,
    lParam: cLPARAM,
    time: cDWORD,
    pt: cHANDLE,
    lPrivate: cDWORD
}), cPMSG = koffi.pointer(cMSG), cLPMSG = koffi.pointer(cMSG)

export interface MSG {
    HWND: HWND
    message: number
    wParam: number
    lParam: number
    time: number
    pt: POINT
}

export const cBSMINFO = koffi.struct({
    cbSize: cUINT,
    hdesk: cHANDLE,
    hwnd: cHANDLE,
    luid: cLUID,
}), cPBSMINFO = koffi.pointer(cBSMINFO), cLPBSMINFO = koffi.pointer(cBSMINFO)

export class BSMINFO {
    readonly cbSize = koffi.sizeof(cBSMINFO)
    declare hDesk?: HDESK
    declare hWnd?: HWND
    declare luid?: LUID
}

/**
 * Sends a message to the specified recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessagew
 */
export function BroadcastSystemMessage(flags: BSF_ | number, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM): [number, number | null] {
    BroadcastSystemMessage.fn ??= user32.func('BroadcastSystemMessageW', cLONG, [cDWORD, koffi.inout(cLPDWORD), cUINT, cWPARAM, cLPARAM])

    const out = typeof lpInfo === 'number' ? [lpInfo] as NUMBER_OUT : null
    const ret = BroadcastSystemMessage.fn(flags, out, Msg, wParam, lParam)
    return [ret, out?.[0] ?? null]
}

/** @internal */
export declare namespace BroadcastSystemMessage {
    export var fn: koffi.KoffiFunc<(flags: BSF_ | number, lpInfo: NUMBER_OUT | null, Msg: number, wParam: WPARAM, lParam: LPARAM) => number>
}

/**
 * Sends a message to the specified recipients. This function is similar to BroadcastSystemMessage
 * except that this function can return more information from the recipients.
 *
 * Note: in libwin32, the function returns a tuple of `[ success, lpInfo ]`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-broadcastsystemmessageexw
 */
export function BroadcastSystemMessageEx(flags: BSF_ | number, lpInfo: number | null, Msg: number, wParam: WPARAM, lParam: LPARAM, psbmInfo: BSMINFO | null = null): [number, number | null] {
    BroadcastSystemMessageEx.fn ??= user32.func('BroadcastSystemMessageExW', cLONG, [cDWORD, koffi.inout(cLPDWORD), cUINT, cWPARAM, cLPARAM, koffi.out(cPBSMINFO)])

    const out = typeof lpInfo === 'string' ? [lpInfo] as NUMBER_OUT : null
    const ret = BroadcastSystemMessageEx.fn(flags, out, Msg, wParam, lParam, psbmInfo)
    return [ret, out?.[0] ?? null]
}

/** @internal */
export declare namespace BroadcastSystemMessageEx {
    export var fn: koffi.KoffiFunc<(flags: BSF_ | number, lpInfo: NUMBER_OUT | null, Msg: number, wParam: WPARAM, lParam: LPARAM, psbmInfo: BSMINFO | null) => number>
}

/**
 * Dispatches a message to a window procedure.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dispatchmessagew
 */
export function DispatchMessage(lpMsg: MSG): LRESULT {
    DispatchMessage.fn ??= user32.func('DispatchMessageW', cLRESULT, [cLPMSG])
    return DispatchMessage.fn(lpMsg)
}

/** @internal */
export declare namespace DispatchMessage {
    export var fn: koffi.KoffiFunc<(lpMsg: MSG) => LRESULT>
}

/**
 * Retrieves a message from the calling thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getmessagew
 */
export function GetMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number): boolean {
    GetMessage.fn ??= user32.func('GetMessageW', cBOOL, [koffi.out(cLPMSG), cHANDLE, cUINT, cUINT])
    return !!GetMessage.fn(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax)
}

/** @internal */
export declare namespace GetMessage {
    export var fn: koffi.KoffiFunc<(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number) => number>
}

/**
 * Checks the thread message queue for a posted message.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-peekmessagew
 */
export function PeekMessage(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number, wRemoveMsg: number): boolean {
    PeekMessage.fn ??= user32.func('PeekMessageW', cBOOL, [koffi.out(cLPMSG), cHANDLE, cUINT, cUINT, cUINT])
    return !!PeekMessage.fn(lpMsg, hWnd, wMsgFilterMin, wMsgFilterMax, wRemoveMsg)
}

/** @internal */
export declare namespace PeekMessage {
    export var fn: koffi.KoffiFunc<(lpMsg: MSG, hWnd: HWND | null | -1, wMsgFilterMin: number, wMsgFilterMax: number, wRemoveMsg: number) => number>
}

/**
 * Indicates to the system that a thread has made a request to terminate (quit).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-postquitmessage
 */
export function PostQuitMessage(nExitCode: number): void {
    PostQuitMessage.fn ??= user32.func('PostQuitMessage', cVOID, [cINT])
    return PostQuitMessage.fn(nExitCode)
}

/** @internal */
export declare namespace PostQuitMessage {
    export var fn: koffi.KoffiFunc<(nExitCode: number) => void>
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-translatemessage
 */
export function TranslateMessage(lpMsg: MSG): boolean {
    TranslateMessage.fn ??= user32.func('TranslateMessage', cBOOL, [cLPMSG])
    return !!TranslateMessage.fn(lpMsg)
}

/** @internal */
export declare namespace TranslateMessage {
    export var fn: koffi.KoffiFunc<(lpMsg: MSG) => number>
}

/**
 * Translates virtual-key messages into character messages.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/translatemessageex
 */
export function TranslateMessageEx(lpMsg: MSG, flags: number): boolean {
    TranslateMessageEx.fn ??= user32.func('TranslateMessageEx', cBOOL, [cLPMSG, cUINT])
    return !!TranslateMessageEx.fn(lpMsg, flags)
}

/** @internal */
export declare namespace TranslateMessageEx {
    export var fn: koffi.KoffiFunc<(lpMsg: MSG, flags: number) => number>
}

/**
 * Sends a message to the specified window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendmessagew
 */
export function SendMessage(hWnd: HWND, Msg: number, wParam: WPARAM, lParam: LPARAM): LRESULT {
    SendMessage.fn ??= user32.func('SendMessageW', cLRESULT, [cHANDLE, cUINT, cWPARAM, cLPARAM])
    return SendMessage.fn(hWnd, Msg, wParam, lParam)
}

/** @internal */
export declare namespace SendMessage {
    export var fn: koffi.KoffiFunc<(hWnd: HWND, Msg: number, wParam: WPARAM, lParam: LPARAM) => LRESULT>
}
