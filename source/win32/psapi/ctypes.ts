import koffi from 'koffi'
import { cDWORD, cSIZE_T, cULONG64 } from '../internals.js'

/** @internal */
export const cPROCESS_MEMORY_COUNTERS_EX2 = koffi.struct({
    cb:                         cDWORD,
    PageFaultCount:             cDWORD,
    PeakWorkingSetSize:         cSIZE_T,
    WorkingSetSize:             cSIZE_T,
    QuotaPeakPagedPoolUsage:    cSIZE_T,
    QuotaPagedPoolUsage:        cSIZE_T,
    QuotaPeakNonPagedPoolUsage: cSIZE_T,
    QuotaNonPagedPoolUsage:     cSIZE_T,
    PagefileUsage:              cSIZE_T,
    PeakPagefileUsage:          cSIZE_T,
    PrivateUsage:               cSIZE_T,
    PrivateWorkingSetSize:      cSIZE_T,
    SharedCommitUsage:          cULONG64,
})
