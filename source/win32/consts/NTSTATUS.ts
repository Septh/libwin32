/**
 * Status Code Definitions
 *
 * Note: since ntstatus.h defines hundreds of status codes, this enum has only the values listed on this page:
 * https://learn.microsoft.com/en-us/windows/win32/secmgmt/management-return-values#lsa-policy-function-return-values
 */
export enum NTSTATUS_ {
    SUCCESS                = 0x00000000,
    ACCESS_DENIED          = 0xC0000022,
    INSUFFICIENT_RESOURCES = 0xC000009A,
    INTERNAL_DB_ERROR      = 0xC0000158,
    INVALID_HANDLE         = 0xC0000008,
    INVALID_SERVER_STATE   = 0xC00000DC,
    INVALID_PARAMETER      = 0xC000000D,
    NO_SUCH_PRIVILEGE      = 0xC0000060,
    OBJECT_NAME_NOT_FOUND  = 0xC0000034,
    UNSUCCESSFUL           = 0xC0000001,
}
