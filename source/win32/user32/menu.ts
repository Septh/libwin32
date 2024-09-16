import { opaque, pointer } from '../../private.js'
import type { HANDLE } from '../../ctypes.js'

// #region Types

export const cHMENU = pointer('HMENU', opaque())
export type HMENU = HANDLE<'HMENU'>

// #endregion

// #region Functions
// #endregion
