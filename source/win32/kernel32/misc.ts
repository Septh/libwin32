import { koffi } from '../private.js'
import { cBOOL, cDWORD } from '../ctypes.js'
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
