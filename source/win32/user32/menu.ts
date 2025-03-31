import { koffi } from '../../private.js'
import type { __HANDLE__ } from '../../ctypes.js'

export const cHMENU = koffi.pointer(koffi.opaque())
export type HMENU = __HANDLE__<'HMENU'>
