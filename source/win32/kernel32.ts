import { koffi, Win32Dll, textDecoder } from './private.js'
import {
    cVOID, cBOOL, cDWORD, cPVOID, cPDWORD, cPWSTR,
    cHANDLE, type HANDLE, type HMODULE, type HWND,
    type OUT
} from './ctypes.js'
import type { FORMAT_MESSAGE_ } from './consts/FORMAT_MESSAGE.js'
import type { GET_MODULE_HANDLE_EX_FLAG_ } from './consts/GMH_EX_FLAGS.js'
import type { PSAR_ } from './consts/PSAR.js'

const kernel32 = /*#__PURE__*/new Win32Dll('kernel32.dll')

/**
 * Generates simple tones on the speaker.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/utilapiset/nf-utilapiset-beep
 */
export function Beep(dwFreq: number, dwDuration: number): boolean {
    Beep.native ??= kernel32.func('Beep', cBOOL, [ cDWORD, cDWORD ])
    return !!Beep.native(dwFreq, dwDuration)
}

/**
 *
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 *
 */
export function CloseHandle(hObject: HANDLE): number {
    CloseHandle.native ??= kernel32.func('CloseHandle', cBOOL, [ cHANDLE ])
    return CloseHandle.native(hObject)
}

/**
 * Formats a message string.
 *
 * Note: the Arguments parameter is not yet supported. Right now, you can use FormatMessage()
 *       to retrieve the message text for a system-defined error returned by GetLastError().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-formatmessagew
 */
export function FormatMessage(dwFlags: FORMAT_MESSAGE_, lpSource: HMODULE | string | null, dwMessageId: number, dwLanguageId: number): string {
    FormatMessage.native ??= kernel32.func('FormatMessageW', cDWORD, [ cDWORD, cPVOID, cDWORD, cDWORD, cPWSTR, cDWORD, '...' as any ])

    const out = new Uint16Array(2048)
    const len = FormatMessage.native(
        dwFlags, lpSource, dwMessageId, dwLanguageId,
        out, out.length,
        'int', 0    // Fake va_list
    )
    return textDecoder.decode(out.subarray(0, len))
}

/**
 * Retrieves the NetBIOS name of the local computer.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getcomputernamew
 */
export function GetComputerName(): string | null {
    GetComputerName.native ??= kernel32.func('GetComputerNameW', cBOOL, [ cPWSTR, koffi.inout(cPDWORD) ])

    const out = new Uint16Array(256)
    const len: OUT<number> = [ out.length ]
    return GetComputerName.native(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0]))
}

/**
 * Retrieves the window handle used by the console associated with the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/console/getconsolewindow
 */
export function GetConsoleWindow(): HWND | null {
    GetConsoleWindow.native ??= kernel32.func('GetConsoleWindow', cHANDLE, [])
    return GetConsoleWindow.native()
}

/**
 * Retrieves a pseudo handle for the current process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocess
 */
export function GetCurrentProcess(): HANDLE {
    GetCurrentProcess.native ??= kernel32.func('GetCurrentProcess', cHANDLE, [])
    return GetCurrentProcess.native()
}

/**
 * Retrieves the calling thread's last-error code value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-getlasterror
 */
export function GetLastError(): number {
    GetLastError.native ??= kernel32.func('GetLastError', cDWORD, [])
    return GetLastError.native()
}

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

/**
 * Opens an existing local process object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
export function OpenProcess(dwDesiredAccess: PSAR_, bInheritHandle: boolean, dwProcessId: number): HANDLE | null {
    OpenProcess.native ??= kernel32.func('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])
    return OpenProcess.native(dwDesiredAccess, Number(bInheritHandle), dwProcessId)
}

/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
export function QueryFullProcessImageName(hProcess: HANDLE, dwFlags: number): string | null {
    QueryFullProcessImageName.native ??= kernel32.func('QueryFullProcessImageNameW', cBOOL, [ cHANDLE, cDWORD, koffi.out(cPWSTR), koffi.inout(cPDWORD) ])

    const exeName = new Uint16Array(256)
    const dwSize: OUT<number> = [ exeName.length ]
    return QueryFullProcessImageName.native(hProcess, dwFlags, exeName, dwSize) === 0
        ? null
        : textDecoder.decode(exeName.subarray(0, dwSize[0]))
}

/**
 * Sets the last-error code for the calling thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-setlasterror
 */
export function SetLastError(dwErrcode: number): void {
    SetLastError.native ??= kernel32.func('SetLastError', cVOID, [ cDWORD ])
    return SetLastError.native(dwErrcode)
}
