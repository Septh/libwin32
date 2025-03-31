import { kernel32 } from './_lib.js'
import { cDWORD, cVOID } from '../../ctypes.js'

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export const GetLastError: () => number = /*#__PURE__*/kernel32.func('GetLastError', cDWORD, [])

/**
 * Sets the last-error code for the calling thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-setlasterror
 */
export const SetLastError: (dwErrcode: number) => void = /*#__PURE__*/kernel32.func('SetLastError', cVOID, [ cDWORD ])
