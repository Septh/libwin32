import { load, type koffi } from '../../private.js'

const shell32lib = load('shell32.dll')

/*@__NO_SIDE_EFFECTS__*/
export function shell32(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
    return shell32lib.lib.func(name, result, parameters)
}
