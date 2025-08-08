import type { SID_IDENTIFIER_AUTHORITY } from './structs.js'

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
    SPECIFIC_RIGHTS_ALL      = 0x0000FFFF
}

/**
 * AnimateWindow() Commands.
 */
export enum AW_ {
    AW_HOR_POSITIVE = 0x00000001,
    AW_HOR_NEGATIVE = 0x00000002,
    AW_VER_POSITIVE = 0x00000004,
    AW_VER_NEGATIVE = 0x00000008,
    AW_CENTER       = 0x00000010,
    AW_HIDE         = 0x00010000,
    AW_ACTIVATE     = 0x00020000,
    AW_SLIDE        = 0x00040000,
    AW_BLEND        = 0x00080000
}

/** Return this value to deny a query. */
export const BROADCAST_QUERY_DENY = 0x424D5144

/**
 * Broadcast Special Message Flags.
 */
export enum BSF_ {
    QUERY              = 0x00000001,
    IGNORECURRENTTASK  = 0x00000002,
    FLUSHDISK          = 0x00000004,
    NOHANG             = 0x00000008,
    POSTMESSAGE        = 0x00000010,
    FORCEIFHUNG        = 0x00000020,
    NOTIMEOUTIFNOTHUNG = 0x00000040,
    ALLOWSFW           = 0x00000080,
    SENDNOTIFYMESSAGE  = 0x00000100,
    RETURNHDESK        = 0x00000200,
    LUID               = 0x00000400
}

/**
 * Broadcast Special Message Recipient list.
 */
export enum BSM_ {
    ALLCOMPONENTS      = 0x00000000,
    VXDS               = 0x00000001,
    NETDRIVER          = 0x00000002,
    INSTALLABLEDRIVERS = 0x00000004,
    APPLICATIONS       = 0x00000008,
    ALLDESKTOPS        = 0x00000010
}

/**
 * Claim Security attributes flags.
 */
export enum CLAIM_SECURITY_ATTRIBUTE_ {
    NON_INHERITABLE      = 0x0001,
    VALUE_CASE_SENSITIVE = 0x0002,
    USE_FOR_DENY_ONLY    = 0x0004,
    DISABLED_BY_DEFAULT  = 0x0008,
    DISABLED             = 0x0010,
    MANDATORY            = 0x0020,
    CUSTOM_FLAGS         = 0xFFFF0000,

    VALID_FLAGS = (
        NON_INHERITABLE
        | VALUE_CASE_SENSITIVE
        | USE_FOR_DENY_ONLY
        | DISABLED_BY_DEFAULT
        | DISABLED
        | MANDATORY
    )
}

/**
 * Claim Security attributes.
 */
export enum CLAIM_SECURITY_ATTRIBUTE_TYPE_ {
    INVALID      = 0x00,
    INT64        = 0x01,
    UINT64       = 0x02,
    STRING       = 0x03,
    FQBN         = 0x04,
    SID          = 0x05,
    BOOLEAN      = 0x06,
    OCTET_STRING = 0x10
}

/**
 * CS_xxx - Window Class styles.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-class-styles
 */
export enum CS_ {
    NULL,
    BYTEALIGNCLIENT = 0x00001000,
    BYTEALIGNWINDOW = 0x00002000,
    CLASSDC         = 0x00000040,
    DBLCLKS         = 0x00000008,
    DROPSHADOW      = 0x00020000,
    GLOBALCLASS     = 0x00004000,
    HREDRAW         = 0x00000002,
    // IME             = 0x00010000,
    NOCLOSE         = 0x00000200,
    OWNDC           = 0x00000020,
    PARENTDC        = 0x00000080,
    SAVEBITS        = 0x00000800,
    VREDRAW         = 0x00000001
}

/**
 * Special value for X and Y parameters of CreateWindow()/CreateWindowEx().
 */
export const CW_USEDEFAULT = 0x80000000

/**
 * well-known aliases...
 */
export enum DOMAIN_ALIAS_ {
    RID_ADMINS                         = 0x00000220,
    RID_USERS                          = 0x00000221,
    RID_GUESTS                         = 0x00000222,
    RID_POWER_USERS                    = 0x00000223,
    RID_ACCOUNT_OPS                    = 0x00000224,
    RID_SYSTEM_OPS                     = 0x00000225,
    RID_PRINT_OPS                      = 0x00000226,
    RID_BACKUP_OPS                     = 0x00000227,
    RID_REPLICATOR                     = 0x00000228,
    RID_RAS_SERVERS                    = 0x00000229,
    RID_PREW2KCOMPACCESS               = 0x0000022A,
    RID_REMOTE_DESKTOP_USERS           = 0x0000022B,
    RID_NETWORK_CONFIGURATION_OPS      = 0x0000022C,
    RID_INCOMING_FOREST_TRUST_BUILDERS = 0x0000022D,
    RID_MONITORING_USERS               = 0x0000022E,
    RID_LOGGING_USERS                  = 0x0000022F,
    RID_AUTHORIZATIONACCESS            = 0x00000230,
    RID_TS_LICENSE_SERVERS             = 0x00000231,
    RID_DCOM_USERS                     = 0x00000232,
    RID_IUSERS                         = 0x00000238,
    RID_CRYPTO_OPERATORS               = 0x00000239,
    RID_CACHEABLE_PRINCIPALS_GROUP     = 0x0000023B,
    RID_NON_CACHEABLE_PRINCIPALS_GROUP = 0x0000023C,
    RID_EVENT_LOG_READERS_GROUP        = 0x0000023D,
    RID_CERTSVC_DCOM_ACCESS_GROUP      = 0x0000023E,
    RID_RDS_REMOTE_ACCESS_SERVERS      = 0x0000023F,
    RID_RDS_ENDPOINT_SERVERS           = 0x00000240,
    RID_RDS_MANAGEMENT_SERVERS         = 0x00000241,
    RID_HYPER_V_ADMINS                 = 0x00000242,
    RID_ACCESS_CONTROL_ASSISTANCE_OPS  = 0x00000243,
    RID_REMOTE_MANAGEMENT_USERS        = 0x00000244,
    RID_DEFAULT_ACCOUNT                = 0x00000245,
    RID_STORAGE_REPLICA_ADMINS         = 0x00000246,
    RID_DEVICE_OWNERS                  = 0x00000247,
    RID_USER_MODE_HARDWARE_OPERATORS   = 0x00000248,
    RID_OPENSSH_USERS                  = 0x00000249,
}

/**
 * Most common error codes.
 * See https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes for more.
 */
export const enum ERROR_ {
    SUCCESS              = 0,
    FILE_NOT_FOUND       = 2,
    PATH_NOT_FOUND       = 3,
    ACCESS_DENIED        = 5,
    INVALID_HANDLE       = 6,
    NOT_ENOUGH_MEMORY    = 8,
    NO_MORE_FILES        = 18,
    NOT_SUPPORTED        = 50,
    CALL_NOT_IMPLEMENTED = 120,
    INVALID_NAME         = 123,
    BAD_ARGUMENTS        = 160,
    BAD_PATHNAME         = 161,
    NO_DATA              = 232,
    MORE_DATA            = 234,
    NO_MORE_ITEMS        = 259,
    INVALID_TOKEN        = 315,
    INVALID_ADDRESS      = 487
}

/**
 * Extended Name APIs for ADS.
 */
