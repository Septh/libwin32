import { koffi, textDecoder } from '../private.js'
import { cBOOL, cDWORD, cLPDWORD, cLPWSTR, type OUT } from '../ctypes.js'
import { kernel32 } from './_lib.js'

/**
 * Generates simple tones on the speaker.
 */
export function Beep(dwFreq: number, dwDuration: number): boolean {
    Beep.fn ??= kernel32.func('Beep', cBOOL, [ cDWORD, cDWORD ])
    return !!Beep.fn(dwFreq, dwDuration)
}

/** @internal */
export namespace Beep {
    export var fn: koffi.KoffiFunc<(dwFreq: number, dwDuration: number) => number>
}

/**
 * Retrieves the NetBIOS name of the local computer.
 */
export function GetComputerName(): string | null {
    GetComputerName.fn ??= kernel32.func('GetComputerNameW', cBOOL, [ cLPWSTR, koffi.inout(cLPDWORD) ])

    const out = new Uint16Array(256)
    const len: OUT<number> = [ out.length ]
    return GetComputerName.fn(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0]))
}

/** @internal */
export declare namespace GetComputerName {
    export var fn: koffi.KoffiFunc<(lpBuffer: Uint16Array, nSize: OUT<number>) => number>
}
