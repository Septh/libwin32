import { load, type koffi } from '../../private.js'

const user32lib = load('user32.dll')

/*@__NO_SIDE_EFFECTS__*/
export function user32(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
    return user32lib.lib.func(name, result, parameters)
}