export enum EXTENDED_NAME_FORMAT {
    NameUnknown          = 0,
    NameFullyQualifiedDN = 1,
    NameSamCompatible    = 2,
    NameDisplay          = 3,
    NameUniqueId         = 6,
    NameCanonical        = 7,
    NameUserPrincipal    = 8,
    NameCanonicalEx      = 9,
    NameServicePrincipal = 10,
    NameDnsDomain        = 12,
    NameGivenName        = 13,
    NameSurname          = 14
}

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
 * Flags for GetAncestor().
 */
export enum GA_ {
    PARENT    = 1,
    ROOT      = 2,
    ROOTOWNER = 3
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
 * Reserved Registry Key Handles.
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
 * Special HWND values.
 */
export enum HWND_ {
    // PostMessage() and SendMessage()
    BROADCAST = 0xffff,
    MESSAGE   = -3,
    // CreateWindow(), et al.
    DESKTOP   = 0,
    TOP       = 0,
    BOTTOM    = 1,
    TOPMOST   = -1,
    NOTOPMOST = -2
}

/**
 * IDC_xxx - Standard Cursor IDs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/menurc/about-cursors
 */
export enum IDC_ {
    ARROW       = 32512,
    IBEAM       = 32513,
    WAIT        = 32514,
    CROSS       = 32515,
    UPARROW     = 32516,
    // SIZE        = 32640,
    // ICON        = 32641,
    SIZENWSE    = 32642,
    SIZENESW    = 32643,
    SIZEWE      = 32644,
    SIZENS      = 32645,
    SIZEALL     = 32646,
    NO          = 32648,
    HAND        = 32649,
    APPSTARTING = 32650,
    HELP        = 32651,
    PIN         = 32671,
    PERSON      = 32672
}

/**
 * IDI_xxx - Standard Icon IDs.
 *
 * https://learn.microsoft.com/en-us/windows/win32/menurc/about-icons
 */
export enum IDI_ {
    APPLICATION = 32512,
    ERROR       = 32513,
    QUESTION    = 32514,
    WARNING     = 32515,
    INFORMATION = 32516,
    WINLOGO     = 32517,
    SHIELD      = 32518
}

/**
 * Values for the `type` parameter of LoadImage().
 */
export enum IMAGE_ {
    BITMAP      = 0,
    ICON        = 1,
    CURSOR      = 2,
    ENHMETAFILE = 3
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
 * Values for the `fuLoad` parameter of LoadImage().
 */
export enum LR_ {
    DEFAULTCOLOR     = 0x00000000,
    MONOCHROME       = 0x00000001,
    COLOR            = 0x00000002,
    COPYRETURNORG    = 0x00000004,
    COPYDELETEORG    = 0x00000008,
    LOADFROMFILE     = 0x00000010,
    LOADTRANSPARENT  = 0x00000020,
    DEFAULTSIZE      = 0x00000040,
    VGACOLOR         = 0x00000080,
    LOADMAP3DCOLORS  = 0x00001000,
    CREATEDIBSECTION = 0x00002000,
    COPYFROMRESOURCE = 0x00004000,
    SHARED           = 0x00008000
}

/**
 * MB_xxx - MessageBox() Flags.
 */
export enum MB_ {
    OK                   = 0x00000000,
    OKCANCEL             = 0x00000001,
    ABORTRETRYIGNORE     = 0x00000002,
    YESNOCANCEL          = 0x00000003,
    YESNO                = 0x00000004,
    RETRYCANCEL          = 0x00000005,
    CANCELTRYCONTINUE    = 0x00000006,
    ICONHAND             = 0x00000010,
    ICONQUESTION         = 0x00000020,
    ICONEXCLAMATION      = 0x00000030,
    ICONASTERISK         = 0x00000040,
    USERICON             = 0x00000080,
    ICONWARNING          = ICONEXCLAMATION,
    ICONERROR            = ICONHAND,
    ICONINFORMATION      = ICONASTERISK,
    ICONSTOP             = ICONHAND,
    DEFBUTTON1           = 0x00000000,
    DEFBUTTON2           = 0x00000100,
    DEFBUTTON3           = 0x00000200,
    DEFBUTTON4           = 0x00000300,
    APPLMODAL            = 0x00000000,
    SYSTEMMODAL          = 0x00001000,
    TASKMODAL            = 0x00002000,
    HELP                 = 0x00004000,
    NOFOCUS              = 0x00008000,
    SETFOREGROUND        = 0x00010000,
    DEFAULT_DESKTOP_ONLY = 0x00020000,
    TOPMOST              = 0x00040000,
    RIGHT                = 0x00080000,
    RTLREADING           = 0x00100000,
    SERVICE_NOTIFICATION = 0x00200000,
    TYPEMASK             = 0x0000000F,
    ICONMASK             = 0x000000F0,
    DEFMASK              = 0x00000F00,
    MODEMASK             = 0x00003000,
    MISCMASK             = 0x0000C000
}

/**
 * Menu Flags.
 */
export enum MF_ {
    BYCOMMAND       = 0x00000000,
    BYPOSITION      = 0x00000400,
    SEPARATOR       = 0x00000800,
    REMOVE          = 0x00001000,
    APPEND          = 0x00000100,
    DELETE          = 0x00000200,
    INSERT          = 0x00000000,
    CHANGE          = 0x00000080,
    ENABLED         = 0x00000000,
    GRAYED          = 0x00000001,
    DISABLED        = 0x00000002,
    UNCHECKED       = 0x00000000,
    CHECKED         = 0x00000008,
    USECHECKBITMAPS = 0x00000200,
    STRING          = 0x00000000,
    BITMAP          = 0x00000004,
    OWNERDRAW       = 0x00000100,
    POPUP           = 0x00000010,
    MENUBARBREAK    = 0x00000020,
    MENUBREAK       = 0x00000040,
    UNHILITE        = 0x00000000,
    HILITE          = 0x00000080,
    DEFAULT         = 0x00001000,
    SYSMENU         = 0x00002000,
    HELP            = 0x00004000,
    RIGHTJUSTIFY    = 0x00004000,
    MOUSESELECT     = 0x00008000
}

/**
 * Values for NOTIFYICONDATA.uFlags
 */
export enum NIF_ {
    MESSAGE  = 0x0001,
    ICON     = 0x0002,
    TIP      = 0x0004,
    STATE    = 0x0008,
    INFO     = 0x0010,
    GUID     = 0x0020,
    REALTIME = 0x0040,
    SHOWTIP  = 0x0080,
}

/**
 * Values for the dwMessagge parameter of Shell_NotifyIcon()
 */
export enum NIM_ {
    ADD        = 0x00000000,
    MODIFY     = 0x00000001,
    DELETE     = 0x00000002,
    SETFOCUS   = 0x00000003,
    SETVERSION = 0x00000004,
}

/**
 * Status Code Definitions.
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

/**
 * OBM_xxx - OEM Resource Ordinal Numbers.
 */
export enum OBM_ {
    CLOSE       = 32754,
    UPARROW     = 32753,
    DNARROW     = 32752,
    RGARROW     = 32751,
    LFARROW     = 32750,
    REDUCE      = 32749,
    ZOOM        = 32748,
    RESTORE     = 32747,
    REDUCED     = 32746,
    ZOOMD       = 32745,
    RESTORED    = 32744,
    UPARROWD    = 32743,
    DNARROWD    = 32742,
    RGARROWD    = 32741,
    LFARROWD    = 32740,
    MNARROW     = 32739,
    COMBO       = 32738,
    UPARROWI    = 32737,
    DNARROWI    = 32736,
    RGARROWI    = 32735,
    LFARROWI    = 32734,
    OLD_CLOSE   = 32767,
    SIZE        = 32766,
    OLD_UPARROW = 32765,
    OLD_DNARROW = 32764,
    OLD_RGARROW = 32763,
    OLD_LFARROW = 32762,
    BTSIZE      = 32761,
    CHECK       = 32760,
    CHECKBOXES  = 32759,
    BTNCORNERS  = 32758,
    OLD_REDUCE  = 32757,
    OLD_ZOOM    = 32756,
    OLD_RESTORE = 32755
}

/**
 * OCR_xxx - OEM Resource Ordinal Numbers.
 */
export enum OCR_ {
    NORMAL      = 32512,
    IBEAM       = 32513,
    WAIT        = 32514,
    CROSS       = 32515,
    UP          = 32516,
    /** @deprecated: use OCR_SIZEALL */
    SIZE        = 32640,
    /** @deprecated: use OCR_NORMAL */
    ICON        = 32641,
    SIZENWSE    = 32642,
    SIZENESW    = 32643,
    SIZEWE      = 32644,
    SIZENS      = 32645,
    SIZEALL     = 32646,
    /** @deprecated: use OIC_WINLOGO */
    ICOCUR      = 32647,
    NO          = 32648,
    HAND        = 32649,
    APPSTARTING = 32650
}

/**
 * OIC_xxx - OEM Resource Ordinal Numbers.
 */
export enum OIC_ {
    SAMPLE      = 32512,
    HAND        = 32513,
    QUES        = 32514,
    BANG        = 32515,
    NOTE        = 32516,
    WINLOGO     = 32517,
    WARNING     = BANG,
    ERROR       = HAND,
    INFORMATION = NOTE,
    SHIELD      = 32518
}

/**
 * QueueStatus flags.
 */
export enum QS_ {
    KEY         = 0x0001,
    MOUSEMOVE   = 0x0002,
    MOUSEBUTTON = 0x0004,
    POSTMSG     = 0x0008,
    TIMER       = 0x0010,
    PAINT       = 0x0020,
    SENDMSG     = 0x0040,
    HOTKEY      = 0x0080,
    ALLPOSTMSG  = 0x0100,
    RAWINPUT    = 0x0400,
    MOUSE       = MOUSEMOVE | MOUSEBUTTON,
    INPUT       = MOUSE | KEY | RAWINPUT,
    ALLEVENTS   = INPUT | POSTMSG | TIMER | PAINT | HOTKEY,
    ALLINPUT    = INPUT | POSTMSG | TIMER | PAINT | HOTKEY | SENDMSG
}

/**
 * Predefined Value Types.
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

export const REG_CREATED_NEW_KEY              = 1
export const REG_OPENED_EXISTING_KEY          = 2
export const REG_PROCESS_APPKEY               = 0x00000001
export const REG_USE_CURRENT_SECURITY_CONTEXT = 0x00000002
export const REG_STANDARD_FORMAT              = 1
export const REG_LATEST_FORMAT                = 2
export const REG_NO_COMPRESSION               = 4

/**
 * PeekMessage flags.
 */
export enum PM_ {
    NOREMOVE   = 0x0000,
    REMOVE     = 0x0001,
    NOYIELD    = 0x0002,
    QS_INPUT   = (QS_.INPUT << 16),
    QS_POSTMSG = (QS_.POSTMSG << 16),
    QS_HOTKEY  = (QS_.HOTKEY << 16),
    QS_TIMER   = (QS_.TIMER << 16),
    QS_PAINT   = (QS_.PAINT << 16),
    QS_SENDMSG = (QS_.SENDMSG << 16)
}

/**
 * Access types for the Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/secmgmt/policy-object-access-rights
 */
export enum POLICY_ {
    VIEW_LOCAL_INFORMATION   = 0x00000001,
    VIEW_AUDIT_INFORMATION   = 0x00000002,
    GET_PRIVATE_INFORMATION  = 0x00000004,
    TRUST_ADMIN              = 0x00000008,
    CREATE_ACCOUNT           = 0x00000010,
    CREATE_SECRET            = 0x00000020,
    CREATE_PRIVILEGE         = 0x00000040,
    SET_DEFAULT_QUOTA_LIMITS = 0x00000080,
    SET_AUDIT_REQUIREMENTS   = 0x00000100,
    AUDIT_LOG_ADMIN          = 0x00000200,
    SERVER_ADMIN             = 0x00000400,
    LOOKUP_NAMES             = 0x00000800,
    NOTIFICATION             = 0x00001000,

