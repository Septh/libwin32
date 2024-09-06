import { koffi } from '../../private.js'
import { cHANDLE, type HANDLE } from '../../ctypes.js'

export const cHBRUSH = koffi.alias('HBRUSH', cHANDLE)
export type HBRUSH = HANDLE<'HBRUSH'>
