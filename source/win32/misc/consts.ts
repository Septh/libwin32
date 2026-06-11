/**
 * The ACCESS_MASK data type is a DWORD value that defines standard, specific, and generic rights.
 *
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/access-mask
 */
export enum ACCESS_MASK {
    DELETE                   = 0x00010000,
    READ_CONTROL             = 0x00020000,
    WRITE_DAC                = 0x00040000,
    WRITE_OWNER              = 0x00080000,
    SYNCHRONIZE              = 0x00100000,
    STANDARD_RIGHTS_REQUIRED = 0x000F0000,
    STANDARD_RIGHTS_READ     = READ_CONTROL,
    STANDARD_RIGHTS_WRITE    = READ_CONTROL,
    STANDARD_RIGHTS_EXECUTE  = READ_CONTROL,
    STANDARD_RIGHTS_ALL      = 0x001F0000,
    SPECIFIC_RIGHTS_ALL      = 0x0000FFFF,

    ACCESS_SYSTEM_SECURITY   = 0x01000000,
    MAXIMUM_ALLOWED          = 0x02000000,

    GENERIC_READ             = 0x80000000,
    GENERIC_WRITE            = 0x40000000,
    GENERIC_EXECUTE          = 0x20000000,
    GENERIC_ALL              = 0x10000000,
}

/**
 * Most common error codes.
 * See https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes for more.
 */
export enum ERROR_ {
    SUCCESS              = 0,
    FILE_NOT_FOUND       = 2,
    PATH_NOT_FOUND       = 3,
    ACCESS_DENIED        = 5,
    INVALID_HANDLE       = 6,
    NOT_ENOUGH_MEMORY    = 8,
    NO_MORE_FILES        = 18,
    GEN_FAILURE          = 31,
    NOT_SUPPORTED        = 50,
    INVALID_PARAMETER    = 87,
    CALL_NOT_IMPLEMENTED = 120,
    INSUFFICIENT_BUFFER  = 122,
    INVALID_NAME         = 123,
    BAD_ARGUMENTS        = 160,
    BAD_PATHNAME         = 161,
    NO_DATA              = 232,
    MORE_DATA            = 234,
    NO_MORE_ITEMS        = 259,
    INVALID_TOKEN        = 315,
    INVALID_ADDRESS      = 487,
    NO_SYSTEM_RESOURCES  = 1450,
    NO_SUCH_PRIVILEGE    = 1313,
    INTERNAL_DB_ERROR    = 1383,
    INVALID_SERVER_STATE = 1352
}

/**
 * Status Code Definitions.
 *
 * Note: since ntstatus.h defines literally hundreds of status codes, this enum has only the values listed on this page:
 * https://learn.microsoft.com/en-us/windows/win32/secmgmt/management-return-values#lsa-policy-function-return-values
 */
export enum NTSTATUS_ {
    SUCCESS                = 0x00000000,
    UNSUCCESSFUL           = 0xC0000001,
    ACCESS_DENIED          = 0xC0000022,
    INSUFFICIENT_RESOURCES = 0xC000009A,
    INTERNAL_DB_ERROR      = 0xC0000158,
    INVALID_HANDLE         = 0xC0000008,
    INVALID_SERVER_STATE   = 0xC00000DC,
    INVALID_PARAMETER      = 0xC000000D,
    NO_SUCH_PRIVILEGE      = 0xC0000060,
    OBJECT_NAME_NOT_FOUND  = 0xC0000034,
    NONE_MAPPED            = 0xC0000073,
    NOT_SUPPORTED          = 0xC00000BB,
    SOME_NOT_MAPPED        = 0x00000107,
}