    ALL_ACCESS = (
        ACCESS_MASK.STANDARD_RIGHTS_REQUIRED |
        VIEW_LOCAL_INFORMATION |
        VIEW_AUDIT_INFORMATION |
        GET_PRIVATE_INFORMATION |
        TRUST_ADMIN |
        CREATE_ACCOUNT |
        CREATE_SECRET |
        CREATE_PRIVILEGE |
        SET_DEFAULT_QUOTA_LIMITS |
        SET_AUDIT_REQUIREMENTS |
        AUDIT_LOG_ADMIN |
        SERVER_ADMIN |
        LOOKUP_NAMES
    ),

    READ = (
        ACCESS_MASK.STANDARD_RIGHTS_READ |
        VIEW_AUDIT_INFORMATION |
        GET_PRIVATE_INFORMATION
    ),

    WRITE = (
        ACCESS_MASK.STANDARD_RIGHTS_WRITE |
        TRUST_ADMIN |
        CREATE_ACCOUNT |
        CREATE_SECRET |
        CREATE_PRIVILEGE |
        SET_DEFAULT_QUOTA_LIMITS |
        SET_AUDIT_REQUIREMENTS |
        AUDIT_LOG_ADMIN |
        SERVER_ADMIN
    ),

    EXECUTE = (
        ACCESS_MASK.STANDARD_RIGHTS_EXECUTE |
        VIEW_LOCAL_INFORMATION |
        LOOKUP_NAMES
    )
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

/*
 * Scroll Bar Constants and Commands.
 */
export enum SB_ {
    // Constants
    MIN           = 0,
    HORZ          = 0,
    VERT          = 1,
    CTL           = 2,
    BOTH          = 3,
    // Commands
    LINEUP        = 0,
    LINELEFT      = 0,
    LINEDOWN      = 1,
    LINERIGHT     = 1,
    PAGEUP        = 2,
    PAGELEFT      = 2,
    PAGEDOWN      = 3,
    PAGERIGHT     = 3,
    THUMBPOSITION = 4,
    THUMBTRACK    = 5,
    TOP           = 6,
    LEFT          = 6,
    BOTTOM        = 7,
    RIGHT         = 7,
    ENDSCROLL     = 8,
}

/**
 * The SECURITY_DESCRIPTOR_CONTROL data type is a set of bit flags that qualify the meaning of a security descriptor or its components.
 *
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/security-descriptor-control
 */
export enum SECURITY_DESCRIPTOR_CONTROL_ {
    OWNER_DEFAULTED       = 0x0001,
    GROUP_DEFAULTED       = 0x0002,
    DACL_PRESENT          = 0x0004,
    DACL_DEFAULTED        = 0x0008,
    SACL_PRESENT          = 0x0010,
    SACL_DEFAULTED        = 0x0020,
    DACL_AUTO_INHERIT_REQ = 0x0100,
    SACL_AUTO_INHERIT_REQ = 0x0200,
    DACL_AUTO_INHERITED   = 0x0400,
    SACL_AUTO_INHERITED   = 0x0800,
    DACL_PROTECTED        = 0x1000,
    SACL_PROTECTED        = 0x2000,
    RM_CONTROL_VALID      = 0x4000,
    SELF_RELATIVE         = 0x8000,
}

/**
 * Group attributes
 */
export enum SE_GROUP_ {
    MANDATORY          = 0x00000001,
    ENABLED_BY_DEFAULT = 0x00000002,
    ENABLED            = 0x00000004,
    OWNER              = 0x00000008,
    USE_FOR_DENY_ONLY  = 0x00000010,
    INTEGRITY          = 0x00000020,
    INTEGRITY_ENABLED  = 0x00000040,
    LOGON_ID           = 0xC0000000,
    RESOURCE           = 0x20000000,

