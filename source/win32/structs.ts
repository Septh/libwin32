import koffi from 'koffi-cream'
import { Internals } from './private.js'
import {
    cBOOL, cINT, cUINT, cCHAR, cBYTE, cWCHAR, cSHORT, cUSHORT, cWORD,
    cLONG, cULONG, cDWORD, cLONGLONG, cULONG_PTR, cLONG64, cULONG64, cDWORD64, cPVOID, cSTR, cSIZE_T,
    cHANDLE, type HANDLE, type HINSTANCE, type HICON, type HCURSOR, type HBRUSH, type HDESK, type HWND, type HTOKEN, type HKEY, type HMONITOR,
    cWPARAM, type WPARAM, cLPARAM, type LPARAM,
    cLRESULT, type LRESULT
} from './ctypes.js'
import type {
    CS_, NIF_, TOKEN_TYPE_,
    CLAIM_SECURITY_ATTRIBUTE_, CLAIM_SECURITY_ATTRIBUTE_TYPE_,
    SECURITY_IMPERSONATION_LEVEL, SECURITY_DESCRIPTOR_CONTROL_,
    REG_, SEE_MASK_, SW_,
    SE_ERR_
} from './consts.js'

/**
 * The ACL structure is the header of an access control list (ACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-acl
 */
export class ACL {
    readonly AclRevision = Internals.ACL_REVISION
    readonly Sbsz1 = 0  // Used for alignment
    readonly Sbsz2 = 0  // Used for alignment
    constructor(
        public AceCount: number = 0,
        public AclSize:  number = 0
    ) {}
}

/** @internal */
export const cACL = koffi.struct({
    AclRevision: cBYTE,
    Sbsz1:       cBYTE,
    AclSize:     cWORD,
    AceCount:    cWORD,
    Sbsz2:       cWORD
})

export const ACL_REVISION = Internals.ACL_REVISION
export const ACL_REVISION_DS = Internals.ACL_REVISION_DS

/**
 * The CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE structure specifies the fully qualified binary name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_fqbn_value
 */
