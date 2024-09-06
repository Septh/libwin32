import { koffi } from '../../private.js'
import { cHANDLE, type HANDLE } from '../../ctypes.js'

export const cHICON = koffi.alias('HICON', cHANDLE)
export type HICON = HANDLE<'HICON'>
