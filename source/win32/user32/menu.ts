import { koffi } from '../../private.js'
import { cHANDLE, type HANDLE } from '../../ctypes.js'


// #region Types

export const cHMENU = koffi.alias('HMENU', cHANDLE)
export type HMENU = HANDLE<'HMENU'>

// #endregion

// #region Functions
// TODO
// #endregion

// #region Constants
// TODO
// #endregion
