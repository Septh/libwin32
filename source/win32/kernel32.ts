import koffi from 'koffi-cream'
import { StringOutputBuffer, Internals, type OUT } from './private.js'
import {
    cVOID, cBOOL, cDWORD, cPVOID, cPDWORD, cSTR,
    cHANDLE, type HANDLE, type HMODULE, type HWND
} from './ctypes.js'
import {
    FORMAT_MESSAGE_,
    type GET_MODULE_HANDLE_EX_FLAG_, type HANDLE_FLAG_, type PSAR_
} from './consts.js'
import {
    cFILETIME, type FILETIME,
    cSYSTEMTIME, type SYSTEMTIME
} from './structs.js'

/** @internal */
export const kernel32 = koffi.load('kernel32.dll')

/**
 * Generates simple tones on the speaker.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/utilapiset/nf-utilapiset-beep
 */
export function Beep(freq: number, duration: number): boolean {
    Beep.native ??= kernel32.func('Beep', cBOOL, [ cDWORD, cDWORD ])
    return !!Beep.native(freq, duration)
}

/**
 * Expands environment-variable strings and replaces them with the values defined for the current user.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processenv/nf-processenv-expandenvironmentstringsw
 */
export function ExpandEnvironmentStrings(src: string): string {
    ExpandEnvironmentStrings.native ??= kernel32.func('ExpandEnvironmentStringsW', cDWORD, [ cSTR, cPVOID, cDWORD ])

    const str = new StringOutputBuffer(4096)
    const len = ExpandEnvironmentStrings.native(src, str.buffer, str.length)
    return str.decode(len - 1)
}

/**
 * Closes an open object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-closehandle
 *
 */
export function CloseHandle(hObject: HANDLE): boolean {
    CloseHandle.native ??= kernel32.func('CloseHandle', cBOOL, [ cHANDLE ])
    return CloseHandle.native(hObject) !== 0
}

/**
 * Converts a file time to system time format. System time is based on Coordinated Universal Time (UTC).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/timezoneapi/nf-timezoneapi-filetimetosystemtime
 */
export function FileTimeToSystemTime(fileTime: FILETIME): SYSTEMTIME | null {
    FileTimeToSystemTime.native ??= kernel32.func('FileTimeToSystemTime', cBOOL, [ cFILETIME, koffi.out(koffi.pointer(cSYSTEMTIME)) ])

    const systemTime = {} as SYSTEMTIME
    return FileTimeToSystemTime.native(fileTime, systemTime) !== 0 ? systemTime : null
}

/**
 * Formats a message string.
 *
 * Notes:
 * - `FORMAT_MESSAGE_ALLOCATE_BUFFER` and `FORMAT_MESSAGE_ARGUMENT_ARRAY` are not supported and are filtered out.
 * - the Arguments parameter is not yet supported.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-formatmessagew
 */
export function FormatMessage(flags: FORMAT_MESSAGE_, source: HMODULE | string | null, messageId: number, languageId: number = 0): string {
    FormatMessage.native ??= kernel32.func('FormatMessageW', cDWORD, [ cDWORD, cPVOID, cDWORD, cDWORD, cPVOID, cDWORD, '...' as any ])

    const pSource = typeof source === 'string' ? Uint16Array.from(source, c => c.charCodeAt(0)) : source
    const buffer = new StringOutputBuffer(1024)
    const len = FormatMessage.native(
        flags & ~(FORMAT_MESSAGE_.ALLOCATE_BUFFER | FORMAT_MESSAGE_.ARGUMENT_ARRAY),
        pSource, messageId, languageId, buffer.buffer, buffer.length, 'int', 0
    )
    return buffer.decode(len)
}

/**
 * Retrieves the NetBIOS name of the local computer.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getcomputernamew
 */
