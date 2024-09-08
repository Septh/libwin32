import { kernel32 } from './_alib.js';
import { cHMODULE } from './module.js';
import { cDWORD, cLPCWSTR } from '../../ctypes.js';
/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export const GetModuleHandleW = kernel32.lib.func('GetModuleHandleW', cHMODULE, [cLPCWSTR]);
/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export const GetLastError = kernel32.lib.func('GetLastError', cDWORD, []);
//# sourceMappingURL=_functions.js.map