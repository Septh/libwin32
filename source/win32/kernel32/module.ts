import { alias, type koffi } from '../../private.js'
import { cBOOL, cHANDLE, cHINSTANCE, cLPCWSTR, HANDLE, type HINSTANCE } from '../../ctypes.js'
import { kernel32 } from './_lib.js'

// #region Types

export const cHMODULE = alias('HMODULE', cHINSTANCE)
export type HMODULE = HINSTANCE

// #endregion

// #region Functions


/**
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 */
export const CloseHandle: koffi.KoffiFunc<(
    hObject: HANDLE<string>
) => number> = kernel32('CloseHandle', cBOOL, [ cHANDLE ])

/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export const GetModuleHandle: koffi.KoffiFunc<(
    lpModuleName: string | null
) => HMODULE> = kernel32('GetModuleHandleW', cHMODULE, [ cLPCWSTR ])

// #endregion
