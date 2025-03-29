import assert from 'node:assert'
import koffi from 'koffi'

export { koffi }

export interface Win32Dll extends Disposable {
    name: string
    lib: koffi.IKoffiLib
    x64: boolean
    Unicode: boolean
}

/*@__NO_SIDE_EFFECTS__*/
export function load(name: string): Win32Dll {
    const lib = koffi.load(name)
    assert(lib, `Could not load ${JSON.stringify(name)}.`)
    return {
        name,
        lib,
        x64: true,
        Unicode: true,

        // For use with the `using` syntax (requires TypeScript 5.2+)
        [Symbol.dispose]() {
            if (this.lib) {
                this.lib.unload()
                this.lib = undefined!
            }
        },
        // @ts-expect-error
        __proto__: null
    }
}

export const textDecoder = /*@__PURE__*/new TextDecoder('utf-16')

export class Win32Api implements Disposable {
    readonly x64 = true
    readonly Unicode = true
    private readonly lib: koffi.IKoffiLib
    constructor(dllName: string) {
        this.lib = koffi.load(dllName)
        assert(this.lib, `Could not load ${JSON.stringify(dllName)}.`)
    }

    // For use with the `using` syntax (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        this.lib?.unload()
        // @ts-expect-error
        this.lib = undefined!
    }

    unload() {
        this[Symbol.dispose]()
    }
}
