import assert from 'node:assert'
import koffi from 'koffi'

export { koffi }

export const textDecoder = new TextDecoder('utf-16')

export class Win32Dll implements Disposable {
    readonly x64 = true
    readonly Unicode = true
    #lib: koffi.IKoffiLib
    constructor(dllName: string) {
        this.#lib = koffi.load(dllName)
        assert(this.#lib, `Could not load ${JSON.stringify(dllName)}.`)
    }

    // For use with the `using` syntax (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        this.#lib?.unload()
        this.#lib = undefined!
    }

    unload() {
        this[Symbol.dispose]()
    }

    func(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
        return /*#__PURE__*/this.#lib.func(name, result, parameters)
    }
}

// koffi.out() and koffi.inout() expect a table with a single entry.
export type OUT<T> = [ T ]
export type NUMBER_OUT = OUT<number>
