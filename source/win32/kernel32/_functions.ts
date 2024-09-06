import { koffi } from '../../private.js'
import { kernel32 } from './_alib.js'
import { cHMODULE, type HMODULE } from './module.js'
import { cDWORD, cLPCWSTR } from '../../ctypes.js'

/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export const GetModuleHandleW: koffi.KoffiFunc<(
    lpModuleName: string | null
) => HMODULE> = kernel32.lib.func('GetModuleHandleW', cHMODULE, [ cLPCWSTR ])

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export const GetLastError: koffi.KoffiFunc<() => number> = kernel32.lib.func('GetLastError', cDWORD, [])
