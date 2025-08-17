import koffi from 'koffi-cream'
import { cDWORD, cHRESULT, cPVOID, type HRESULT } from './ctypes.js'
import type { COINIT_ } from './consts.js'

/** @internal */
export const olel32 = koffi.load('ole32.dll')

/**
 * Initializes the COM library for use by the calling thread, sets the thread's concurrency model,
 * and creates a new apartment for the thread if one is required.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-coinitializeex
 */
export function CoInitializeEx(coInit: COINIT_): HRESULT {
    CoInitializeEx.native ??= olel32.func('CoInitializeEx', cHRESULT, [ cPVOID, cDWORD ])
    return CoInitializeEx.native(null, coInit)
}
