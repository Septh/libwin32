import { koffi } from '../../private.js'
import type { __HANDLE__ } from '../../ctypes.js'

export const cHBRUSH = koffi.pointer(koffi.opaque())
export type HBRUSH = __HANDLE__<'HBRUSH'>
