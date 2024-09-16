import { load, type koffi } from '../../private.js'

const kernel32lib = load('kernel32.dll')

/*@__NO_SIDE_EFFECTS__*/
export function kernel32(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
    return /*@__PURE__*/kernel32lib.lib.func(name, result, parameters)
}