    VALID_ATTRIBUTES = (
        MANDATORY
        | ENABLED_BY_DEFAULT
        | ENABLED
        | OWNER
        | USE_FOR_DENY_ONLY
        | LOGON_ID
        | RESOURCE
        | INTEGRITY
        | INTEGRITY_ENABLED
    )
}

/**
 * Privilege Constants
 *
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/privilege-constants
 */
export enum SE_NAME {
    CREATE_TOKEN           = "SeCreateTokenPrivilege",
    ASSIGNPRIMARYTOKEN     = "SeAssignPrimaryTokenPrivilege",
    LOCK_MEMORY            = "SeLockMemoryPrivilege",
    INCREASE_QUOTA         = "SeIncreaseQuotaPrivilege",
    UNSOLICITED_INPUT      = "SeUnsolicitedInputPrivilege",
    MACHINE_ACCOUNT        = "SeMachineAccountPrivilege",
    TCB                    = "SeTcbPrivilege",
    SECURITY               = "SeSecurityPrivilege",
    TAKE_OWNERSHIP         = "SeTakeOwnershipPrivilege",
    LOAD_DRIVER            = "SeLoadDriverPrivilege",
    SYSTEM_PROFILE         = "SeSystemProfilePrivilege",
    SYSTEMTIME             = "SeSystemtimePrivilege",
    PROF_SINGLE_PROCESS    = "SeProfileSingleProcessPrivilege",
    INC_BASE_PRIORITY      = "SeIncreaseBasePriorityPrivilege",
    CREATE_PAGEFILE        = "SeCreatePagefilePrivilege",
    CREATE_PERMANENT       = "SeCreatePermanentPrivilege",
    BACKUP                 = "SeBackupPrivilege",
    RESTORE                = "SeRestorePrivilege",
    SHUTDOWN               = "SeShutdownPrivilege",
    DEBUG                  = "SeDebugPrivilege",
    AUDIT                  = "SeAuditPrivilege",
    SYSTEM_ENVIRONMENT     = "SeSystemEnvironmentPrivilege",
    CHANGE_NOTIFY          = "SeChangeNotifyPrivilege",
    REMOTE_SHUTDOWN        = "SeRemoteShutdownPrivilege",
    UNDOCK                 = "SeUndockPrivilege",
    SYNC_AGENT             = "SeSyncAgentPrivilege",
    ENABLE_DELEGATION      = "SeEnableDelegationPrivilege",
    MANAGE_VOLUME          = "SeManageVolumePrivilege",
    IMPERSONATE            = "SeImpersonatePrivilege",
    CREATE_GLOBAL          = "SeCreateGlobalPrivilege",
    TRUSTED_CREDMAN_ACCESS = "SeTrustedCredManAccessPrivilege",
    RELABEL                = "SeRelabelPrivilege",
    INC_WORKING_SET        = "SeIncreaseWorkingSetPrivilege",
    TIME_ZONE              = "SeTimeZonePrivilege",
    CREATE_SYMBOLIC_LINK   = "SeCreateSymbolicLinkPrivilege",
}

/**
 * (RID) The portion of a security identifier (SID) that identifies a user or group
 * in relation to the authority that issued the SID.
 */
export enum SECURITY_ {
    DIALUP_RID                                    = 0x00000001,
    NETWORK_RID                                   = 0x00000002,
    BATCH_RID                                     = 0x00000003,
    INTERACTIVE_RID                               = 0x00000004,
    LOGON_IDS_RID                                 = 0x00000005,
    LOGON_IDS_RID_COUNT                           = 3,
    SERVICE_RID                                   = 0x00000006,
    ANONYMOUS_LOGON_RID                           = 0x00000007,
    PROXY_RID                                     = 0x00000008,
    ENTERPRISE_CONTROLLERS_RID                    = 0x00000009,
    SERVER_LOGON_RID                              = ENTERPRISE_CONTROLLERS_RID,
    PRINCIPAL_SELF_RID                            = 0x0000000A,
    AUTHENTICATED_USER_RID                        = 0x0000000B,
    RESTRICTED_CODE_RID                           = 0x0000000C,
    TERMINAL_SERVER_RID                           = 0x0000000D,
    REMOTE_LOGON_RID                              = 0x0000000E,
    THIS_ORGANIZATION_RID                         = 0x0000000F,
    IUSER_RID                                     = 0x00000011,
    LOCAL_SYSTEM_RID                              = 0x00000012,
    LOCAL_SERVICE_RID                             = 0x00000013,
    NETWORK_SERVICE_RID                           = 0x00000014,
    NT_NON_UNIQUE                                 = 0x00000015,
    NT_NON_UNIQUE_SUB_AUTH_COUNT                  = 3,
    ENTERPRISE_READONLY_CONTROLLERS_RID           = 0x00000016,
    BUILTIN_DOMAIN_RID                            = 0x00000020,
    WRITE_RESTRICTED_CODE_RID                     = 0x00000021,
    PACKAGE_BASE_RID                              = 0x00000040,
    PACKAGE_RID_COUNT                             = 2,
    PACKAGE_NTLM_RID                              = 0x0000000A,
    PACKAGE_SCHANNEL_RID                          = 0x0000000E,
    PACKAGE_DIGEST_RID                            = 0x00000015,
    CRED_TYPE_BASE_RID                            = 0x00000041,
    CRED_TYPE_RID_COUNT                           = 2,
    CRED_TYPE_THIS_ORG_CERT_RID                   = 0x00000001,
    MIN_BASE_RID                                  = 0x00000050,
    SERVICE_ID_BASE_RID                           = 0x00000050,
    SERVICE_ID_RID_COUNT                          = 6,
    RESERVED_ID_BASE_RID                          = 0x00000051,
    APPPOOL_ID_BASE_RID                           = 0x00000052,
    APPPOOL_ID_RID_COUNT                          = 6,
    VIRTUALSERVER_ID_BASE_RID                     = 0x00000053,
    VIRTUALSERVER_ID_RID_COUNT                    = 6,
    USERMODEDRIVERHOST_ID_BASE_RID                = 0x00000054,
    USERMODEDRIVERHOST_ID_RID_COUNT               = 6,
    CLOUD_INFRASTRUCTURE_SERVICES_ID_BASE_RID     = 0x00000055,
    CLOUD_INFRASTRUCTURE_SERVICES_ID_RID_COUNT    = 6,
    WMIHOST_ID_BASE_RID                           = 0x00000056,
    WMIHOST_ID_RID_COUNT                          = 6,
    TASK_ID_BASE_RID                              = 0x00000057,
    NFS_ID_BASE_RID                               = 0x00000058,
    COM_ID_BASE_RID                               = 0x00000059,
    WINDOW_MANAGER_BASE_RID                       = 0x0000005A,
    RDV_GFX_BASE_RID                              = 0x0000005B,
    DASHOST_ID_BASE_RID                           = 0x0000005C,
    DASHOST_ID_RID_COUNT                          = 6,
    USERMANAGER_ID_BASE_RID                       = 0x0000005D,
    USERMANAGER_ID_RID_COUNT                      = 6,
    WINRM_ID_BASE_RID                             = 0x0000005E,
    WINRM_ID_RID_COUNT                            = 6,
    CCG_ID_BASE_RID                               = 0x0000005F,
    UMFD_BASE_RID                                 = 0x00000060,
    UNIQUIFIED_SERVICE_BASE_RID                   = 0x00000061,
    VIRTUALACCOUNT_ID_RID_COUNT                   = 6,
    EDGE_CLOUD_INFRASTRUCTURE_SERVICE_ID_BASE_RID = 0x00000062,
    RESTRICTED_SERVICES_BASE_RID                  = 0x00000063,
    RESTRICTED_SERVICES_RID_COUNT                 = 6,
    //
    // Virtual account logon is not limited to inbox callers.  Reserve base RID 0x6F for application usage.
    //
    MAX_BASE_RID                                  = 0x0000006F,
    MAX_ALWAYS_FILTERED                           = 0x000003E7,
    MIN_NEVER_FILTERED                            = 0x000003E8,
    OTHER_ORGANIZATION_RID                        = 0x000003E8,
    //
    //Service SID type RIDs are in the range 0x50- 0x6F.  Therefore, we are giving  the next available RID to Windows Mobile team.
    //
    WINDOWSMOBILE_ID_BASE_RID                     = 0x00000070,
    //
    // Installer Capability Group Sid related. Currently Base RID is same as LOCAL DOMAIN.
    //
    INSTALLER_GROUP_CAPABILITY_BASE               = 0x20,
    INSTALLER_GROUP_CAPABILITY_RID_COUNT          = 9,
    // Note: This is because the App Capability Rid is S-1-15-3-1024-...
    //       whereas the service group rid is          S-1-5-32-...
    //	The number of RIDs from hash (8) are the same for both
    INSTALLER_CAPABILITY_RID_COUNT                = 10,
    //
    //Well-known group for local accounts
    //
    LOCAL_ACCOUNT_RID                             = 0x00000071,
    LOCAL_ACCOUNT_AND_ADMIN_RID                   = 0x00000072,
}

/*
 * GetSystemMetrics() codes.
 */
export enum SM_ {
    CXSCREEN                    = 0,
    CYSCREEN                    = 1,
    CXVSCROLL                   = 2,
    CYHSCROLL                   = 3,
    CYCAPTION                   = 4,
    CXBORDER                    = 5,
    CYBORDER                    = 6,
    CXDLGFRAME                  = 7,
    CYDLGFRAME                  = 8,
    CYVTHUMB                    = 9,
    CXHTHUMB                    = 10,
    CXICON                      = 11,
    CYICON                      = 12,
    CXCURSOR                    = 13,
    CYCURSOR                    = 14,
    CYMENU                      = 15,
    CXFULLSCREEN                = 16,
    CYFULLSCREEN                = 17,
    CYKANJIWINDOW               = 18,
    MOUSEPRESENT                = 19,
    CYVSCROLL                   = 20,
    CXHSCROLL                   = 21,
    DEBUG                       = 22,
    SWAPBUTTON                  = 23,
    RESERVED1                   = 24,
    RESERVED2                   = 25,
    RESERVED3                   = 26,
    RESERVED4                   = 27,
    CXMIN                       = 28,
    CYMIN                       = 29,
    CXSIZE                      = 30,
    CYSIZE                      = 31,
    CXFRAME                     = 32,
    CYFRAME                     = 33,
    CXMINTRACK                  = 34,
    CYMINTRACK                  = 35,
    CXDOUBLECLK                 = 36,
    CYDOUBLECLK                 = 37,
    CXICONSPACING               = 38,
    CYICONSPACING               = 39,
    MENUDROPALIGNMENT           = 40,
    PENWINDOWS                  = 41,
    DBCSENABLED                 = 42,
    CMOUSEBUTTONS               = 43,
    SECURE                      = 44,
    CXEDGE                      = 45,
    CYEDGE                      = 46,
    CXMINSPACING                = 47,
    CYMINSPACING                = 48,
    CXSMICON                    = 49,
    CYSMICON                    = 50,
    CYSMCAPTION                 = 51,
    CXSMSIZE                    = 52,
    CYSMSIZE                    = 53,
    CXMENUSIZE                  = 54,
    CYMENUSIZE                  = 55,
    ARRANGE                     = 56,
    CXMINIMIZED                 = 57,
    CYMINIMIZED                 = 58,
    CXMAXTRACK                  = 59,
    CYMAXTRACK                  = 60,
    CXMAXIMIZED                 = 61,
    CYMAXIMIZED                 = 62,
    NETWORK                     = 63,
    CLEANBOOT                   = 67,
    CXDRAG                      = 68,
    CYDRAG                      = 69,
    SHOWSOUNDS                  = 70,
    CXMENUCHECK                 = 71,             /* Use instead of GetMenuCheckMarkDimensions()! */
    CYMENUCHECK                 = 72,
    SLOWMACHINE                 = 73,
    MIDEASTENABLED              = 74,
    MOUSEWHEELPRESENT           = 75,
    XVIRTUALSCREEN              = 76,
    YVIRTUALSCREEN              = 77,
    CXVIRTUALSCREEN             = 78,
    CYVIRTUALSCREEN             = 79,
    CMONITORS                   = 80,
    SAMEDISPLAYFORMAT           = 81,
    IMMENABLED                  = 82,
    CXFOCUSBORDER               = 83,
    CYFOCUSBORDER               = 84,
    TABLETPC                    = 86,
    MEDIACENTER                 = 87,
    STARTER                     = 88,
    SERVERR2                    = 89,
    MOUSEHORIZONTALWHEELPRESENT = 91,
    CXPADDEDBORDER              = 92,
    DIGITIZER                   = 94,
    MAXIMUMTOUCHES              = 95,
    CMETRICS                    = 97,
    REMOTESESSION               = 0x1000,
    SHUTTINGDOWN                = 0x2000,
    REMOTECONTROL               = 0x2001,
    CARETBLINKINGENABLED        = 0x2002,
    CONVERTIBLESLATEMODE        = 0x2003,
    SYSTEMDOCKED                = 0x2004,
    CXFIXEDFRAME                = CXDLGFRAME,     /* ;win40 name change */
    CYFIXEDFRAME                = CYDLGFRAME,     /* ;win40 name change */
    CXSIZEFRAME                 = CXFRAME,        /* ;win40 name change */
    CYSIZEFRAME                 = CYFRAME,        /* ;win40 name change */
}

/**
 * SW_xxx - ShowWindow() Commands (nCmdShow) & identifiers for the WM_SHOWWINDOW message.
 */
export enum SW_ {
    HIDE            = 0,
    SHOWNORMAL      = 1,
    NORMAL          = 1,
    SHOWMINIMIZED   = 2,
    SHOWMAXIMIZED   = 3,
    MAXIMIZE        = 3,
    SHOWNOACTIVATE  = 4,
    SHOW            = 5,
    MINIMIZE        = 6,
    SHOWMINNOACTIVE = 7,
    SHOWNA          = 8,
    RESTORE         = 9,
    SHOWDEFAULT     = 10,
    FORCEMINIMIZE   = 11,
    MAX             = 11,

