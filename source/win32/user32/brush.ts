import { opaque, pointer } from '../../private.js'
import type { HANDLE } from '../../ctypes.js'

// #region Types

export const cHBRUSH = pointer('HBRUSH', opaque())
export type HBRUSH = HANDLE<'HBRUSH'>

// #endregion

// #region Functions
// #endregion

// #region Constants
// #endregion
