import { koffi } from '../../private.js'
import { cHINSTANCE, type HINSTANCE } from '../../ctypes.js'

export const cHMODULE = koffi.alias('HMODULE', cHINSTANCE)
export type HMODULE = HINSTANCE