    PARENTCLOSING   = 1,
    OTHERZOOM       = 2,
    PARENTOPENING   = 3,
    OTHERUNZOOM     = 4
}

/**
 * Token Specific Access Rights.
 */
export enum TOKEN_ {
    ASSIGN_PRIMARY    = 0x0001,
    DUPLICATE         = 0x0002,
    IMPERSONATE       = 0x0004,
    QUERY             = 0x0008,
    QUERY_SOURCE      = 0x0010,
    ADJUST_PRIVILEGES = 0x0020,
    ADJUST_GROUPS     = 0x0040,
    ADJUST_DEFAULT    = 0x0080,
    ADJUST_SESSIONID  = 0x0100,

    ALL_ACCESS = ACCESS_MASK.STANDARD_RIGHTS_REQUIRED
                 | ASSIGN_PRIMARY
                 | DUPLICATE | IMPERSONATE | QUERY | QUERY_SOURCE
                 | ADJUST_PRIVILEGES | ADJUST_GROUPS | ADJUST_DEFAULT
}

/**
 * The TOKEN_ELEVATION_TYPE enumeration indicates the elevation type of token being queried by the GetTokenInformation() function.
 */
export enum TOKEN_ELEVATION_TYPE {
    TokenElevationTypeDefault = 1,
    TokenElevationTypeFull,
    TokenElevationTypeLimited
}

/**
 * Token information class values for GetTokenInformation() and SetTokenInformation()
 */
export enum TOKEN_INFORMATION_CLASS {
    TokenUser = 1,
    TokenGroups,
    TokenPrivileges,
    TokenOwner,
    TokenPrimaryGroup,
    TokenDefaultDacl,
    TokenSource,
    TokenType,
    TokenImpersonationLevel,
    TokenStatistics,
    TokenRestrictedSids,
    TokenSessionId,
    TokenGroupsAndPrivileges,
    TokenSessionReference,
    TokenSandBoxInert,
    TokenAuditPolicy,
    TokenOrigin,
    TokenElevationType,
    TokenLinkedToken,
    TokenElevation,
    TokenHasRestrictions,
    TokenAccessInformation,
    TokenVirtualizationAllowed,
    TokenVirtualizationEnabled,
    TokenIntegrityLevel,
    TokenUIAccess,
    TokenMandatoryPolicy,
    TokenLogonSid,
    TokenIsAppContainer,
    TokenCapabilities,
    TokenAppContainerSid,
    TokenAppContainerNumber,
    TokenUserClaimAttributes,
    TokenDeviceClaimAttributes,
    TokenRestrictedUserClaimAttributes,
    TokenRestrictedDeviceClaimAttributes,
    TokenDeviceGroups,
    TokenRestrictedDeviceGroups,
    TokenSecurityAttributes,
    TokenIsRestricted,
    TokenProcessTrustLevel,
    TokenPrivateNameSpace,
    TokenSingletonAttributes,
    TokenBnoIsolation,
    TokenChildProcessFlags,
    TokenIsLessPrivilegedAppContainer,
    TokenIsSandboxed,
    TokenIsAppSilo,
    TokenLastEnforce = TokenIsAppSilo,
    MaxTokenInfoClass
}

export enum TOKEN_TYPE_ {
    TokenPrimary = 1,
    TokenImpersonation
}

/**
 * Track Popup Menu Flags
 */
export enum TPM_ {
    LEFTBUTTON      = 0x0000,
    RIGHTBUTTON     = 0x0002,
    LEFTALIGN       = 0x0000,
    CENTERALIGN     = 0x0004,
    RIGHTALIGN      = 0x0008,
    TOPALIGN        = 0x0000,
    VCENTERALIGN    = 0x0010,
    BOTTOMALIGN     = 0x0020,
    HORIZONTAL      = 0x0000,
    VERTICAL        = 0x0040,
    NONOTIFY        = 0x0080,
    RETURNCMD       = 0x0100,
    RECURSE         = 0x0001,
    HORPOSANIMATION = 0x0400,
    HORNEGANIMATION = 0x0800,
    VERPOSANIMATION = 0x1000,
    VERNEGANIMATION = 0x2000,
    NOANIMATION     = 0x4000,
    LAYOUTRTL       = 0x8000
}

/**
 * WM_xxx - Window Messages
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-notifications
 */
export enum WM_ {
    ACTIVATE                       = 0x0006,
    ACTIVATEAPP                    = 0x001c,
    AFXFIRST                       = 0x0360,
    AFXLAST                        = 0x037f,
    APP                            = 0x8000,
    APPCOMMAND                     = 0x0319,
    ASKCBFORMATNAME                = 0x030c,
    CANCELJOURNAL                  = 0x004B,
    CANCELMODE                     = 0x001f,
    CAPTURECHANGED                 = 0x0215,
    CHANGECBCHAIN                  = 0x030d,
    CHANGEUISTATE                  = 0x0127,
    CHAR                           = 0x0102,
    CHARTOITEM                     = 0x002f,
    CHILDACTIVATE                  = 0x0022,
    CLEAR                          = 0x0303,
    CLIPBOARDUPDATE                = 0x031d,
    CLOSE                          = 0x0010,
    CODE_NOCHAR                    = 0xffff,
    COMMAND                        = 0x0111,
    COMMNOTIFY                     = 0x0044,
    COMPACTING                     = 0x0041,
    COMPAREITEM                    = 0x0039,
    CONTEXTMENU                    = 0x007b,
    COPY                           = 0x0301,
    COPYDATA                       = 0x004a,
    CREATE                         = 0x0001,
    CTLCOLORBTN                    = 0x0135,
    CTLCOLORDLG                    = 0x0136,
    CTLCOLOREDIT                   = 0x0133,
    CTLCOLORLISTBOX                = 0x0134,
    CTLCOLORMSGBOX                 = 0x0132,
    CTLCOLORSCROLLBAR              = 0x0137,
    CTLCOLORSTATIC                 = 0x0138,
    CUT                            = 0x0300,
    DEADCHAR                       = 0x0103,
    DELETEITEM                     = 0x002d,
    DESTROY                        = 0x0002,
    DESTROYCLIPBOARD               = 0x0307,
    DEVICECHANGE                   = 0x0219,
    DEVMODECHANGE                  = 0x001b,
    DISPLAYCHANGE                  = 0x007e,
    DPICHANGED                     = 0x02e0,
    DPICHANGED_AFTERPARENT         = 0x02e3,
    DPICHANGED_BEFOREPARENT        = 0x02e2,
    DRAWCLIPBOARD                  = 0x0308,
    DRAWITEM                       = 0x002b,
    DROPFILES                      = 0x0233,
    DWMCOLORIZATIONCOLORCHANGED    = 0x0320,
    DWMCOMPOSITIONCHANGED          = 0x031e,
    DWMNCRENDERINGCHANGED          = 0x031f,
    DWMSENDICONICLIVEPREVIEWBITMAP = 0x0326,
    DWMSENDICONICTHUMBNAIL         = 0x0323,
    DWMWINDOWMAXIMIZEDCHANGE       = 0x0321,
    ENABLE                         = 0x000a,
    ENDSESSION                     = 0x0016,
    ENTERIDLE                      = 0x0121,
    ENTERMENULOOP                  = 0x0211,
    ENTERSIZEMOVE                  = 0x0231,
    ERASEBKGND                     = 0x0014,
    EXITMENULOOP                   = 0x0212,
    EXITSIZEMOVE                   = 0x0232,
    FONTCHANGE                     = 0x001d,
    GESTURE                        = 0x0119,
    GESTURENOTIFY                  = 0x011a,
    GETDLGCODE                     = 0x0087,
    GETDPISCALEDSIZE               = 0x02e4,
    GETFONT                        = 0x0031,
    GETHMENU                       = 0x01e1,
    GETHOTKEY                      = 0x0033,
    GETICON                        = 0x007f,
    GETMINMAXINFO                  = 0x0024,
    GETOBJECT                      = 0x003d,
    GETTEXT                        = 0x000d,
    GETTEXTLENGTH                  = 0x000e,
    GETTITLEBARINFOEX              = 0x033f,
    HANDHELDFIRST                  = 0x0358,
    HANDHELDLAST                   = 0x035f,
    HELP                           = 0x0053,
    HOTKEY                         = 0x0312,
    HSCROLL                        = 0x0114,
    HSCROLLCLIPBOARD               = 0x030e,
    ICONERASEBKGND                 = 0x0027,
    IME_CHAR                       = 0x0286,
    IME_COMPOSITION                = 0x010f,
    IME_COMPOSITIONFULL            = 0x0284,
    IME_CONTROL                    = 0x0283,
    IME_ENDCOMPOSITION             = 0x010e,
    IME_KEYDOWN                    = 0x0290,
    IME_KEYLAST                    = 0x010f,
    IME_KEYUP                      = 0x0291,
    IME_NOTIFY                     = 0x0282,
    IME_REQUEST                    = 0x0288,
    IME_SELECT                     = 0x0285,
    IME_SETCONTEXT                 = 0x0281,
    IME_STARTCOMPOSITION           = 0x010d,
    INITDIALOG                     = 0x0110,
    INITMENU                       = 0x0116,
    INITMENUPOPUP                  = 0x0117,
    INPUT                          = 0x00ff,
    INPUT_DEVICE_CHANGE            = 0x00fe,
    INPUTLANGCHANGE                = 0x0051,
    INPUTLANGCHANGEREQUEST         = 0x0050,
    KEYDOWN                        = 0x0100,
    KEYFIRST                       = 0x0100,
    KEYLAST                        = 0x0109,
    KEYUP                          = 0x0101,
    KILLFOCUS                      = 0x0008,
    LBUTTONDBLCLK                  = 0x0203,
    LBUTTONDOWN                    = 0x0201,
    LBUTTONUP                      = 0x0202,
    MBUTTONDBLCLK                  = 0x0209,
    MBUTTONDOWN                    = 0x0207,
    MBUTTONUP                      = 0x0208,
    MDIACTIVATE                    = 0x0222,
    MDICASCADE                     = 0x0227,
    MDICREATE                      = 0x0220,
    MDIDESTROY                     = 0x0221,
    MDIGETACTIVE                   = 0x0229,
    MDIICONARRANGE                 = 0x0228,
    MDIMAXIMIZE                    = 0x0225,
    MDINEXT                        = 0x0224,
    MDIREFRESHMENU                 = 0x0234,
    MDIRESTORE                     = 0x0223,
    MDISETMENU                     = 0x0230,
    MDITILE                        = 0x0226,
    MEASUREITEM                    = 0x002c,
    MENUCHAR                       = 0x0120,
    MENUCOMMAND                    = 0x0126,
    MENUDRAG                       = 0x0123,
    MENUGETOBJECT                  = 0x0124,
    MENURBUTTONUP                  = 0x0122,
    MENUSELECT                     = 0x011f,
    MOUSEACTIVATE                  = 0x0021,
    MOUSEFIRST                     = 0x0200,
    MOUSEHOVER                     = 0x02a1,
    MOUSEHWHEEL                    = 0x020e,
    MOUSELAST                      = 0x020e,
    MOUSELEAVE                     = 0x02a3,
    MOUSEMOVE                      = 0x0200,
    MOUSEWHEEL                     = 0x020a,
    MOVE                           = 0x0003,
    MOVING                         = 0x0216,
    NCACTIVATE                     = 0x0086,
    NCCALCSIZE                     = 0x0083,
    NCCREATE                       = 0x0081,
    NCDESTROY                      = 0x0082,
    NCHITTEST                      = 0x0084,
    NCLBUTTONDBLCLK                = 0x00a3,
    NCLBUTTONDOWN                  = 0x00a1,
    NCLBUTTONUP                    = 0x00a2,
    NCMBUTTONDBLCLK                = 0x00a9,
    NCMBUTTONDOWN                  = 0x00a7,
    NCMBUTTONUP                    = 0x00a8,
    NCMOUSEHOVER                   = 0x02a0,
    NCMOUSELEAVE                   = 0x02a2,
    NCMOUSEMOVE                    = 0x00a0,
    NCPAINT                        = 0x0085,
    NCPOINTERDOWN                  = 0x0242,
    NCPOINTERUP                    = 0x0243,
    NCPOINTERUPDATE                = 0x0241,
    NCRBUTTONDBLCLK                = 0x00a6,
    NCRBUTTONDOWN                  = 0x00a4,
    NCRBUTTONUP                    = 0x00a5,
    NCXBUTTONDBLCLK                = 0x00ad,
    NCXBUTTONDOWN                  = 0x00ab,
    NCXBUTTONUP                    = 0x00ac,
    NEXTDLGCTL                     = 0x0028,
    NEXTMENU                       = 0x0213,
    NOTIFY                         = 0x004e,
    NOTIFYFORMAT                   = 0x0055,
    NULL                           = 0x0000,
    PAINT                          = 0x000f,
    PAINTCLIPBOARD                 = 0x0309,
    PAINTICON                      = 0x0026,
    PALETTECHANGED                 = 0x0311,
    PALETTEISCHANGING              = 0x0310,
    PARENTNOTIFY                   = 0x0210,
    PASTE                          = 0x0302,
    PENWINFIRST                    = 0x0380,
    PENWINLAST                     = 0x038f,
    POINTERACTIVATE                = 0x024b,
    POINTERCAPTURECHANGED          = 0x024c,
    POINTERDEVICECHANGE            = 0x0238,
    POINTERDEVICEINRANGE           = 0x0239,
    POINTERDEVICEOUTOFRANGE        = 0x023a,
    POINTERDOWN                    = 0x0246,
    POINTERENTER                   = 0x0249,
    POINTERHITTEST                 = 0x0250,
    POINTERHWHEEL                  = 0x024f,
    POINTERLEAVE                   = 0x024a,
    POINTERROUTEDAWAY              = 0x0252,
    POINTERROUTEDRELEASED          = 0x0253,
    POINTERROUTEDTO                = 0x0251,
    POINTERUP                      = 0x0247,
    POINTERUPDATE                  = 0x0245,
    POINTERWHEEL                   = 0x024e,
    POWER                          = 0x0048,
    POWERBROADCAST                 = 0x0218,
    PRINT                          = 0x0317,
    PRINTCLIENT                    = 0x0318,
    QUERYDRAGICON                  = 0x0037,
    QUERYENDSESSION                = 0x0011,
    QUERYNEWPALETTE                = 0x030f,
    QUERYOPEN                      = 0x0013,
    QUERYUISTATE                   = 0x0129,
    QUEUESYNC                      = 0x0023,
    QUIT                           = 0x0012,
    RBUTTONDBLCLK                  = 0x0206,
    RBUTTONDOWN                    = 0x0204,
    RBUTTONUP                      = 0x0205,
    RENDERALLFORMATS               = 0x0306,
    RENDERFORMAT                   = 0x0305,
    SETCURSOR                      = 0x0020,
    SETFOCUS                       = 0x0007,
    SETFONT                        = 0x0030,
    SETHOTKEY                      = 0x0032,
    SETICON                        = 0x0080,
    SETREDRAW                      = 0x000b,
    SETTEXT                        = 0x000c,
    SHOWWINDOW                     = 0x0018,
    SIZE                           = 0x0005,
    SIZECLIPBOARD                  = 0x030b,
    SIZING                         = 0x0214,
    SPOOLERSTATUS                  = 0x002a,
    STYLECHANGED                   = 0x007d,
    STYLECHANGING                  = 0x007c,
    SYNCPAINT                      = 0x0088,
    SYSCHAR                        = 0x0106,
    SYSCOLORCHANGE                 = 0x0015,
    SYSCOMMAND                     = 0x0112,
    SYSDEADCHAR                    = 0x0107,
    SYSKEYDOWN                     = 0x0104,
    SYSKEYUP                       = 0x0105,
    TABLET_FIRST                   = 0x02c0,
    TABLET_LAST                    = 0x02df,
    TCARD                          = 0x0052,
    THEMECHANGED                   = 0x031a,
    TIMECHANGE                     = 0x001e,
    TIMER                          = 0x0113,
    TOUCH                          = 0x0240,
    TOUCHHITTESTING                = 0x024d,
    UNDO                           = 0x0304,
    UNICHAR                        = 0x0109,
    UNINITMENUPOPUP                = 0x0125,
    UPDATEUISTATE                  = 0x0128,
    USERCHANGED                    = 0x0054,
    VKEYTOITEM                     = 0x002e,
    VSCROLL                        = 0x0115,
    VSCROLLCLIPBOARD               = 0x030a,
    WINDOWPOSCHANGED               = 0x0047,
    WINDOWPOSCHANGING              = 0x0046,
    WININICHANGE                   = 0x001a,
    WTSSESSION_CHANGE              = 0x02b1,
    XBUTTONDBLCLK                  = 0x020d,
    XBUTTONDOWN                    = 0x020b,
    XBUTTONUP                      = 0x020c,
    SETTINGCHANGE                  = WININICHANGE,

