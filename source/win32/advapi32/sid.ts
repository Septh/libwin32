import type { koffi } from '../private.js'
import type { LSA_UNICODE_STRING } from './lsa.js'


export function GetSidInformation(lucName: LSA_UNICODE_STRING) {
}

/** @internal */
export namespace GetSidInformation {
    export var fn: koffi.KoffiFunc<() => void>
}