export interface CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE {
    Version: BigInt
    Name:    String
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE = koffi.struct({
    Version: cDWORD64,
    Name:    cSTR
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE structure specifies the OCTET_STRING value type of the claim security attribute.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_octet_string_value
 */
export interface CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE {
    pValue:      BigInt
    ValueLength: number
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE = koffi.struct({
    pValue:      cPVOID,
    ValueLength: cDWORD
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_V1 structure defines a security attribute that can be associated with a token or authorization context.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_v1
 */
export class CLAIM_SECURITY_ATTRIBUTE_V1 {
    readonly Reserved = 0
    public Values = new koffi.Union('CLAIM_SECURITY_ATTRIBUTE_V1_Values') as {
        pInt64?:       BigInt[]
        pUint64?:      BigInt[]
        ppString?:     string[]
        pFqbn?:        CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE[]
        pOctetString?: CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE[]
    }
    constructor(
        public Name: string = null!,
        public Flags: CLAIM_SECURITY_ATTRIBUTE_ = 0 as CLAIM_SECURITY_ATTRIBUTE_,
        public ValueType: CLAIM_SECURITY_ATTRIBUTE_TYPE_ = 0,
        public ValueCount = 0,
               { pInt64, pUint64, ppString, pFqbn, pOctetString }: CLAIM_SECURITY_ATTRIBUTE_V1['Values'] = {}
    ) {
        if (pInt64)
            this.Values.pInt64 = pInt64
        else if (pUint64)
            this.Values.pInt64 = pUint64
        else if (ppString)
            this.Values.ppString = ppString
        else if (pFqbn)
            this.Values.pFqbn = pFqbn
        else if (pOctetString)
            this.Values.pOctetString = pOctetString
    }
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct({
    Name:       cSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     koffi.union('CLAIM_SECURITY_ATTRIBUTE_V1_Values', {
        pInt64:        koffi.pointer(cLONG64, Internals.ANYSIZE_ARRAY),
        pUint64:       koffi.pointer(cDWORD64, Internals.ANYSIZE_ARRAY),
        ppString:      koffi.pointer(cSTR, Internals.ANYSIZE_ARRAY),
        pFqbn:         koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE, Internals.ANYSIZE_ARRAY),
        pOctectString: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE, Internals.ANYSIZE_ARRAY)
    })
})

/**
 * The CLAIM_SECURITY_ATTRIBUTES_INFORMATION structure defines the security attributes for the claim.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attributes_information
 */
export interface CLAIM_SECURITY_ATTRIBUTES_INFORMATION {
    Version: number
    Reserved: 0
    AttributeCount: number
    Attribute: { pAttributeV1: CLAIM_SECURITY_ATTRIBUTE_V1[] | null }
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.struct({
    Version:        cWORD,
    Reserved:       cWORD,
    AttributeCount: cDWORD,
    Attribute:      koffi.struct({  // Should be a union, but there is only one member...
        pAttributeV1: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_V1, Internals.ANYSIZE_ARRAY)
    })
})

export const CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION = Internals.CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1

/**
 * Contains a 64-bit value representing the number of 100-nanosecond intervals since January 1, 1601 (UTC).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime
 */
export interface FILETIME {
    dwLowDateTime: number
    dwHighDateTime: number
}

/** @internal */
export const cFILETIME = koffi.struct({
    dwLowDateTime: cDWORD,
    dwHighDateTime: cDWORD
})

/**
 * Specifies a date and time, using individual members for the month, day, year, weekday, hour, minute, second, and millisecond.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-systemtime
 */
export interface SYSTEMTIME {
    wYear:         number
    wMonth:        number
    wDayOfWeek:    number
    wDay:          number
    wHour:         number
    wMinute:       number
    wSecond:       number
    wMilliseconds: number
}

/** @internal */
export const cSYSTEMTIME = koffi.struct({
    wYear:         cDWORD,
    wMonth:        cDWORD,
    wDayOfWeek:    cDWORD,
    wDay:          cDWORD,
    wHour:         cDWORD,
    wMinute:       cDWORD,
    wSecond:       cDWORD,
    wMilliseconds: cDWORD
})

/**
 * The GUID structure stores a GUID.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/guiddef/ns-guiddef-guid
 */
export interface GUID {
    Data1: number
    Data2: number
    Data3: number
    Data4: [ number, number, number, number, number, number, number, number ]
}

/** @internal */
export const cGUID = koffi.struct({
    Data1: koffi.types.uint32,
    Data2: koffi.types.uint16,
    Data3: koffi.types.uint16,
    Data4: koffi.array(koffi.types.uint8, 8, 'Array')
})

/**
 * The UUID structure is a typedef'd synonym for the GUID structure.
 */
export type UUID = GUID

/** @internal */
export const cUUID = koffi.alias('UUID', cGUID)

/**
 * The LUID structure is an opaque structure that specifies an identifier that is guaranteed to be unique on the local machine.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid
 */
export interface LUID {
    LowPart: number
    HighPart: number
}

/** @internal */
export const cLUID = koffi.struct({
    LowPart: cDWORD,
    HighPart: cLONG
})

/**
 * The LUID_AND_ATTRIBUTES structure represents a locally unique identifier (LUID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid_and_attributes
 */
export interface LUID_AND_ATTRIBUTES {
    Luid: LUID
    Attributes: number
}

/** @internal */
export const cLUID_AND_ATTRIBUTES = koffi.struct({
    Luid: cLUID,
    Attributes: cDWORD
})

/**
 * Used by various Local Security Authority (LSA) functions to specify a Unicode string.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_unicode_string
 */
export class LSA_UNICODE_STRING {
    /** The length, in bytes, of the string pointed to by the Buffer member, not including the terminating null character, if any. */
    readonly Length: number
    /** The total size, in bytes, of the memory allocated for Buffer. Up to MaximumLength bytes can be written into the buffer without trampling memory. */
    readonly MaximumLength: number
    readonly Buffer: Uint16Array

    constructor(string: string)
    constructor(length: number)
    constructor(strOrLen: string | number) {
        this.Buffer = typeof strOrLen === 'string'
            ? Uint16Array.from(strOrLen, c => c.charCodeAt(0))
            : new Uint16Array(strOrLen)
        this.Length = this.MaximumLength = this.Buffer.byteLength
    }
}

/** @internal */
export const cLSA_UNICODE_STRING = koffi.struct({
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cSTR
})

/**
 * Used with the LsaOpenPolicy function to specify the attributes of the connection to the Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_object_attributes
 */
export class LSA_OBJECT_ATTRIBUTES {
    readonly Length = SIZEOF_LSA_OBJECT_ATTRIBUTES
    constructor(
        public RootDirectory:            HANDLE              = null!,
        public ObjectName:               LSA_UNICODE_STRING  = null!,
        public Attributes:               number              = 0,
        public SecurityDescriptor:       SECURITY_DESCRIPTOR = null!,
        public SecurityQualityOfService: unknown             = null,     // TODO: SECURITY_QUALITY_OF_SERVICE
    ) {}
}

/** @internal */
export const cLSA_OBJECT_ATTRIBUTES = koffi.struct({
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})

export const SIZEOF_LSA_OBJECT_ATTRIBUTES = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)

/**
 * Contains information used by ShellExecuteEx().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-shellexecuteinfow
 */
export class SHELLEXECUTEINFO {
    readonly cbSize = SIZEOF_SHELLEXECUTEINFO
    readonly hInstApp: SE_ERR_ = 0 as SE_ERR_   // [out]
    readonly hProcess: HANDLE | null = null     // [out]
    constructor(
        public lpVerb:       string    = null!,
        public fMask:        SEE_MASK_ = 0,
        public lpFile:       string    = null!,
        public lpParameters: string    = null!,
        public lpDirectory:  string    = null!,
        public hwnd:         HWND      = null!,
        public nShow:        SW_       = 0,
        public lpClass:      string    = null!,
        public hkeyClass:    HKEY      = null!,
        public dwHotKey:     number    = 0,
        public lpIDList:     any       = null,
        public hMonitor:     HMONITOR  = null!,
    ) {}
}

/** @internal */
export const cSHELLEXECUTEINFO = koffi.struct({
    cbSize:       cDWORD,
    fMask:        cULONG,
    hwnd:         cHANDLE,
    lpVerb:       cSTR,
    lpFile:       cSTR,
    lpParameters: cSTR,
    lpDirectory:  cSTR,
    nShow:        cINT,
    hInstApp:     cINT,
    lpIDList:     cPVOID,
    lpClass:      cSTR,
    hkeyClass:    cHANDLE,
    dwHotKey:     cDWORD,
    hMonitor:     cHANDLE,  // Should be a union, but the other member hIcon is unused since Windows Vista.
    hProcess:     cHANDLE
})

export const SIZEOF_SHELLEXECUTEINFO = koffi.sizeof(cSHELLEXECUTEINFO)

/**
 * The SID_IDENTIFIER_AUTHORITY structure represents the top-level authority of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_identifier_authority
 */
export type SID_IDENTIFIER_AUTHORITY = [ number, number, number, number, number, number ]

/** @internal */
export const cSID_IDENTIFIER_AUTHORITY = koffi.array(cBYTE, 6, 'Array')

/**
 * The security identifier (SID) structure is a variable-length structure used to uniquely identify users or groups.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid
 */
export class SID {
    readonly Revision = Internals.SID_REVISION
    public SubAuthorityCount: number
    public SubAuthority: number[]
    constructor(
        public IdentifierAuthority: SID_IDENTIFIER_AUTHORITY,
        ...SubAuthority:        number[]
    ) {
        this.SubAuthorityCount = SubAuthority.length
        this.SubAuthority = SubAuthority.slice()
    }
}

/** @internal */
export const cSID = koffi.struct({
    Revision:            cBYTE,
    SubAuthorityCount:   cBYTE,
    IdentifierAuthority: cSID_IDENTIFIER_AUTHORITY,
    SubAuthority:        koffi.array(cDWORD, Internals.SID_MAX_SUB_AUTHORITIES, 'Array')   // DWORD SubAuthority[]
})

export const SID_REVISION = Internals.SID_REVISION

/**
 * The SID_AND_ATTRIBUTES structure represents a security identifier (SID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes
 */
export interface SID_AND_ATTRIBUTES {
    Sid: SID
    Attributes: number
}

/** @internal */
export const cSID_AND_ATTRIBUTES = koffi.struct({
    Sid: koffi.pointer(cSID),
    Attributes: cDWORD
})

/**
 * The SID_AND_ATTRIBUTES_HASH structure specifies a hash values for the specified array of security identifiers (SIDs).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes_hash
 */
export interface SID_AND_ATTRIBUTES_HASH {
    SidCount: number
    SidAttr:  SID_AND_ATTRIBUTES[]
    Hash:     BigInt[]
}

/** @internal */
export const cSID_AND_ATTRIBUTES_HASH = koffi.struct({
    SidCount: cDWORD,
    SidAttr:  koffi.pointer(cSID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY),
    Hash:     koffi.array(cULONG_PTR, Internals.SID_HASH_SIZE)
})

/**
 * The POINT structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-point
 */
export interface POINT {
    x: number
    y: number
}

/** @internal */
export const cPOINT = koffi.struct({
    x: cLONG,
    y: cLONG
})

/**
 * The POINTS structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-points
 */
export interface POINTS {
    x: number
    y: number
}

/** @internal */
export const cPOINTS = koffi.struct({
    x: cSHORT,
    y: cSHORT
})

/**
 * The RECT structure defines a rectangle by the coordinates of its upper-left and lower-right corners.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-rect
 */
export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

/** @internal */
export const cRECT = koffi.struct({
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

/**
 * The SIZE structure defines the width and height of a rectangle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-size
 */
export interface SIZE {
    x: number
    y: number
}

/** @internal */
export const cSIZE = koffi.struct({
    cx: cLONG,
    yy: cLONG
})

/**
 * Contains information about a window's maximized size and position and its minimum and maximum tracking size.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-minmaxinfo
 */
export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

/** @internal */
export const cMINMAXINFO = koffi.struct({
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

/**
 * Contains message information from a thread's message queue.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-msg
 */
export interface MSG {
    HWND:     HWND
    message:  number
    wParam:   WPARAM
    lParam:   LPARAM
    time:     number
    pt:       POINT
    lPrivate: number
}

/** @internal */
export const cMSG = koffi.struct({
    HWND:     cHANDLE,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

/**
 * An application-defined function that processes messages sent to a window.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nc-winuser-wndproc
 */
export type WNDPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => LRESULT

/** @internal */
export const cWNDPROC = koffi.pointer(koffi.proto('WND', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

/**
 * An application-defined callback function used with the EnumWindows or EnumDesktopWindows function.
 *
 * https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms633498(v=vs.85)
 */
export type WNDENUMPROC = (hWnd: HWND, lParam: LPARAM) => number

/** @internal */
export const cWNDENUMPROC = koffi.pointer(koffi.proto('WNDENUM', cBOOL, [ cHANDLE, cLPARAM ]))

/**
 * Application-defined callback function used with the CreateDialog and DialogBox families of functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/nc-winuser-dlgproc
 */
export type DLGPROC = (hWnd: HWND, msg: number, wParam: WPARAM, lParam: LPARAM) => number | BigInt

/** @internal */
export const cDLGPROC = koffi.pointer(koffi.proto('DLG', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS {
    constructor(
        public hInstance:     HINSTANCE | null = null,
        public lpszClassName: string = '',
        public style:         CS_ = 0,
        public lpfnWndProc:   WNDPROC | null = null,
        public hCursor:       HCURSOR | null = null,
        public hIcon:         HICON   | null = null,
        public hbrBackground: HBRUSH  | null = null,
        public lpszMenuName:  string  | null = null,
        public cbClsExtra:    number = 0,
        public cwWndExtra:    number = 0
    ) {}
}

/** @internal */
export const cWNDCLASS = koffi.struct({
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cSTR,
    lpszClassName: cSTR
})

/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX {
    readonly cbSize = SIZEOF_WNDCLASSEX
    constructor(
        public hInstance:     HINSTANCE | null = null,
        public lpszClassName: string = '',
        public style:         CS_ = 0,
        public lpfnWndProc:   WNDPROC | null = null,
        public hCursor:       HCURSOR | null = null,
        public hIcon:         HICON   | null = null,
        public hIconSm:       HICON   | null = null,
        public hbrBackground: HBRUSH  | null = null,
        public lpszMenuName:  string  | null = null,
        public cbClsExtra:    number = 0,
        public cwWndExtra:    number = 0
    ) {}
}

/** @internal */
export const cWNDCLASSEX = koffi.struct({
    cbSize:        cUINT,
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cSTR,
    lpszClassName: cSTR,
    hIconSm:       cHANDLE
})

export const SIZEOF_WNDCLASSEX = koffi.sizeof(cWNDCLASSEX)

/**
 * Contains information about a window that denied a request from `BroadcastSystemMessageEx`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-bsminfo
 */
export class BSMINFO {
    readonly cbSize = SIZEOF_BSMINFO
    constructor(
        public hDesk: HDESK | null = null,
        public hWnd:  HWND | null = null,
        public luid:  LUID | null = null
    ) {}
}

/** @internal */
export const cBSMINFO = koffi.struct({
    cbSize: cUINT,
    hdesk:  cHANDLE,
    hwnd:   cHANDLE,
    luid:   cLUID
})

export const SIZEOF_BSMINFO = koffi.sizeof(cBSMINFO)

/**
 * Contains information that the system needs to display notifications in the notification area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-notifyicondataw
 */
export class NOTIFYICONDATA {
    readonly cbSize = SIZEOF_NOTIFYICONDATA
    readonly DUMMYUNIONNAME = new koffi.Union('NOTIFYICONDATA_DUMMYUNIONNAME') as {
        uTimeout?: number
        uVersion?: number
    }
    constructor(
        public hWnd:             HWND   = null!,
        public uID:              number = 0,
        public uFlags:           NIF_   = 0 as NIF_,
        public uCallbackMessage: number = 0,
        public hIcon:            HICON  = null!,
        public szTip:            string = null!,
        public dwState:          number = 0,
        public dwStateMask:      number = 0,
        public szInfo:           string = null!,
        public szInfoTitle:      string = null!,
        public dwInfoFlags:      number = 0,
        public guidItem:         GUID   = null!,
        public hBalloonIcon:     HICON  = null!,
               uTimeout?:        number,
               uVersion?:        number
    ) {
        if (typeof uTimeout === 'number')
            this.DUMMYUNIONNAME.uTimeout = uTimeout
        else if (typeof uVersion === 'number')
            this.DUMMYUNIONNAME.uVersion = uVersion
    }
}

/** @internal */
export const cNOTIFYICONDATA = koffi.struct({
    cbSize:           cDWORD,
    hWnd:             cHANDLE,
    uID:              cUINT,
    uFlags:           cUINT,
    uCallbackMessage: cUINT,
    hIcon:            cHANDLE,
    szTip:            koffi.array(koffi.types.char16, 128, 'String'),
    dwState:          cDWORD,
    dwStateMask:      cDWORD,
    szInfo:           koffi.array(koffi.types.char16, 256, 'String'),
    DUMMYUNIONNAME:   koffi.union('NOTIFYICONDATA_DUMMYUNIONNAME', {
        uTimeout: cUINT,
        uVersion: cUINT
    }),
    szInfoTitle:      koffi.array(koffi.types.char16, 64, 'String'),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,
    hBalloonIcon:     cHANDLE
})

export const SIZEOF_NOTIFYICONDATA = koffi.sizeof(cNOTIFYICONDATA)

/**
 * The TOKEN_APPCONTAINER_INFORMATION structure specifies all the information in a token that is necessary for an app container.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_appcontainer_information
 */
export interface TOKEN_APPCONTAINER_INFORMATION {
    TokenAppContainer: SID
}

/** @internal */
export const cTOKEN_APPCONTAINER_INFORMATION = koffi.struct({
    TokenAppContainer: koffi.pointer(cSID)
})

/**
 * The TOKEN_DEFAULT_DACL structure specifies a discretionary access control list (DACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_default_dacl
 */
export interface TOKEN_DEFAULT_DACL {
    DefaultDacl: ACL | null
}

/** @internal */
export const cTOKEN_DEFAULT_DACL = koffi.struct({
    DefaultDacl: koffi.pointer(cACL)
})

/**
 * The TOKEN_ELEVATION structure indicates whether a token has elevated privileges.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_elevation
 */
export interface TOKEN_ELEVATION {
    TokenIsElevated: number
}

/** @internal */
export const cTOKEN_ELEVATION = koffi.struct({
    TokenIsElevated: cDWORD
})

/**
 * The TOKEN_GROUPS structure contains information about the group security identifiers (SIDs) in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_groups
 */
export interface TOKEN_GROUPS {
    GroupCount: number
    Groups: SID_AND_ATTRIBUTES[]
}

/** @internal */
export const cTOKEN_GROUPS = koffi.struct({
    GroupCount: cDWORD,
    Groups: koffi.array(cSID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY)
})

/**
 * The TOKEN_GROUPS_AND_PRIVILEGES structure contains information about the group security identifiers (SIDs) and privileges in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_groups_and_privileges
 */
export interface TOKEN_GROUPS_AND_PRIVILEGES {
    SidCount:            number,
    SidLength:           number,
    Sids:                SID_AND_ATTRIBUTES[],
    RestrictedSidCount:  number,
    RestrictedSidLength: number,
    RestrictedSids:      SID_AND_ATTRIBUTES[],
    PrivilegeCount:      number,
    PrivilegeLength:     number,
    Privileges:          LUID_AND_ATTRIBUTES[],
    AuthenticationId:    LUID,
}

/** @internal */
export const cTOKEN_GROUPS_AND_PRIVILEGES = koffi.struct({
    SidCount:            cDWORD,
    SidLength:           cDWORD,
    Sids:                koffi.pointer(cSID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY),
    RestrictedSidCount:  cDWORD,
    RestrictedSidLength: cDWORD,
    RestrictedSids:      koffi.pointer(cSID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY),
    PrivilegeCount:      cDWORD,
    PrivilegeLength:     cDWORD,
    Privileges:          koffi.pointer(cLUID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY),
    AuthenticationId:    cLUID,
})

/**
 * The TOKEN_LINKED_TOKEN structure contains a handle to a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_linked_token
 */
export interface TOKEN_LINKED_TOKEN {
    LinkedToken: HTOKEN
}

/** @internal */
export const cTOKEN_LINKED_TOKEN = koffi.struct({
    LinkedToken: cHANDLE
})

/**
 * The TOKEN_MANDATORY_LABEL structure specifies the mandatory integrity level for a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_mandatory_label
 */
export interface TOKEN_MANDATORY_LABEL {
    Label: SID_AND_ATTRIBUTES
}

/** @internal */
export const cTOKEN_MANDATORY_LABEL = koffi.struct({
    Label: cSID_AND_ATTRIBUTES
})

/**
 * The TOKEN_MANDATORY_POLICY structure specifies the mandatory integrity policy for a token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_mandatory_policy
 */
export interface TOKEN_MANDATORY_POLICY {
    Policy: number
}

/** @internal */
export const cTOKEN_MANDATORY_POLICY = koffi.struct({
    Policy: cDWORD
})

/**
 * The TOKEN_ORIGIN structure contains information about the origin of the logon session.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_origin
 */
export interface TOKEN_ORIGIN {
    OriginatingLogonSession: LUID
}

/** @internal */
export const cTOKEN_ORIGIN = koffi.struct({
    OriginatingLogonSession: cLUID
})

/**
 * The TOKEN_OWNER structure contains the default owner security identifier (SID) that will be applied to newly created objects.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_owner
 */
export interface TOKEN_OWNER {
    Owner: SID
}

/** @internal */
export const cTOKEN_OWNER = koffi.struct({
    Owner: koffi.pointer(cSID)
})

/**
 * The TOKEN_PRIMARY_GROUP structure specifies a group security identifier (SID) for an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_primary_group
 */
export interface TOKEN_PRIMARY_GROUP {
    PrimaryGroup: SID
}

/** @internal */
export const cTOKEN_PRIMARY_GROUP = koffi.struct({
    PrimaryGroup: koffi.pointer(cSID)
})

/**
 * The TOKEN_PRIVILEGES structure contains information about a set of privileges for an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_privileges
 */
export interface TOKEN_PRIVILEGES {
    PrivilegeCount: number
    Privileges: LUID_AND_ATTRIBUTES[]
}

/** @internal */
export const cTOKEN_PRIVILEGES = koffi.struct({
    PrivilegeCount: cDWORD,
    Privileges: koffi.array(cLUID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY)
})

/**
 * The TOKEN_SOURCE structure identifies the source of an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_source
 */
export interface TOKEN_SOURCE {
    SourceName: string
    SourceIdentifier: LUID
}

/** @internal */
export const cTOKEN_SOURCE = koffi.struct({
    SourceName: koffi.array(cCHAR, Internals.TOKEN_SOURCE_LENGTH, 'String'),
    SourceIdentifier: cLUID
})

export const TOKEN_SOURCE_LENGTH = Internals.TOKEN_SOURCE_LENGTH

/**
 * The TOKEN_STATISTICS structure contains information about an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_statistics
 */
export interface TOKEN_STATISTICS {
    TokenId:            LUID
    AuthenticationId:   LUID
    ExpirationTime:     BigInt
    TokenType:          TOKEN_TYPE_
    ImpersonationLevel: SECURITY_IMPERSONATION_LEVEL
    DynamicCharged:     number
    DynamicAvailable:   number
    GroupCount:         number
    PrivilegeCount:     number
    ModifiedId:         LUID
}

/** @internal */
export const cTOKEN_STATISTICS = koffi.struct({
  TokenId:            cLUID,
  AuthenticationId:   cLUID,
  ExpirationTime:     cLONGLONG,
  TokenType:          cLONG,
  ImpersonationLevel: cLONG,
  DynamicCharged:     cDWORD,
  DynamicAvailable:   cDWORD,
  GroupCount:         cDWORD,
  PrivilegeCount:     cDWORD,
  ModifiedId:         cLUID,
})

/**
 * The TOKEN_USER structure identifies the user associated with an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_user
 */
export interface TOKEN_USER {
    User: SID_AND_ATTRIBUTES
}

/** @internal */
export const cTOKEN_USER = koffi.struct({
    User: cSID_AND_ATTRIBUTES
})

/**
 * The TOKEN_ACCESS_INFORMATION structure specifies all the information in a token that is necessary to perform an access check.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_access_information
 */
export interface TOKEN_ACCESS_INFORMATION {
    SidHash:            SID_AND_ATTRIBUTES_HASH
    RestrictedSidHash:  SID_AND_ATTRIBUTES_HASH
    Privileges:         TOKEN_PRIVILEGES
    AuthenticationId:   LUID
    TokenType:          TOKEN_TYPE_
    ImpersonationLevel: SECURITY_IMPERSONATION_LEVEL
    MandatoryPolicy:    TOKEN_MANDATORY_POLICY
    Flags:              0       // Reserved, must be 0
    AppContainerNumber: number
    PackageSid:         SID | null
    CapabilitiesHash:   SID_AND_ATTRIBUTES_HASH
    TrustLevelSid:      SID | null
    SecurityAttributes: null    // Reserved, must be null
}

/** @internal */
export const cTOKEN_ACCESS_INFORMATION = koffi.struct({
    SidHash:            koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    RestrictedSidHash:  koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    Privileges:         koffi.pointer(cTOKEN_PRIVILEGES),
    AuthenticationId:   cLUID,
    TokenType:          cDWORD,
    ImpersonationLevel: cDWORD,
    MandatoryPolicy:    cTOKEN_MANDATORY_POLICY,
    Flags:              cDWORD,
    AppContainerNumber: cDWORD,
    PackageSid:         koffi.pointer(cSID),
    CapabilitiesHash:   koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    TrustLevelSid:      koffi.pointer(cSID),
    SecurityAttributes: cPVOID,
})

/**
 * Privilege Set - This is defined for a privilege set of one.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-privilege_set
 */
export interface PRIVILEGE_SET {
    PrivilegeCount: number
    Control:        number
    Privilege:      LUID_AND_ATTRIBUTES[]
}

/** @internal */
export const cPRIVILEGE_SET = koffi.struct({
    PrivilegeCount: cDWORD,
    Control:        cDWORD,
    Privilege:      koffi.array(cLUID_AND_ATTRIBUTES, Internals.ANYSIZE_ARRAY)
})

/**
 * Contains extended memory statistics for a process. Extends PROCESS_MEMORY_COUNTERS_EX and PROCESS_MEMORY_COUNTERS.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/psapi/ns-psapi-process_memory_counters_ex2
 */
export class PROCESS_MEMORY_COUNTERS_EX2 {
    readonly cb = SIZEOF_PROCESS_MEMORY_COUNTERS_EX2
    constructor(
        public PageFaultCount:             number          = 0,
        public PeakWorkingSetSize:         number | BigInt = 0,
        public WorkingSetSize:             number | BigInt = 0,
        public QuotaPeakPagedPoolUsage:    number | BigInt = 0,
        public QuotaPagedPoolUsage:        number | BigInt = 0,
        public QuotaPeakNonPagedPoolUsage: number | BigInt = 0,
        public QuotaNonPagedPoolUsage:     number | BigInt = 0,
        public PagefileUsage:              number | BigInt = 0,
        public PeakPagefileUsage:          number | BigInt = 0,
        public PrivateUsage:               number | BigInt = 0,
        public PrivateWorkingSetSize:      number | BigInt = 0,
        public SharedCommitUsage:          number | BigInt = 0
    ) {}
}

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

export const SIZEOF_PROCESS_MEMORY_COUNTERS_EX2 = koffi.sizeof(cPROCESS_MEMORY_COUNTERS_EX2)

/**
 * The SECURITY_DESCRIPTOR structure contains the security information associated with an object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-security_descriptor
 */
export interface SECURITY_DESCRIPTOR {
    Revision: number
    Sbsz1:    number
    Control:  SECURITY_DESCRIPTOR_CONTROL_
    Owner:    SID
    Group:    SID
    Sacl:     ACL
    Dacl:     ACL
}

/** @internal */
export const cSECURITY_DESCRIPTOR = koffi.struct({
    Revision: cBYTE,
    Sbsz1:    cBYTE,
    Control:  cWORD,
    Owner:    koffi.pointer(cSID),
    Group:    koffi.pointer(cSID),
    Sacl:     koffi.pointer(cACL),
    Dacl:     koffi.pointer(cACL)
})

/**
 * The SECURITY_ATTRIBUTES structure contains the security descriptor for an object and specifies whether the handle retrieved by specifying this structure is inheritable.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/wtypesbase/ns-wtypesbase-security_attributes
 */
export class SECURITY_ATTRIBUTES {
    readonly nLength = SIZEOF_SECURITY_ATTRIBUTES
    constructor(
        public lpSecurityDescriptor: SECURITY_DESCRIPTOR | null = null,
        public bInheritHandle:       number                     = 0,
    ) {}
}

/** @internal */
export const cSECURITY_ATTRIBUTES = koffi.struct({
    nLength:              cDWORD,
    lpSecurityDescriptor: koffi.pointer(cSECURITY_DESCRIPTOR),
    bInheritHandle:       cBOOL
})

export const SIZEOF_SECURITY_ATTRIBUTES = koffi.sizeof(cSECURITY_ATTRIBUTES)

/**
 * Contains information about a registry value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/ns-winreg-valentw
 */
export interface VALENT {
    ve_valuename: string
    ve_valuelen:  number
    ve_valueptr:  any
    ve_type:      REG_
}

/** @internal */
export const cVALENT = koffi.struct({
    ve_valuename: cSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cPVOID,
    ve_type:      cDWORD
})
