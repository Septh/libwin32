
/**
 * The following are masks for the predefined standard access types.
 */
export enum ACCESS_MASK {
    DELETE = 0x00010000,
    READ_CONTROL = 0x00020000,
    WRITE_DAC = 0x00040000,
    WRITE_OWNER = 0x00080000,
    SYNCHRONIZE = 0x00100000,
    STANDARD_RIGHTS_REQUIRED = 0x000F0000,
    STANDARD_RIGHTS_READ = READ_CONTROL,
    STANDARD_RIGHTS_WRITE = READ_CONTROL,
    STANDARD_RIGHTS_EXECUTE = READ_CONTROL,
    STANDARD_RIGHTS_ALL = 0x001F0000,
    SPECIFIC_RIGHTS_ALL = 0x0000FFFF
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

/** Return this value to deny a query. */
export const BROADCAST_QUERY_DENY = 0x424D5144

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
export enum CW_ {
    USEDEFAULT = 0x80000000
}

/** Maximum length (in characters) of a user name. */
export const UNLEN = 256

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
export const enum NIF_ {
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
export const enum NIM_ {
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
 * The SECURITY_IMPERSONATION_LEVEL enumeration contains values that specify security impersonation levels.
 */
export enum SECURITY_IMPERSONATION_LEVEL {
    SecurityAnonymous,
    SecurityIdentification,
    SecurityImpersonation,
    SecurityDelegation
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
