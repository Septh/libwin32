import koffi from 'koffi-cream'
import { Win32Dll, type OUT } from './private.js'
import {
    cBOOL, cDWORD,
    cHANDLE, type HANDLE} from './ctypes.js'
import {
    cPROCESS_MEMORY_COUNTERS_EX2, PROCESS_MEMORY_COUNTERS_EX2
} from './structs.js'

/** @internal */
const psapi = new Win32Dll('psapi.dll')

/**
 * Retrieves information about the memory usage of the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-getprocessmemoryinfo
 */
export function GetProcessMemoryInfo(hProcess: HANDLE): PROCESS_MEMORY_COUNTERS_EX2 | null {
    GetProcessMemoryInfo.native ??= psapi.func('GetProcessMemoryInfo', cBOOL, [ cHANDLE, koffi.out(koffi.pointer(cPROCESS_MEMORY_COUNTERS_EX2)), cDWORD ])

    const memCounters = new PROCESS_MEMORY_COUNTERS_EX2()
    if (GetProcessMemoryInfo.native(hProcess, memCounters, koffi.sizeof(cPROCESS_MEMORY_COUNTERS_EX2)) !== 0)
        return memCounters
    return null
}