    /*
    * NOTE: All Message Numbers below 0x0400 are RESERVED.
    *
    * Private Window Messages Start Here:
    */
    USER = 0x0400
}

/** WM_ACTIVATE state values. */
export enum WM_ACTIVATE {
    INACTIVE    = 0,
    ACTIVE      = 1,
    CLICKACTIVE = 2
}

/**
 * WS_xxx - Window styles for CreateWindow().
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-styles
 */
export enum WS_ {
    BORDER           = 0x00800000,
    CAPTION          = 0x00c00000, /* WS_BORDER | WS_DLGFRAME  */
    CHILD            = 0x40000000,
    CLIPCHILDREN     = 0x02000000,
    CLIPSIBLINGS     = 0x04000000,
    DISABLED         = 0x08000000,
    DLGFRAME         = 0x00400000,
    GROUP            = 0x00020000,
    HSCROLL          = 0x00100000,
    MAXIMIZE         = 0x01000000,
    MAXIMIZEBOX      = 0x00010000,
    MINIMIZE         = 0x20000000,
    MINIMIZEBOX      = 0x00020000,
    OVERLAPPED       = 0x00000000,
    POPUP            = 0x80000000,
    SYSMENU          = 0x00080000,
    TABSTOP          = 0x00010000,
    THICKFRAME       = 0x00040000,
    VISIBLE          = 0x10000000,
    VSCROLL          = 0x00200000,
    CHILDWINDOW      = CHILD,
    ICONIC           = MINIMIZE,
    OVERLAPPEDWINDOW = OVERLAPPED | CAPTION | SYSMENU | THICKFRAME | MINIMIZEBOX | MAXIMIZEBOX,
    POPUPWINDOW      = POPUP | BORDER | SYSMENU,
    SIZEBOX          = THICKFRAME,
    TILED            = OVERLAPPED,
    TILEDWINDOW      = OVERLAPPEDWINDOW
}

/**
 * WS_EX_xxx - Extended Window styles for CreateWindowEx().
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/extended-window-styles
 */
export enum WS_EX_ {
    ACCEPTFILES         = 0x00000010,
    APPWINDOW           = 0x00040000,
    CLIENTEDGE          = 0x00000200,
    COMPOSITED          = 0x02000000,
    CONTEXTHELP         = 0x00000400,
    CONTROLPARENT       = 0x00010000,
    DLGMODALFRAME       = 0x00000001,
    EX_LAYOUTRTL        = 0x00400000,
    LAYERED             = 0x00080000,
    LEFT                = 0x00000000,
    LEFTSCROLLBAR       = 0x00004000,
    LTRREADING          = 0x00000000,
    MDICHILD            = 0x00000040,
    NOACTIVATE          = 0x08000000,
    NOINHERITLAYOUT     = 0x00100000,
    NOPARENTNOTIFY      = 0x00000004,
    NOREDIRECTIONBITMAP = 0x00200000,
    RIGHT               = 0x00001000,
    RIGHTSCROLLBAR      = 0x00000000,
    RTLREADING          = 0x00002000,
    STATICEDGE          = 0x00020000,
    TOOLWINDOW          = 0x00000080,
    TOPMOST             = 0x00000008,
    TRANSPARENT         = 0x00000020,
    WINDOWEDGE          = 0x00000100,
    OVERLAPPEDWINDOW    = WINDOWEDGE | CLIENTEDGE,
    PALETTEWINDOW       = WINDOWEDGE | TOOLWINDOW | TOPMOST
}

export const SECURITY_NULL_SID_AUTHORITY         = [ 0, 0, 0, 0, 0,  0 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_WORLD_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  1 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_LOCAL_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  2 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_CREATOR_SID_AUTHORITY      = [ 0, 0, 0, 0, 0,  3 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NON_UNIQUE_AUTHORITY       = [ 0, 0, 0, 0, 0,  4 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NT_AUTHORITY               = [ 0, 0, 0, 0, 0,  5 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_RESOURCE_MANAGER_AUTHORITY = [ 0, 0, 0, 0, 0,  9 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_APP_PACKAGE_AUTHORITY      = [ 0, 0, 0, 0, 0, 15 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_MANDATORY_LABEL_AUTHORITY  = [ 0, 0, 0, 0, 0, 16 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_SCOPED_POLICY_ID_AUTHORITY = [ 0, 0, 0, 0, 0, 17 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_AUTHENTICATION_AUTHORITY   = [ 0, 0, 0, 0, 0, 18 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_PROCESS_TRUST_AUTHORITY    = [ 0, 0, 0, 0, 0, 19 ] as const satisfies SID_IDENTIFIER_AUTHORITY

/**
 * The SECURITY_IMPERSONATION_LEVEL enumeration contains values that specify security impersonation levels.
 */
export enum SECURITY_IMPERSONATION_LEVEL {
    SecurityAnonymous,
    SecurityIdentification,
    SecurityImpersonation,
    SecurityDelegation
}

/**
 * The SID_NAME_USE enumeration contains values that specify the type of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-sid_name_use
 */
export enum SID_NAME_USE {
    SidTypeUser = 1,
    SidTypeGroup,
    SidTypeDomain,
    SidTypeAlias,
    SidTypeWellKnownGroup,
    SidTypeDeletedAccount,
    SidTypeInvalid,
    SidTypeUnknown,
    SidTypeComputer,
    SidTypeLabel,
    SidTypeLogonSession
}
