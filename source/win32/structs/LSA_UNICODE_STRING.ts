import { koffi } from '../private.js'
import { cUSHORT, cPWSTR } from '../ctypes.js'

/**
 * Used by various Local Security Authority (LSA) functions to specify a Unicode string.
 */
export class LSA_UNICODE_STRING {
    Length: number // The length, in bytes, of the string pointed to by the Buffer member, not including the terminating null character, if any.
    MaximumLength: number // The total size, in bytes, of the memory allocated for Buffer. Up to MaximumLength bytes can be written into the buffer without trampling memory.
    Buffer: Uint16Array

    constructor(string: string)
    constructor(length: number)
    constructor(strOrLen: string | number) {
        this.Buffer = typeof strOrLen === 'string'
            ? Uint16Array.from(strOrLen, c => c.charCodeAt(0))
            : new Uint16Array(strOrLen)
        this.Length = this.MaximumLength = this.Buffer.byteLength
    }
}

export const cLSA_UNICODE_STRING = koffi.struct('LSA_UNICODE_STRING', {
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cPWSTR
})
