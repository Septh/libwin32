import koffi from 'koffi'
import { cPROCESS_MEMORY_COUNTERS_EX2 } from './ctypes.js'

export const SIZEOF_PROCESS_MEMORY_COUNTERS_EX2 = koffi.sizeof(cPROCESS_MEMORY_COUNTERS_EX2)
