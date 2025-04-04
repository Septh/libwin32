import { koffi, textDecoder, type OUT } from '../private.js'
import { cBOOL, cDWORD, cLPWSTR, cLPCWSTR, cHANDLE, type HMODULE } from '../ctypes.js'
import type { GET_MODULE_HANDLE_EX_FLAG_ } from '../consts.js'
import { kernel32 } from './_lib.js'

/**
 * Retrieves the fully qualified path for the file that contains the specified module.
 *
 * The module must have been loaded by the current process.
 */
export function GetModuleFileName(hModule: HMODULE): string | null {
    GetModuleFileName.fn = kernel32.func('GetModuleFileNameW', cDWORD, [ cHANDLE, koffi.out(cLPWSTR), cDWORD ])

    const out = new Uint16Array(1024)
    const len = GetModuleFileName.fn(hModule, out, out.length)
    return textDecoder.decode(out.subarray(0, len))
}

/** @internal */
export declare namespace GetModuleFileName {
    export var fn: koffi.KoffiFunc<(hModule: HMODULE, lpFilename: Uint16Array, nSize: number) => number>
}

/**
 * Retrieves a module handle for the specified module.
 *
 * The module must have been loaded by the calling process.
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
export function GetModuleHandleEx(dwFlags: GET_MODULE_HANDLE_EX_FLAG_ | number, lpModuleName: string | null): HMODULE | null {
    GetModuleHandleEx.fn ??= kernel32.func('GetModuleHandleExW', cBOOL, [ cDWORD, cLPCWSTR, koffi.out(koffi.pointer(cHANDLE)) ])

    const hModule: OUT<HMODULE | null> = [ null ]
    return GetModuleHandleEx.fn(dwFlags, lpModuleName, hModule) === 0
        ? null
        : hModule[0]
}

/** @internal */
export declare namespace GetModuleHandleEx {
    export var fn: koffi.KoffiFunc<(dwFlags: GET_MODULE_HANDLE_EX_FLAG_ | number, lpModuleName: string | null, phModule: OUT<HMODULE | null>) => number>
}
