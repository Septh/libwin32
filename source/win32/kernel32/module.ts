import { koffi } from '../private.js'
import {
    cBOOL, cDWORD, cLPCWSTR,
    cHANDLE, type HMODULE
} from '../ctypes.js'
import type { GET_MODULE_HANDLE_EX_FLAG_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export const GetModuleHandle: (
    lpModuleName: string | null
) => HMODULE = /*#__PURE__*/kernel32.func('GetModuleHandleW', cHANDLE, [ cLPCWSTR ])

/**
 * Retrieves a module handle for the specified module and increments the module's reference count
 * unless GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT is specified.
 * The module must have been loaded by the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandleexw
 */
/*#__NO_SIDE_EFFECTS__*/
export function GetModuleHandleEx(
    dwFlags: GET_MODULE_HANDLE_EX_FLAG_,
    lpModuleName: string | null
): HMODULE | null {
    const hModule: [ HMODULE | null ] = [ null ]
    return _GetModuleHandleExW(dwFlags, lpModuleName, hModule) === 0
        ? null
        : hModule[0]
}

const _GetModuleHandleExW:(
    dwFlags: GET_MODULE_HANDLE_EX_FLAG_,
    lpModuleName: string | null,
    phModule: [ HMODULE | null ]
) => number = /*#__PURE__*/kernel32.func('GetModuleHandleExW', cBOOL, [ cDWORD, cLPCWSTR, koffi.out(koffi.pointer(cHANDLE)) ])
