import { koffi } from '../../private.js'
import { cHANDLE, type HANDLE } from '../../ctypes.js'

export const cHMENU = koffi.alias('HMENU', cHANDLE)
export type HMENU = HANDLE<'HMENU'>
