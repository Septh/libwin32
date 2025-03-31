import { koffi, textDecoder } from '../../private.js'
import { cBOOL, cDWORD, cHANDLE, cLPDWORD, cLPWSTR, type HANDLE } from '../../ctypes.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
/*#__NO_SIDE_EFFECTS__*/
export function QueryFullProcessImageName(
    hProcess: HANDLE,
    dwFlags: number
): string | null {
    const exeName = new Uint16Array(256)
    const dwSize: [ number ]  = [ exeName.length ]
    return _QueryFullProcessImageNameW(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName).slice(0, dwSize[0])
}

const _QueryFullProcessImageNameW: (
    hProcess: HANDLE,
    dwFlags: number,
    exeName: Uint16Array,
    dwSize: [ number ]
) => number = /*#__PURE__*/kernel32.func('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, koffi.out(cLPWSTR), koffi.inout(cLPDWORD) ])
