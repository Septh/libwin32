import { ACCESS_MASK } from '../../misc/consts.js'

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
    NONE                       = 0,
    SZ                         = 1,
    EXPAND_SZ                  = 2,
    BINARY                     = 3,
    DWORD                      = 4,
    DWORD_LITTLE_ENDIAN        = 4,
    DWORD_BIG_ENDIAN           = 5,
    LINK                       = 6,
    MULTI_SZ                   = 7,
    RESOURCE_LIST              = 8,
    FULL_RESOURCE_DESCRIPTOR   = 9,
    RESOURCE_REQUIREMENTS_LIST = 10,
    QWORD                      = 11,
    QWORD_LITTLE_ENDIAN        = 11,
}

export const REG_CREATED_NEW_KEY              = 1
export const REG_LATEST_FORMAT                = 2
export const REG_NO_COMPRESSION               = 4
export const REG_OPENED_EXISTING_KEY          = 2
export const REG_PROCESS_APPKEY               = 0x00000001
export const REG_STANDARD_FORMAT              = 1
export const REG_USE_CURRENT_SECURITY_CONTEXT = 0x00000002

/**
 * Reg Open/Create Options
 */
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
    RT_REG_NONE       = 0x00000001,
    RT_REG_SZ         = 0x00000002,
    RT_REG_EXPAND_SZ  = 0x00000004,
    RT_REG_BINARY     = 0x00000008,
    RT_REG_DWORD      = 0x00000010,
    RT_REG_MULTI_SZ   = 0x00000020,
    RT_REG_QWORD      = 0x00000040,
    RT_DWORD          = (RT_REG_BINARY | RT_REG_DWORD),
    RT_QWORD          = (RT_REG_BINARY | RT_REG_QWORD),
    RT_ANY            = 0x0000ffff,
    SUBKEY_WOW6464KEY = 0x00010000,
    SUBKEY_WOW6432KEY = 0x00020000,
    WOW64_MASK        = 0x00030000,
    NOEXPAND          = 0x10000000,
    ZEROONFAILURE     = 0x20000000,
}
