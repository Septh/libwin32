import assert from 'node:assert'
import koffi from 'koffi-cream'

export { koffi }

export const textDecoder = /*#__PURE__*/new TextDecoder('utf-16')

export class Win32Dll implements Disposable {
    get x64() { return true }
    get Unicode() { return true }
    #lib: koffi.IKoffiLib

    constructor(dllName: string) {
        assert(this.#lib = koffi.load(dllName), `Could not load ${JSON.stringify(dllName)}.`)
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