export function GetComputerName(): string | null {
    GetComputerName.native ??= kernel32.func('GetComputerNameW', cBOOL, [ cPVOID, koffi.inout(cPDWORD) ])

    const name = new StringOutputBuffer(Internals.UNLEN)
    return GetComputerName.native(name.buffer, name.pLength) !== 0 ? name.decode() : null
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
 * Retrieves the process identifier of the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getcurrentprocessid
 */
export function GetCurrentProcessId(): number {
    GetCurrentProcessId.native ??= kernel32.func('GetCurrentProcessId', cDWORD, [])
    return GetCurrentProcessId.native()
}

/**
 * Retrieves the termination status of the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-getexitcodeprocess
 */
export function GetExitCodeProcess(hProcess: HANDLE): number | null {
    GetExitCodeProcess.native ??= kernel32.func('GetExitCodeProcess', cBOOL, [ cHANDLE, koffi.out(cPDWORD) ])

    const pExitCode: OUT<number> = [0]
    return GetExitCodeProcess.native(hProcess, pExitCode) !== 0 ? pExitCode[0] : null
}

/**
 * Retrieves certain properties of an object handle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/handleapi/nf-handleapi-gethandleinformation
 */
export function GetHandleInformation(hObject: HANDLE): HANDLE_FLAG_ | null {
    GetHandleInformation.native ??= kernel32.func('GetHandleInformation', cBOOL, [ cHANDLE, koffi.out(cPDWORD) ])

    const pFlags: OUT<HANDLE_FLAG_> = [0 as HANDLE_FLAG_]
    return GetHandleInformation.native(hObject, pFlags) !== 0 ? pFlags[0] : null
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
export function GetModuleFileName(hModule: HMODULE | null): string | null {
    GetModuleFileName.native ??= kernel32.func('GetModuleFileNameW', cDWORD, [ cHANDLE, cPVOID, cDWORD ])

    const name = new StringOutputBuffer(Internals.MAX_PATH)
    const len = GetModuleFileName.native(hModule, name.buffer, name.length)
    return name.decode(len)
}

/**
 * Retrieves a module handle for the specified module.
 *
 * The module must have been loaded by the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandlew
 */
export function GetModuleHandle(moduleName: string | null): HMODULE | null {
    GetModuleHandle.native ??= kernel32.func('GetModuleHandleW', cHANDLE, [ cSTR ])
    return GetModuleHandle.native(moduleName)
}

/**
 * Retrieves a module handle for the specified module and increments the module's reference count
 * unless GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT is specified.
 *
 * The module must have been loaded by the calling process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulehandleexw
 */
export function GetModuleHandleEx(flags: GET_MODULE_HANDLE_EX_FLAG_, moduleName: string | null): HMODULE | null {
    GetModuleHandleEx.native ??= kernel32.func('GetModuleHandleExW', cBOOL, [ cDWORD, cSTR, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HMODULE | null> = [null]
    return GetModuleHandleEx.native(flags, moduleName, pHandle) !== 0 ? pHandle[0] : null
}

/**
 * Retrieves the current size of the registry and the maximum size that the registry is allowed to attain on the system.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getsystemregistryquota
 */
export function GetSystemRegistryQuota(): { allowed: number, used: number } | null {
    GetSystemRegistryQuota.native ??= kernel32.func('GetSystemRegistryQuota', cBOOL, [ koffi.out(cPDWORD), koffi.out(cPDWORD) ])

    const pAllowed: OUT<number> = [0]
    const pUsed: OUT<number> = [0]
    return GetSystemRegistryQuota.native(pAllowed, pUsed) !== 0 ? { allowed: pAllowed[0], used: pUsed[0] } : null
}

/**
 * Opens an existing local process object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocess
 */
export function OpenProcess(desiredAccess: PSAR_, inheritHandle: boolean, processId: number): HANDLE | null {
    OpenProcess.native ??= kernel32.func('OpenProcess', cHANDLE, [ cDWORD, cBOOL, cDWORD ])
    return OpenProcess.native(desiredAccess, Number(inheritHandle), processId)
}

/**
 * Retrieves the full name of the executable image for the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew
 */
export function QueryFullProcessImageName(hProcess: HANDLE, flags: number): string | null {
    QueryFullProcessImageName.native ??= kernel32.func('QueryFullProcessImageNameW', cBOOL, [
        cHANDLE, cDWORD, cPVOID, koffi.inout(cPDWORD)
    ])

    const name = new StringOutputBuffer(Internals.MAX_PATH)
    return QueryFullProcessImageName.native(hProcess, flags, name.buffer, name.pLength) !== 0 ? name.decode() : null
}

/**
 * Sets the last-error code for the calling thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/errhandlingapi/nf-errhandlingapi-setlasterror
 */
export function SetLastError(errCode: number): void {
    SetLastError.native ??= kernel32.func('SetLastError', cVOID, [ cDWORD ])
    return SetLastError.native(errCode)
}

/**
 * Waits until the specified object is in the signaled state or the time-out interval elapses.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-waitforsingleobject
 */
export function WaitForSingleObject(hHandle: HANDLE, milliseconds: number): number {
    WaitForSingleObject.native ??= kernel32.func('WaitForSingleObject', cDWORD, [ cHANDLE, cDWORD ])
    return WaitForSingleObject.native(hHandle, Number.isFinite(milliseconds) ? milliseconds : Internals.INFINITE)
}

/** @internal only used by some functions in some libs and not intended to be exposed to the user. */
export function LocalFree(ptr: unknown) {
    LocalFree.native ??= kernel32.func('LocalFree', cPVOID, [ cPVOID ])
    return LocalFree.native(ptr)
}

/** @internal only used by some functions in some libs and not intended to be exposed to the user. */
export const cLocalAllocatedString = koffi.disposable(cSTR, LocalFree)
