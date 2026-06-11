/**
 * Flags for FormatMessage().
 */
export enum FORMAT_MESSAGE_ {
    ALLOCATE_BUFFER = 0x00000100,
    IGNORE_INSERTS  = 0x00000200,
    FROM_STRING     = 0x00000400,
    FROM_HMODULE    = 0x00000800,
    FROM_SYSTEM     = 0x00001000,
    ARGUMENT_ARRAY  = 0x00002000,
    MAX_WIDTH_MASK  = 0x000000FF,
}

/**
 * dwFlags parameter for GetModuleHandleEx().
 */
export enum GET_MODULE_HANDLE_EX_FLAG_ {
    PIN                = 0x00000001,
    UNCHANGED_REFCOUNT = 0x00000002,
    FROM_ADDRESS       = 0x00000004
}

/**
 * Returned by GetHandleInformation().
 */
export enum HANDLE_FLAG_ {
    INHERIT = 1,
    PROTECT_FROM_CLOSE = 2
}

/**
 * Process Security and Access Rights.
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
