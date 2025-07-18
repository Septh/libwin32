import assert from 'node:assert'
import koffi from 'koffi-cream'

export { koffi }

export const textDecoder  = /*#__PURE__*/new TextDecoder('utf-16')
export const outputBuffer = /*#__PURE__*/new ArrayBuffer(8192)

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

/** @internal Various Win32 constants. */
export const enum Internals {
    // winnt.h
    ACL_REVISION                                  = 2,
    SID_REVISION                                  = 1,
    SID_MAX_SUB_AUTHORITIES                       = 15,
    SID_RECOMMENDED_SUB_AUTHORITIES               = 1,
    SID_HASH_SIZE                                 = 32,
    CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION = 1,
    TOKEN_SOURCE_LENGTH                           = 8,

    // lmcons.h
    UNLEN = 256,
    GNLEN = UNLEN,
    PWLEN = 256,
}
