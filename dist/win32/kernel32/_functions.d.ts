import { koffi } from '../../private.js';
import { type HMODULE } from './module.js';
/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export declare const GetModuleHandleW: koffi.KoffiFunc<(lpModuleName: string | null) => HMODULE>;
/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export declare const GetLastError: koffi.KoffiFunc<() => number>;
//# sourceMappingURL=_functions.d.ts.map