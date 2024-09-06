import assert from 'node:assert'

import koffi from './stubs/koffi.cjs'
export { koffi }

export interface WinDll extends Disposable {
    name: string
    lib: koffi.IKoffiLib
    x64: boolean
    Unicode: boolean
}

export function load(name: string): WinDll {
    const lib = koffi.load(name)
    assert(lib, `Could not load ${JSON.stringify(name)}.`)
    return {
        name,
        lib,
        x64: true,
        Unicode: true,

        // For use with `using` syntax (requires TypeScript 5.2+)
        [Symbol.dispose]() {
            lib.unload()
        }
    }
}
