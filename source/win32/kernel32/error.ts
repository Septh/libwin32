import { textDecoder } from '../private.js'
import {
    cDWORD, cLPCVOID, cLPWSTR, cVOID,
    type HMODULE
} from '../ctypes.js'
import type { FORMAT_MESSAGE_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export const GetLastError: () => number = /*#__PURE__*/kernel32.func('GetLastError', cDWORD, [])

/**
 * Sets the last-error code for the calling thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-setlasterror
 */
export const SetLastError: (dwErrcode: number) => void = /*#__PURE__*/kernel32.func('SetLastError', cVOID, [ cDWORD ])

/**
 * Formats a message string.
 *
 * Note: the Arguments parameter is not yet supported. Right now, you can use FormatMessage()
 *       to retrieve the message text for a system-defined error returned by GetLastError().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-formatmessagew
 */
export function FormatMessage(
    dwFlags: FORMAT_MESSAGE_ | number,
    lpSource: HMODULE | string | null,
    dwMessageId: number,
    dwLanguageId: number
): string {
    const out = new Uint16Array(2048)
    const len = _FormatMessageW(dwFlags, lpSource, dwMessageId, dwLanguageId, out, out.length, 'int', 0)
    return textDecoder.decode(out.slice(0, len))
}

const _FormatMessageW: (
    dwFlags: number,
    lpSource: HMODULE | string | null,
    dwMessageId: number,
    dwLanguageId: number,
    lpBuffer: Uint16Array,
    nSize: number,
    ...args: any[]
) => number = /*#__PURE__*/kernel32.func('FormatMessageW', cDWORD, [ cDWORD, cLPCVOID, cDWORD, cDWORD, cLPWSTR, cDWORD, '...' as any ])
