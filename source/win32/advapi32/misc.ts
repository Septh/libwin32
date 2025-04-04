import { koffi, textDecoder } from '../private.js'
import { cBOOL, cLPDWORD, cLPWSTR, type OUT } from '../ctypes.js'
import { advapi32 } from './_lib.js'

/**
 * Retrieves the name of the user associated with the current thread.
 */
export function GetUserName(): string | null {
    GetUserName.fn ??= advapi32.func('GetUserNameW', cBOOL, [ cLPWSTR, koffi.inout(cLPDWORD) ])

    const out = new Uint16Array(256)
    const len: OUT<number> = [ out.length ]
    return GetUserName.fn(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0] - 1))   // -1 because GetUserName() includes the final \0
}

/** @internal */
export declare namespace GetUserName {
    export var fn: koffi.KoffiFunc<(lpBuffer: Uint16Array, pcbBuffer: OUT<number>) => number>
}
