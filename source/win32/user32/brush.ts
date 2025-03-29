import { koffi } from '../../private.js'
import type { HANDLE } from '../../ctypes.js'

// #region Types

export const cHBRUSH = koffi.pointer('HBRUSH', koffi.opaque())
export type HBRUSH = HANDLE<'HBRUSH'>

// #endregion

// #region Functions
// #endregion
