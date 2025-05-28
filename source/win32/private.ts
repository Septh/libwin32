import assert from 'node:assert'
import koffi from 'koffi-cream'

export { koffi }

export const textDecoder  = /*#__PURE__*/new TextDecoder('utf-16')

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

export const enum Internals {
    SID_MAX_SUB_AUTHORITIES = 32
}
