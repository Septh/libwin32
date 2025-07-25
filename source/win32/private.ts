import assert from 'node:assert'
import koffi from 'koffi-cream'

export { koffi }

export class Win32Dll implements Disposable {
    get x64() { return true }
    get Unicode() { return true }
    #dll: string
    #lib?: koffi.IKoffiLib

    constructor(dll: string) {
        this.#dll = dll
        assert(this.#lib = koffi.load(dll), `Could not load ${JSON.stringify(dll)}.`)
    }

    // For use with the `using` syntax (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        this.#lib?.unload()
        this.#lib = undefined
    }

    unload() {
        this[Symbol.dispose]()
    }

    func(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
        assert(this.#lib, `${JSON.stringify(this.#dll)} has been unloaded.`)
        return /*#__PURE__*/this.#lib.func(name, result, parameters)
    }
}

export const binaryBuffer = /*#__PURE__*/Buffer.alloc(32768)
export const textDecoder  = /*#__PURE__*/new TextDecoder('utf-16')

export class StringOutputBuffer {
    readonly buffer: Buffer<ArrayBuffer>
    readonly array: Uint16Array
    readonly pLength: [number]
    get length() { return this.pLength[0] }

    constructor(length: number, from?: string) {
        this.buffer  = Buffer.allocUnsafe(length * Uint16Array.BYTES_PER_ELEMENT)
        this.array   = new Uint16Array(this.buffer.buffer, this.buffer.byteOffset, length)
        this.pLength = [length]

        if (typeof from === 'string') {
            assert(from.length <= length)
            for (let i = 0, len = from.length; i < len; i++)
                this.array[i] = from.charCodeAt(i)
        }
    }

    decode(length: number = this.length): string {
        return textDecoder.decode(this.array.subarray(0, length))
    }
}

/** Various Win32 constants. */
export const enum Internals {

    // minwindef.h
    MAX_PATH = 260,

    // winnt.h
    ACL_REVISION = 2,
    ANYSIZE_ARRAY = 1,
    CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION = 1,
    SID_HASH_SIZE = 32,
    SID_MAX_SUB_AUTHORITIES = 15,
    SID_RECOMMENDED_SUB_AUTHORITIES = 1,
    TOKEN_SOURCE_LENGTH = 8,

    // lmcons.h
    UNLEN = 256,
    GNLEN = UNLEN,
    PWLEN = 256,

    // misc
    ERROR_SUCCESS  = 0,
    MAX_KEY_LENGTH = 255,
    MAX_VALUE_NAME = 16383,
    MAX_NAME = 256
}

/** koffi.out() and koffi.inout() expect a table with a single entry. */
export type OUT<T> = [T]
