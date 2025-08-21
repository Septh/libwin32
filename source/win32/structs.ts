import assert from 'node:assert'
import koffi from 'koffi-cream'
import { Internals } from './private.js'
import {
    cBOOL, cINT, cUINT, cCHAR, cBYTE, cSHORT, cUSHORT, cWORD,
    cLONG, cULONG, cDWORD, cLONGLONG, cULONG_PTR, cLONG64, cULONG64, cDWORD64, cPVOID, cSTR, cSIZE_T,
    cHANDLE, type HANDLE, type HINSTANCE, type HTOKEN, type HICON, type HCURSOR, type HBRUSH, type HDESK, type HWND, type HKEY, type HMONITOR,
    cWPARAM, type WPARAM, cLPARAM, type LPARAM,
    cLRESULT, type LRESULT
} from './ctypes.js'
import type {
    CS_, NIF_, TOKEN_TYPE,
    CLAIM_SECURITY_ATTRIBUTE_, CLAIM_SECURITY_ATTRIBUTE_TYPE_,
    SECURITY_IMPERSONATION_LEVEL, SECURITY_DESCRIPTOR_CONTROL_,
    REG_, SEE_MASK_, SW_,
    SE_ERR_,
    SID_NAME_USE,
    POLICY_AUDIT_EVENT_,
    POLICY_LSA_SERVER_ROLE
} from './consts.js'

/**
 * The ACL structure is the header of an access control list (ACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-acl
 */
export class ACL {
    readonly AclRevision = Internals.ACL_REVISION
    public AceCount!: number
    public AclSize!:  number
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
    public SubAuthorityCount!: number
    public SubAuthority!: number[]
    public IdentifierAuthority!: SID_IDENTIFIER_AUTHORITY
}

