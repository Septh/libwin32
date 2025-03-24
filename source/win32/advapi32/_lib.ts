import { load, type koffi } from '../../private.js'

const advapi32lib = load('advapi32.dll')

/*@__NO_SIDE_EFFECTS__*/
export function advapi32(name: string, result: koffi.IKoffiCType, parameters: koffi.IKoffiCType[]) {
    return advapi32lib.lib.func(name, result, parameters)
}