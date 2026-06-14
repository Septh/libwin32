/**
 * Determines the concurrency model used for incoming calls to objects created by this thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/objbase/ne-objbase-coinit
 */
export enum COINIT_ {
    APARTMENTTHREADED = 0x2,
    MULTITHREADED     = 0x0,
    DISABLE_OLE1DDE   = 0x4,
    SPEED_OVER_MEMORY = 0x8
}
