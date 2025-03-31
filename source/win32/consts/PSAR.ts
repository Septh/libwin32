/**
 * Process Securty and Access Rights
 *
 * https://learn.microsoft.com/en-us/windows/win32/procthread/process-security-and-access-rights
 */
export enum PSAR_ {
    PROCESS_ALL_ACCESS                = 0xFFFF,
    PROCESS_CREATE_PROCESS            = 0x0080,
    PROCESS_CREATE_THREAD             = 0x0002,
    PROCESS_DUP_HANDLE                = 0x0040,
    PROCESS_QUERY_INFORMATION         = 0x0400,
    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000,
    PROCESS_SET_INFORMATION           = 0x0200,
    PROCESS_SET_QUOTA                 = 0x0100,
    PROCESS_SUSPEND_RESUME            = 0x0800,
    PROCESS_TERMINATE                 = 0x0001,
    PROCESS_VM_OPERATION              = 0x0008,
    PROCESS_VM_READ                   = 0x0010,
    PROCESS_VM_WRITE                  = 0x0020,
    SYNCHRONIZE                       = 0x00100000
}
