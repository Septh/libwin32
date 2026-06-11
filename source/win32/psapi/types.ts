import { SIZEOF_PROCESS_MEMORY_COUNTERS_EX2 } from './consts.js'

/**
 * Contains extended memory statistics for a process. Extends PROCESS_MEMORY_COUNTERS_EX and PROCESS_MEMORY_COUNTERS.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/psapi/ns-psapi-process_memory_counters_ex2
 */
export class PROCESS_MEMORY_COUNTERS_EX2 {
    readonly cb = SIZEOF_PROCESS_MEMORY_COUNTERS_EX2
    constructor(
        public PageFaultCount:             number          = 0,
        public PeakWorkingSetSize:         number | bigint = 0,
        public WorkingSetSize:             number | bigint = 0,
        public QuotaPeakPagedPoolUsage:    number | bigint = 0,
        public QuotaPagedPoolUsage:        number | bigint = 0,
        public QuotaPeakNonPagedPoolUsage: number | bigint = 0,
        public QuotaNonPagedPoolUsage:     number | bigint = 0,
        public PagefileUsage:              number | bigint = 0,
        public PeakPagefileUsage:          number | bigint = 0,
        public PrivateUsage:               number | bigint = 0,
        public PrivateWorkingSetSize:      number | bigint = 0,
        public SharedCommitUsage:          number | bigint = 0
    ) {}
}
