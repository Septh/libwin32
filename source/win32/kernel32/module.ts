import { koffi, type POINTER } from '../private.js'
import { cBOOL, cDWORD, cLPCWSTR, cHANDLE, type HMODULE } from '../ctypes.js'
import type { GET_MODULE_HANDLE_EX_FLAG_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves a module handle for the specified module.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export function GetModuleHandle(lpModuleName: string | null): HMODULE | null {
    GetModuleHandle.fn ??= kernel32.func('GetModuleHandleW', cHANDLE, [ cLPCWSTR ])
    return GetModuleHandle.fn(lpModuleName)
}

/** @internal */
export declare namespace GetModuleHandle {
    export var fn: koffi.KoffiFunc<(lpModuleName: string | null) => HMODULE | null>
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
    GetModuleHandleEx.fn ??= kernel32.func('GetModuleHandleExW', cBOOL, [ cDWORD, cLPCWSTR, koffi.out(koffi.pointer(cHANDLE)) ])

    const hModule: POINTER<HMODULE | null> = [ null ]
    return GetModuleHandleEx.fn(dwFlags, lpModuleName, hModule) === 0
        ? null
        : hModule[0]
}

/** @internal */
export declare namespace GetModuleHandleEx {
    export var fn: koffi.KoffiFunc<(dwFlags: GET_MODULE_HANDLE_EX_FLAG_, lpModuleName: string | null, phModule: POINTER<HMODULE | null>) => number>
}