/** @internal */
export const cSID = koffi.struct({
    Revision:            cBYTE,
    SubAuthorityCount:   cBYTE,
    IdentifierAuthority: cSID_IDENTIFIER_AUTHORITY,
    SubAuthority:        koffi.array(cDWORD, 'SubAuthorityCount', Internals.SID_MAX_SUB_AUTHORITIES, 'Array')
}), cPSID = koffi.pointer(cSID)

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
    Sid: cPSID,
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
    SidAttr:  koffi.pointer(null, cSID_AND_ATTRIBUTES, 'SidCount'),
    Hash:     koffi.array(cULONG_PTR, Internals.SID_HASH_SIZE)
})

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
    public Name!: string
    public ValueType!: CLAIM_SECURITY_ATTRIBUTE_TYPE_
    public Flags!: CLAIM_SECURITY_ATTRIBUTE_
    public ValueCount!: number
    public Values = new koffi.Union('CSA_V1_Values') as {
        pInt64?:       BigInt[]
        pUint64?:      BigInt[]
        ppString?:     string[]
        pFqbn?:        CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE[]
        pOctetString?: CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE[]
    }
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct({
    Name:       cSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     koffi.union('CSA_V1_Values', {
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
    Attribute:      koffi.struct({  // Should be a union, but since there is only one member...
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
    readonly Length: number         // in bytes
    readonly MaximumLength: number  // in bytes
    readonly Buffer: Uint16Array

    constructor(maxBytes: number)
    constructor(string: string, maxBytes?: number)
    constructor(strOrLen: string | number, maxBytes?: number) {

        if (typeof strOrLen === 'string') {
            this.Length = strOrLen.length * 2
            this.MaximumLength = maxBytes ?? this.Length
            assert(this.Length <= this.MaximumLength)

            this.Buffer = new Uint16Array(this.MaximumLength / Uint16Array.BYTES_PER_ELEMENT)
            for (let i = 0; i < strOrLen.length; i++)
                this.Buffer[i] = strOrLen.charCodeAt(i)
        }
        else {
            this.Length = this.MaximumLength = strOrLen
            this.Buffer = new Uint16Array(this.MaximumLength / Uint16Array.BYTES_PER_ELEMENT)
        }
    }
}

/** @internal */
export const cLSA_UNICODE_STRING = koffi.struct({
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cSTR
})

/**
 * Contains SIDs that are retrieved based on account names.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_translated_sid2
 */
export interface LSA_TRANSLATED_SID2 {
    Use: SID_NAME_USE
    Sid: SID,
    DomainIndex: number
    Flags: number
}

/** @internal */
export const cLSA_TRANSLATED_SID2 = koffi.struct({
    Use: cINT,
    Sid: cPSID,
    DomainIndex: cLONG,
    Flags: cULONG
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
 * Identifies a domain.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_trust_information
 */
export interface LSA_TRUST_INFORMATION {
    Name: LSA_UNICODE_STRING
    Sid: SID
}

export type TRUSTED_DOMAIN_INFORMATION_BASIC = LSA_TRUST_INFORMATION

/** @internal */
export const cLSA_TRUST_INFORMATION = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})

/**
 *  Contains information about the domains referenced in a lookup operation.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-lsa_referenced_domain_list
 */
export interface LSA_REFERENCED_DOMAIN_LIST {
    Entries: number
    Domains: LSA_TRUST_INFORMATION[]
}

/** @internal */
export const cLSA_REFERENCED_DOMAIN_LIST = koffi.struct({
    Entries: cULONG,
    Domains: koffi.pointer(null, cLSA_TRUST_INFORMATION, 'Entries')
})

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
export interface WNDCLASS {
    hInstance:     HINSTANCE | null
    lpszClassName: string | null
    style:         CS_
    lpfnWndProc:   WNDPROC | null
    hCursor:       HCURSOR | null
    hIcon:         HICON   | null
    hbrBackground: HBRUSH  | null
    lpszMenuName:  string  | null
    cbClsExtra:    number
    cwWndExtra:    number
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
        public lpszClassName: string  | null   = null,
        public style:         CS_              = 0,
        public lpfnWndProc:   WNDPROC | null   = null,
        public hCursor:       HCURSOR | null   = null,
        public hIcon:         HICON   | null   = null,
        public hIconSm:       HICON   | null   = null,
        public hbrBackground: HBRUSH  | null   = null,
        public lpszMenuName:  string  | null   = null,
        public cbClsExtra:    number           = 0,
        public cwWndExtra:    number           = 0
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
    public hDesk: HDESK | null = null
    public hWnd:  HWND | null = null
    public luid:  LUID | null = null
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
    TokenAppContainer: SID | null
}

/** @internal */
export const cTOKEN_APPCONTAINER_INFORMATION = koffi.struct({
    TokenAppContainer: cPSID
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
    Groups: koffi.array(cSID_AND_ATTRIBUTES, 'GroupCount', Internals.TOKEN_GROUPS_MAX_GROUPS)
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
    Sids:                koffi.pointer(null, cSID_AND_ATTRIBUTES, 'SidCount'),
    RestrictedSidCount:  cDWORD,
    RestrictedSidLength: cDWORD,
    RestrictedSids:      koffi.pointer(null, cSID_AND_ATTRIBUTES, 'RestrictedSidCount'),
    PrivilegeCount:      cDWORD,
    PrivilegeLength:     cDWORD,
    Privileges:          koffi.pointer(null, cLUID_AND_ATTRIBUTES, 'PrivilegeCount'),
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
    Owner: cPSID
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
    PrimaryGroup: cPSID
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
    Privileges: koffi.array(cLUID_AND_ATTRIBUTES, 'PrivilegeCount', Internals.TOKEN_PRIVILEGES_MAX_PRIVILEGES)
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
    TokenType:          TOKEN_TYPE
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
    TokenType:          TOKEN_TYPE
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
    PackageSid:         cPSID,
    CapabilitiesHash:   koffi.pointer(cSID_AND_ATTRIBUTES_HASH),
    TrustLevelSid:      cPSID,
    SecurityAttributes: cPVOID,
})

/**
 * Used to set and query the name and SID of the system's account domain.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-policy_account_domain_info
 */
export interface POLICY_ACCOUNT_DOMAIN_INFO {
    DomainName: LSA_UNICODE_STRING
    DomainSid: SID
}

/** @internal */
export const cPOLICY_ACCOUNT_DOMAIN_INFO = koffi.struct({
    DomainName: cLSA_UNICODE_STRING,
    DomainSid: cPSID
})

/**
 * Used to set and query the system's auditing rules.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_audit_events_info
 */
export interface POLICY_AUDIT_EVENTS_INFO {
    AuditingMode: boolean
    EventAuditingOptions: POLICY_AUDIT_EVENT_[]
    MaximumAuditEventCount: number
}

/** @internal */
export const cPOLICY_AUDIT_EVENTS_INFO = koffi.struct({
    AuditingMode: cBOOL,
    EventAuditingOptions: koffi.pointer(null, cULONG, 'MaximumAuditEventCount'),
    MaximumAuditEventCount: cULONG
})

/**
 * Used to set and query the role of an LSA server.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_lsa_server_role_info
 */
export interface POLICY_LSA_SERVER_ROLE_INFO {
    LsaServerRole: POLICY_LSA_SERVER_ROLE
}

/** @internal */
export const cPOLICY_LSA_SERVER_ROLE_INFO = koffi.struct({
    LsaServerRole: cINT
})

/**
 * Used to query information about the creation time and last modification of the LSA database.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/ns-ntsecapi-policy_modification_info
 */
export interface POLICY_MODIFICATION_INFO {
    ModifiedId: number | BigInt
    DatabaseCreationTime: number | BigInt
}

/** @internal */
export const cPOLICY_MODIFICATION_INFO = koffi.struct({
    ModifiedId: cLONGLONG,
    DatabaseCreationTime: cLONGLONG
})

/**
 * The `PolicyPrimaryDomainInformation` value and `POLICY_PRIMARY_DOMAIN_INFO` structure are obsolete,
 * use `PolicyDnsDomainInformation` and the {@link POLICY_DNS_DOMAIN_INFO} structure instead.
 */
export interface POLICY_PRIMARY_DOMAIN_INFO {
    Name: LSA_UNICODE_STRING
    Sid: SID
}

/** @internal */
export const cPOLICY_PRIMARY_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})

/**
 * Used to set and query Domain Name System (DNS) information about the primary domain associated with a Policy object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/lsalookup/ns-lsalookup-policy_dns_domain_info
 */
export interface POLICY_DNS_DOMAIN_INFO {
    Name: LSA_UNICODE_STRING
    DnsDomainName: LSA_UNICODE_STRING
    DnsForestName: LSA_UNICODE_STRING
    DomainGuid: GUID
    Sid: SID
}

/** @internal */
export const cPOLICY_DNS_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    DnsDomainName: cLSA_UNICODE_STRING,
    DnsForestName: cLSA_UNICODE_STRING,
    DomainGuid: cGUID,
    Sid: cPSID
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
    Privilege:      koffi.array(cLUID_AND_ATTRIBUTES, 'PrivilegeCount', Internals.TOKEN_PRIVILEGES_SET_MAX_PRIVILEGES)
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
    Owner:    cPSID,
    Group:    cPSID,
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
