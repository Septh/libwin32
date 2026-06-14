import { ACCESS_MASK } from '../../chore/consts.js'

/**
 * Predefined Registry Key Handles.
 *
 * https://learn.microsoft.com/en-us/windows/win32/sysinfo/predefined-keys
 */
export enum HKEY_ {
    CLASSES_ROOT                = 0x80000000,
    CURRENT_USER                = 0x80000001,
    LOCAL_MACHINE               = 0x80000002,
    USERS                       = 0x80000003,
    PERFORMANCE_DATA            = 0x80000004,
    PERFORMANCE_TEXT            = 0x80000050,
    PERFORMANCE_NLSTEXT         = 0x80000060,
    CURRENT_CONFIG              = 0x80000005,
    DYN_DATA                    = 0x80000006,
    CURRENT_USER_LOCAL_SETTINGS = 0x80000007,
}

/**
 * Registry Specific Access Rights.
 *
 * https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry-key-security-and-access-rights
 */
export enum KEY_ {
    QUERY_VALUE          = 0x0001,
    SET_VALUE            = 0x0002,
    CREATE_SUB_KEY       = 0x0004,
    ENUMERATE_SUB_KEYS   = 0x0008,
    NOTIFY               = 0x0010,
    CREATE_LINK          = 0x0020,
    WOW64_64KEY          = 0x0100,
    WOW64_32KEY          = 0x0200,
    WOW64_RES            = 0x0300,
    READ = (
        (ACCESS_MASK.STANDARD_RIGHTS_READ | QUERY_VALUE | ENUMERATE_SUB_KEYS | NOTIFY)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),
    WRITE = (
        (ACCESS_MASK.STANDARD_RIGHTS_WRITE | SET_VALUE | CREATE_SUB_KEY)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),
    EXECUTE = (
        (READ)
        & (~ACCESS_MASK.SYNCHRONIZE)
    ),
    ALL_ACCESS = (
        (ACCESS_MASK.STANDARD_RIGHTS_ALL | QUERY_VALUE | SET_VALUE | CREATE_SUB_KEY | ENUMERATE_SUB_KEYS | NOTIFY | CREATE_LINK)
        & (~ACCESS_MASK.SYNCHRONIZE)
    )
}

/**
 * Predefined Value Types.
 *
 * https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry-value-types
 */
export enum REG_ {
    NONE                       = 0,     // No value type
    SZ                         = 1,     // Unicode nul terminated string
    EXPAND_SZ                  = 2,     // Unicode nul terminated string (with environment variable references)
    BINARY                     = 3,     // Free form binary
    DWORD                      = 4,     // 32-bit number
    DWORD_LITTLE_ENDIAN        = 4,     // 32-bit number (same as REG_DWORD)
    DWORD_BIG_ENDIAN           = 5,     // 32-bit number
    LINK                       = 6,     // Symbolic Link (unicode)
    MULTI_SZ                   = 7,     // Multiple Unicode strings
    RESOURCE_LIST              = 8,     // Resource list in the resource map
    FULL_RESOURCE_DESCRIPTOR   = 9,     // Resource list in the hardware description
    RESOURCE_REQUIREMENTS_LIST = 10,
    QWORD                      = 11,    // 64-bit number
    QWORD_LITTLE_ENDIAN        = 11,    // 64-bit number (same as REG_QWORD)
}

export const REG_CREATED_NEW_KEY              = 1
export const REG_OPENED_EXISTING_KEY          = 2
export const REG_PROCESS_APPKEY               = 0x00000001
export const REG_USE_CURRENT_SECURITY_CONTEXT = 0x00000002
export const REG_STANDARD_FORMAT              = 1
export const REG_LATEST_FORMAT                = 2
export const REG_NO_COMPRESSION               = 4

export enum REG_OPTION_ {
    RESERVED        = 0x00000000,
    NON_VOLATILE    = 0x00000000,
    VOLATILE        = 0x00000001,
    CREATE_LINK     = 0x00000002,
    BACKUP_RESTORE  = 0x00000004,
    OPEN_LINK       = 0x00000008,
    DONT_VIRTUALIZE = 0x00000010,
}

/**
 * Registry Routine Flags (for RegGetValue)
 */
export enum RRF_ {
    RT_REG_NONE       = 0x00000001,                         // restrict type to REG_NONE      (other data types will not return ERROR_SUCCESS)
    RT_REG_SZ         = 0x00000002,                         // restrict type to REG_SZ        (other data types will not return ERROR_SUCCESS) (automatically converts REG_EXPAND_SZ to REG_SZ unless RRF_NOEXPAND is specified)
    RT_REG_EXPAND_SZ  = 0x00000004,                         // restrict type to REG_EXPAND_SZ (other data types will not return ERROR_SUCCESS) (must specify RRF_NOEXPAND or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    RT_REG_BINARY     = 0x00000008,                         // restrict type to REG_BINARY    (other data types will not return ERROR_SUCCESS)
    RT_REG_DWORD      = 0x00000010,                         // restrict type to REG_DWORD     (other data types will not return ERROR_SUCCESS)
    RT_REG_MULTI_SZ   = 0x00000020,                         // restrict type to REG_MULTI_SZ  (other data types will not return ERROR_SUCCESS)
    RT_REG_QWORD      = 0x00000040,                         // restrict type to REG_QWORD     (other data types will not return ERROR_SUCCESS)
    RT_DWORD          = (RT_REG_BINARY | RT_REG_DWORD),     // restrict type to *32-bit* RRF_RT_REG_BINARY or RRF_RT_REG_DWORD (other data types will not return ERROR_SUCCESS)
    RT_QWORD          = (RT_REG_BINARY | RT_REG_QWORD),     // restrict type to *64-bit* RRF_RT_REG_BINARY or RRF_RT_REG_DWORD (other data types will not return ERROR_SUCCESS)
    RT_ANY            = 0x0000ffff,                         // no type restriction
    SUBKEY_WOW6464KEY = 0x00010000,                         // when opening the subkey (if provided) force open from the 64bit location (only one SUBKEY_WOW64* flag can be set or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    SUBKEY_WOW6432KEY = 0x00020000,                         // when opening the subkey (if provided) force open from the 32bit location (only one SUBKEY_WOW64* flag can be set or RegGetValue will fail with ERROR_INVALID_PARAMETER)
    WOW64_MASK        = 0x00030000,
    NOEXPAND          = 0x10000000,                         // do not automatically expand environment strings if value is of type REG_EXPAND_SZ
    ZEROONFAILURE     = 0x20000000,                         // if pvData is not NULL, set content to all zeros on failure
}
