import { koffi, textDecoder } from '../private.js'
import { cBOOL, cDWORD, cPWSTR, cHANDLE, type HMODULE, type OUT } from '../ctypes.js'
import type { GET_MODULE_HANDLE_EX_FLAG_ } from '../consts/GMH_EX_FLAGS.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves the fully qualified path for the file that contains the specified module.
 *
 * The module must have been loaded by the current process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulefilenamew
 */
export function GetModuleFileName(hModule: HMODULE): string | null {
    GetModuleFileName.native = kernel32.func('GetModuleFileNameW', cDWORD, [ cHANDLE, koffi.out(cPWSTR), cDWORD ])

    const out = new Uint16Array(1024)
    const len = GetModuleFileName.native(hModule, out, out.length)
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Retrieves a module handle for the specified module.
 *
 * The module must have been loaded by the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export function GetModuleHandle(lpModuleName: string | null): HMODULE | null {
    GetModuleHandle.native ??= kernel32.func('GetModuleHandleW', cHANDLE, [ cPWSTR ])
    return GetModuleHandle.native(lpModuleName)
}

/**
 * Retrieves a module handle for the specified module and increments the module's reference count
 * unless GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT is specified.
 *
 * The module must have been loaded by the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandleexw
 */
export function GetModuleHandleEx(dwFlags: GET_MODULE_HANDLE_EX_FLAG_, lpModuleName: string | null): HMODULE | null {
    GetModuleHandleEx.native ??= kernel32.func('GetModuleHandleExW', cBOOL, [ cDWORD, cPWSTR, koffi.out(koffi.pointer(cHANDLE)) ])

    const hModule: OUT<HMODULE | null> = [ null ]
    return GetModuleHandleEx.native(dwFlags, lpModuleName, hModule) === 0
        ? null
        : hModule[0]
}
