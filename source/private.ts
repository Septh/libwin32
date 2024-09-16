import assert from 'node:assert'
import koffi from './stubs/koffi.js'

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

        // For use with `using` syntax (requires TypeScript 5.2+)
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

/*@__NO_SIDE_EFFECTS__*/
export function alias(name: string, type: koffi.IKoffiCType) {
    return koffi.alias(name, type)
}

/*@__NO_SIDE_EFFECTS__*/
export function opaque() {
    return koffi.opaque()
}

/*@__NO_SIDE_EFFECTS__*/
export function pointer(name: string, type: koffi.IKoffiCType, asterixCount: number = 1) {
    return koffi.pointer(name, type, asterixCount)
}

/*@__NO_SIDE_EFFECTS__*/
export function struct(name: string, def: Record<string, koffi.TypeSpecWithAlignment>) {
    return koffi.struct(name, def)
}

/*@__NO_SIDE_EFFECTS__*/
export function sizeof(type: koffi.TypeSpec) {
    return koffi.sizeof(type)
}

/*@__NO_SIDE_EFFECTS__*/
export function proto(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
    return koffi.proto(name, result, parameters)
}

/*@__NO_SIDE_EFFECTS__*/
export function register(thisValue: any, callback: Function, type: koffi.TypeSpec) {
    return koffi.register(thisValue, callback, type)
}

/*@__NO_SIDE_EFFECTS__*/
export function unregister(callback: koffi.IKoffiRegisteredCallback) {
    return koffi.unregister(callback)
}

/*@__NO_SIDE_EFFECTS__*/
export function out(type: koffi.TypeSpec) {
    return koffi.out(type)
}

/*@__NO_SIDE_EFFECTS__*/
export function inout(type: koffi.TypeSpec) {
    return koffi.inout(type)
}

export const textDecoder = /*@__PURE__*/new TextDecoder('utf-16')
