import { textDecoder } from '../private.js'
import { cDWORD, cLPCVOID, cLPWSTR, cVOID, type HMODULE } from '../ctypes.js'
import type { FORMAT_MESSAGE_ } from '../consts/FORMAT_MESSAGE.js'
import { kernel32 } from './_lib.js'

/**
 * Formats a message string.
 *
 * Note: the Arguments parameter is not yet supported. Right now, you can use FormatMessage()
 *       to retrieve the message text for a system-defined error returned by GetLastError().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-formatmessagew
 */
export function FormatMessage(dwFlags: FORMAT_MESSAGE_, lpSource: HMODULE | string | null, dwMessageId: number, dwLanguageId: number): string {
    FormatMessage.native ??= kernel32.func('FormatMessageW', cDWORD, [ cDWORD, cLPCVOID, cDWORD, cDWORD, cLPWSTR, cDWORD, '...' as any ])

    const out = new Uint16Array(2048)
    const len = FormatMessage.native(
        dwFlags, lpSource, dwMessageId, dwLanguageId,
        out, out.length,
        'int', 0    // Fake va_list
    )
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export function GetLastError(): number {
    GetLastError.native ??= kernel32.func('GetLastError', cDWORD, [])
    return GetLastError.native()
}

/**
 * Sets the last-error code for the calling thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-setlasterror
 */
export function SetLastError(dwErrcode: number): void {
    SetLastError.native ??= kernel32.func('SetLastError', cVOID, [ cDWORD ])
    return SetLastError.native(dwErrcode)
}
