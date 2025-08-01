import { koffi, Internals } from './private.js'
import {
    cBOOL, cINT, cUINT, cCHAR, cBYTE, cSHORT, cUSHORT, cWORD,
    cLONG, cULONG, cDWORD, cLONGLONG, cULONG_PTR, cLONG64, cDWORD64, cPVOID, cSTR,
    cHANDLE, type HANDLE, type HINSTANCE, type HICON, type HCURSOR, type HBRUSH, type HDESK, type HWND, type HTOKEN,
    cWNDPROC, type WNDPROC, cWPARAM, type WPARAM, cLPARAM, type LPARAM,
    type CUnion,
} from './ctypes.js'
import type {
    CS_, NIF_, TOKEN_TYPE_,
    CLAIM_SECURITY_ATTRIBUTE_, CLAIM_SECURITY_ATTRIBUTE_TYPE_,
    SECURITY_IMPERSONATION_LEVEL, SECURITY_DESCRIPTOR_CONTROL_,
    REG_
} from './consts.js'

/**
 * The ACL structure is the header of an access control list (ACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-acl
 */
export class ACL {
    readonly AclRevision = Internals.ACL_REVISION
    declare Sbsz1:    number
    declare AclSize:  number
    declare AceCount: number
    declare Sbsz2:    number
}

