import { koffi, textDecoder } from '../private.js'
import { cBOOL, cDWORD, cPDWORD, cPWSTR, type OUT } from '../ctypes.js'
import { kernel32 } from './_lib.js'

/**
 * Generates simple tones on the speaker.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/utilapiset/nf-utilapiset-beep
 */
export function Beep(dwFreq: number, dwDuration: number): boolean {
    Beep.native ??= kernel32.func('Beep', cBOOL, [ cDWORD, cDWORD ])
    return !!Beep.native(dwFreq, dwDuration)
}

/**
 * Retrieves the NetBIOS name of the local computer.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getcomputernamew
 */
export function GetComputerName(): string | null {
    GetComputerName.native ??= kernel32.func('GetComputerNameW', cBOOL, [ cPWSTR, koffi.inout(cPDWORD) ])

    const out = new Uint16Array(256)
    const len: OUT<number> = [ out.length ]
    return GetComputerName.native(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0]))
}
