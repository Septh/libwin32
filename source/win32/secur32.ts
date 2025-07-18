import { koffi, Win32Dll, StringOutputBuffer, Internals } from './private.js'
import { cBOOL, cINT, cDWORD, cSTR } from './ctypes.js'
import type { EXTENDED_NAME_FORMAT } from './consts.js'

const secur32 = /*#__PURE__*/new Win32Dll('secur32.dll')

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernameexw
 */
export function GetUserNameEx(nameFormat: EXTENDED_NAME_FORMAT): string | null {
    GetUserNameEx.native ??= secur32.func('GetUserNameExW', cBOOL, [ cINT, cSTR, koffi.inout(koffi.pointer(cDWORD)) ])

    const str = new StringOutputBuffer(Internals.UNLEN)
    if (GetUserNameEx.native(nameFormat, str.buffer, str.pLength))
        return str.decode()
    return null
}