/** @internal */
export const cACL = koffi.struct('ACL', {
    AclRevision: cBYTE,
    Sbsz1:       cBYTE,
    AclSize:     cWORD,
    AceCount:    cWORD,
    Sbsz2:       cWORD
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
export const cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE', {
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
export const cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE', {
    pValue:      cPVOID,
    ValueLength: cDWORD
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_V1 structure defines a security attribute that can be associated with a token or authorization context.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attribute_v1
 */
export type CLAIM_SECURITY_ATTRIBUTE_V1 = {
    Name:       string
    ValueType:  CLAIM_SECURITY_ATTRIBUTE_TYPE_
    Reserved:   0
    Flags:      CLAIM_SECURITY_ATTRIBUTE_
    ValueCount: number
    /** `Values` is union, only one member is present at a time, based on ValueType. */
    Values: CUnion<{
        pInt64:        BigInt[]
        pUint64:       BigInt[]
        ppString:      string[]
        pFqbn:         CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE[]
        pOctectString: CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE[]
    }>
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_V1', {
    Name:       cSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     koffi.union({
        pInt64:        koffi.pointer(koffi.array(cLONG64, 1)),
        pUint64:       koffi.pointer(koffi.array(cDWORD64, 1)),
        ppString:      koffi.pointer(koffi.array(cSTR, 1)),
        pFqbn:         koffi.pointer(koffi.array(cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE, 1)),
        pOctectString: koffi.pointer(koffi.array(cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE, 1))
    })
})

/**
 * The CLAIM_SECURITY_ATTRIBUTES_INFORMATION structure defines the security attributes for the claim.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-claim_security_attributes_information
 */
export class CLAIM_SECURITY_ATTRIBUTES_INFORMATION {
    readonly Version = Internals.CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION
    readonly Reserved = 0         // Reserved, must be 0
    declare AttributeCount: number
    declare Attribute: null | {
        AttributeV1: CLAIM_SECURITY_ATTRIBUTE_V1[]
    }
}

/** @internal */
export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.struct('CLAIM_SECURITY_ATTRIBUTES_INFORMATION', {
    Version:        cWORD,
    Reserved:       cWORD,
    AttributeCount: cDWORD,
    Attribute:      cPVOID
    // Attribute: koffi.union({
    //     pAttributeV1: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_V1)
    // })
})

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
export const cFILETIME = koffi.struct('FILETIME', {
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
export const cSYSTEMTIME = koffi.struct('SYSTEMTIME', {
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
export const cGUID = koffi.struct('GUID', {
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
export const cLUID = koffi.struct('LUID', {
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
export const cLUID_AND_ATTRIBUTES = koffi.struct('LUID_AND_ATTRIBUTES', {
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
export const cLSA_UNICODE_STRING = koffi.struct('LSA_UNICODE_STRING', {
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
    readonly Length = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)
    declare RootDirectory:            HANDLE
    declare ObjectName:               LSA_UNICODE_STRING
    declare Attributes:               number
    declare SecurityDescriptor:       SECURITY_DESCRIPTOR
    declare SecurityQualityOfService: unknown       // Points to type SECURITY_QUALITY_OF_SERVICE
}

/** @internal */
export const cLSA_OBJECT_ATTRIBUTES = koffi.struct('LSA_OBJECT_ATTRIBUTES', {
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})

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
export interface SID {
    Revision:            number
    SubAuthorityCount:   number
    IdentifierAuthority: SID_IDENTIFIER_AUTHORITY
    SubAuthority:        number[]
}

/** @internal */
export const cSID = koffi.struct('SID', {
    Revision:            cBYTE,
    SubAuthorityCount:   cBYTE,
    IdentifierAuthority: cSID_IDENTIFIER_AUTHORITY,
    SubAuthority:        koffi.array(cDWORD, Internals.SID_MAX_SUB_AUTHORITIES, 'Array')   // DWORD SubAuthority[]
})

export const SID_REVISION = 1

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
export const cSID_AND_ATTRIBUTES = koffi.struct('SID_AND_ATTRIBUTES', {
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
export const cSID_AND_ATTRIBUTES_HASH = koffi.struct('SID_AND_ATTRIBUTES_HASH', {
    SidCount: cDWORD,
    SidAttr:  koffi.pointer(koffi.array(cSID_AND_ATTRIBUTES, 1)),
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
export const cPOINT = koffi.struct('POINT', {
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
export const cPOINTS = koffi.struct('POINTS', {
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
export const cRECT = koffi.struct('RECT', {
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
export const cSIZE = koffi.struct('SIZE', {
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
export const cMINMAXINFO = koffi.struct('MINMAXINFO', {
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
export const cMSG = koffi.struct('MSG', {
    HWND:     cHANDLE,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 * This structure has been superseded by the WNDCLASSEX structure used with the RegisterClassEx function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS {
    declare style:         CS_
    declare lpfnWndProc:   WNDPROC | null
    declare cbClsExtra:    number
    declare cbWndExtra:    number
    declare hInstance:     HINSTANCE | null
    declare hIcon:         HICON | null
    declare hCursor:       HCURSOR | null
    declare hbrBackground: HBRUSH | null
    declare lpszMenuName:  string | null
    declare lpszClassName: string | null
}

/** @internal */
export const cWNDCLASS = koffi.struct('WNDCLASS', {
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
    readonly cbSize = koffi.sizeof(cWNDCLASSEX)
    declare style:         CS_
    declare lpfnWndProc:   WNDPROC | null
    declare cbClsExtra:    number
    declare cbWndExtra:    number
    declare hInstance:     HINSTANCE | null
    declare hIcon:         HICON | null
    declare hIconSm:       HICON | null
    declare hCursor:       HCURSOR | null
    declare hbrBackground: HBRUSH | null
    declare lpszMenuName:  string | null
    declare lpszClassName: string | null
}

/** @internal */
export const cWNDCLASSEX = koffi.struct('WNDCLASSEX', {
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

/**
 * Contains information about a window that denied a request from `BroadcastSystemMessageEx`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-bsminfo
 */
export class BSMINFO {
    readonly cbSize = koffi.sizeof(cBSMINFO)
    declare hDesk: HDESK
    declare hWnd:  HWND
    declare luid:  LUID
}

/** @internal */
export const cBSMINFO = koffi.struct('BSMINFO', {
    cbSize: cUINT,
    hdesk:  cHANDLE,
    hwnd:   cHANDLE,
    luid:   cLUID
})

/**
 * Contains information that the system needs to display notifications in the notification area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-notifyicondataw
 */
export class NOTIFYICONDATA {
    readonly cbSize = koffi.sizeof(cNOTIFYICONDATA)
    declare hWnd:             HWND
    declare uID:              number
    declare uFlags:           NIF_
    declare uCallbackMessage: number
    declare hIcon:            HICON
    declare szTip:            string
    declare dwState:          number
    declare dwStateMask:      number
    declare szInfo:           string
    declare uTimeout?:        number          // Union with uVersion
    declare uVersion?:        number          // Union with uTimeout
    declare szInfoTitle:      string
    declare dwInfoFlags:      number
    declare guidItem:         GUID            // Changed from number to GUID
    declare hBalloonIcon:     HICON | null
}

/** @internal */
export const cNOTIFYICONDATA = koffi.struct('NOTIFYICONDATA', {
    cbSize:           cDWORD,
    hWnd:             cHANDLE,
    uID:              cUINT,
    uFlags:           cUINT,
    uCallbackMessage: cUINT,
    hIcon:            cHANDLE,
    szTip:            koffi.array(koffi.types.char16, 128, 'String'),     // Fixed size array. Koffi will automatically convert from string
    dwState:          cDWORD,
    dwStateMask:      cDWORD,
    szInfo:           koffi.array(koffi.types.char16, 256, 'String'),
    uVersion:         cUINT,    // Union field (can be uTimeout)
    szInfoTitle:      koffi.array(koffi.types.char16, 64, 'String'),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,    // Changed to GUID type
    hBalloonIcon:     cHANDLE
})

/**
 * The TOKEN_APPCONTAINER_INFORMATION structure specifies all the information in a token that is necessary for an app container.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_appcontainer_information
 */
export interface TOKEN_APPCONTAINER_INFORMATION {
    TokenAppContainer: SID
}

/** @internal */
export const cTOKEN_APPCONTAINER_INFORMATION = koffi.struct('TOKEN_APPCONTAINER_INFORMATION', {
    TokenAppContainer: koffi.pointer(cSID)
})

/**
 * The TOKEN_DEFAULT_DACL structure specifies a discretionary access control list (DACL).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_default_dacl
 */
export interface TOKEN_DEFAULT_DACL {
    DefaultDacl: ACL
}

/** @internal */
export const cTOKEN_DEFAULT_DACL = koffi.struct('TOKEN_DEFAULT_DACL', {
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
export const cTOKEN_ELEVATION = koffi.struct('TOKEN_ELEVATION', {
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
export const cTOKEN_GROUPS = koffi.struct('TOKEN_GROUPS', {
    GroupCount: cDWORD,
    Groups: koffi.array(cSID_AND_ATTRIBUTES, 1)
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
export const cTOKEN_GROUPS_AND_PRIVILEGES = koffi.struct('TOKEN_GROUPS_AND_PRIVILEGES', {
    SidCount:            cDWORD,
    SidLength:           cDWORD,
    Sids:                koffi.pointer(koffi.array(cSID_AND_ATTRIBUTES, 1)),
    RestrictedSidCount:  cDWORD,
    RestrictedSidLength: cDWORD,
    RestrictedSids:      koffi.pointer(koffi.array(cSID_AND_ATTRIBUTES, 1)),
    PrivilegeCount:      cDWORD,
    PrivilegeLength:     cDWORD,
    Privileges:          koffi.pointer(koffi.array(cLUID_AND_ATTRIBUTES, 1)),
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
export const cTOKEN_LINKED_TOKEN = koffi.struct('TOKEN_LINKED_TOKEN', {
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
export const cTOKEN_MANDATORY_LABEL = koffi.struct('TOKEN_MANDATORY_LABEL', {
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
export const cTOKEN_MANDATORY_POLICY = koffi.struct('TOKEN_MANDATORY_POLICY', {
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
export const cTOKEN_ORIGIN = koffi.struct('TOKEN_ORIGIN', {
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
export const cTOKEN_OWNER = koffi.struct('TOKEN_OWNER', {
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
export const cTOKEN_PRIMARY_GROUP = koffi.struct('TOKEN_PRIMARY_GROUP', {
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
export const cTOKEN_PRIVILEGES = koffi.struct('TOKEN_PRIVILEGES', {
    PrivilegeCount: cDWORD,
    Privileges: koffi.array(cLUID_AND_ATTRIBUTES, 1)
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
export const cTOKEN_SOURCE = koffi.struct('TOKEN_SOURCE', {
    SourceName: koffi.array(cCHAR, Internals.TOKEN_SOURCE_LENGTH),
    SourceIdentifier: cLUID
})

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
export const cTOKEN_STATISTICS = koffi.struct('TOKEN_STATISTICS', {
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
export const cTOKEN_USER = koffi.struct('TOKEN_USER', {
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
    TrustLevelSid:      SID
    SecurityAttributes: null    // Reserved, must be null
}

/** @internal */
export const cTOKEN_ACCESS_INFORMATION = koffi.struct('TOKEN_ACCESS_INFORMATION', {
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
export const cSECURITY_DESCRIPTOR = koffi.struct('SECURITY_DESCRIPTOR', {
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
    readonly nLength = koffi.sizeof(cSECURITY_ATTRIBUTES)
    declare lpSecurityDescriptor: SECURITY_DESCRIPTOR
    declare bInheritHandle: boolean
}

/** @internal */
export const cSECURITY_ATTRIBUTES = koffi.struct('SECURITY_ATTRIBUTES', {
    nLength:              cDWORD,
    lpSecurityDescriptor: koffi.pointer(cSECURITY_DESCRIPTOR),
    bInheritHandle:       cBOOL
})

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
export const cVALENT = koffi.struct('VALENT', {
    ve_valuename: cSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cPVOID,
    ve_type:      cDWORD
})
