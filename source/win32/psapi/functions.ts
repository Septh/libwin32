import koffi from 'koffi'
import { cBOOL, cDWORD, cHANDLE, type HANDLE, type OUT } from '../internals.js'
import { PROCESS_MEMORY_COUNTERS_EX2 } from './types.js'
import { cPROCESS_MEMORY_COUNTERS_EX2 } from './ctypes.js'

const psapi = koffi.load('psapi.dll')

/**
 * Retrieves information about the memory usage of the specified process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/psapi/nf-psapi-getprocessmemoryinfo
 */
export function GetProcessMemoryInfo(hProcess: HANDLE): PROCESS_MEMORY_COUNTERS_EX2 | null {
    GetProcessMemoryInfo.native ??= psapi.func('GetProcessMemoryInfo', cBOOL, [
        cHANDLE, koffi.out(koffi.pointer(cPROCESS_MEMORY_COUNTERS_EX2)), cDWORD
    ])

    const pMemCounters: OUT<PROCESS_MEMORY_COUNTERS_EX2> = [new PROCESS_MEMORY_COUNTERS_EX2()]
    return GetProcessMemoryInfo.native(hProcess, pMemCounters, koffi.sizeof(cPROCESS_MEMORY_COUNTERS_EX2)) ? pMemCounters[0] : null
}
