import type { koffi } from '../../private.js'
import { cDWORD } from '../../ctypes.js'
import { kernel32 } from './_lib.js'

// #region Types
// #endregion

// #region Functions

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export const GetLastError: koffi.KoffiFunc<() => number> = kernel32('GetLastError', cDWORD, [])

// #endregion

// #region Constants
// #endregion
