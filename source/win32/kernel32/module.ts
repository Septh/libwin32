import { koffi } from '../../private.js'
import { cHINSTANCE, cLPCWSTR, type HINSTANCE } from '../../ctypes.js'
import { kernel32 } from './_lib.js'

// #region Types

export const cHMODULE = koffi.alias('HMODULE', cHINSTANCE)
export type HMODULE = HINSTANCE

// #endregion

// #region Functions

/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export const GetModuleHandle: (
    lpModuleName: string | null
) => HMODULE = /*#__PURE__*/kernel32.func('GetModuleHandleW', cHMODULE, [ cLPCWSTR ])

// #endregion
