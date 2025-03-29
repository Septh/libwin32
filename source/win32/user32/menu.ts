import { koffi } from '../../private.js'
import type { HANDLE } from '../../ctypes.js'

// #region Types

export const cHMENU = koffi.pointer('HMENU', koffi.opaque())
export type HMENU = HANDLE<'HMENU'>

// #endregion

// #region Functions
// #endregion
