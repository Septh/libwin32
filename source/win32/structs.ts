import { koffi, Internals } from './private.js'
import {
    cINT, cUINT, cCHAR, cBYTE, cSHORT, cUSHORT, cWORD,
    cLONG, cULONG, cDWORD, cLONGLONG, cULONG_PTR, cLONG64, cDWORD64, cPVOID, cPWSTR,
    cHANDLE, type HANDLE, type HINSTANCE, type HICON, type HCURSOR, type HBRUSH, type HDESK, type HWND, type HTOKEN,
    cWNDPROC, type WNDPROC, cWPARAM, type WPARAM, cLPARAM, type LPARAM,
} from './ctypes.js'
import type {
    CS_, NIF_,
    CLAIM_SECURITY_ATTRIBUTE_, CLAIM_SECURITY_ATTRIBUTE_TYPE_,
    SECURITY_IMPERSONATION_LEVEL, TOKEN_TYPE_
} from './consts.js'

/**
 * The POINT structure defines the x- and y-coordinates of a point.
 */
export interface POINT {
    x: number
    y: number
}

export const cPOINT = koffi.struct('POINT', {
    x: cLONG,
    y: cLONG
})

/**
 * The POINTS structure defines the x- and y-coordinates of a point.
 */
export interface POINTS {
    x: number
    y: number
}

export const cPOINTS = koffi.struct('POINTS', {
    x: cSHORT,
    y: cSHORT
})

/**
 * The RECT structure defines a rectangle by the coordinates of its upper-left and lower-right corners.
 */
export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

export const cRECT = koffi.struct('RECT', {
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

/**
 * The SIZE structure defines the width and height of a rectangle.
 */
export interface SIZE {
    x: number
    y: number
}

export const cSIZE = koffi.struct('SIZE', {
    cx: cLONG,
    yy: cLONG
})

/**
 * Contains information about a window's maximized size and position and its minimum and maximum tracking size.
 */
export interface MINMAXINFO {
    ptReserved:     POINT
    ptMaxSize:      POINT
    ptMaxPosition:  POINT
    ptMinTrackSize: POINT
    ptMaxTrackSize: POINT
}

export const cMINMAXINFO = koffi.struct('MINMAXINFO', {
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

/**
 * The ACL structure is the header of an access control list (ACL).
 */
export interface ACL {
    AclRevision: number
    Sbsz1: number
    AclSize: number
    AceCount: number
    Sbsz2: number
}

export const ACL_REVISION = 1

export const cACL = koffi.struct('ACL', {
    AclRevision: cBYTE,
    Sbsz1: cBYTE,
    AclSize: cWORD,
    AceCount: cWORD,
    Sbsz2: cWORD
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE structure specifies the fully qualified binary name.
 */
export interface CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE {
    Version: BigInt
    Name:    String
}

export const cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE', {
    Version: cDWORD64,
    Name:    cPWSTR
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE structure specifies the OCTET_STRING value type of the claim security attribute.
 */
export interface CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE {
    pValue:      BigInt
    ValueLength: number
}

export const cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE', {
    pValue:      cPVOID,
    ValueLength: cDWORD
})

/**
 * The CLAIM_SECURITY_ATTRIBUTE_V1 structure defines a security attribute that can be associated with a token or authorization context.
 */
export interface CLAIM_SECURITY_ATTRIBUTE_V1 {
    Name:       string
    ValueType:  CLAIM_SECURITY_ATTRIBUTE_TYPE_
    Reserved:   0       // Reserved, must be 0
    Flags:      CLAIM_SECURITY_ATTRIBUTE_
    ValueCount: number
    /** `Values` is union, only one member is present at a time, based on ValueType. */
    Values: {
        pInt64?:        BigInt[]
        pUint64?:       BigInt[]
        ppString?:      string[]
        pFqbn?:         CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE[]
        pOctectString?: CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE[]
    }[]
}

export const cCLAIM_SECURITY_ATTRIBUTE_V1 = koffi.struct('CLAIM_SECURITY_ATTRIBUTE_V1', {
    Name:       cPWSTR,
    ValueType:  cWORD,
    Reserved:   cWORD,
    Flags:      cDWORD,
    ValueCount: cDWORD,
    Values:     koffi.union({
        pInt64:        koffi.pointer(koffi.array(cLONG64, 1)),
        pUint64:       koffi.pointer(koffi.array(cDWORD64, 1)),
        ppString:      koffi.pointer(koffi.array(cPWSTR, 1)),
        pFqbn:         koffi.pointer(koffi.array(cCLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE, 1)),
        pOctectString: koffi.pointer(koffi.array(cCLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE, 1))
    })
})

/**
 * The CLAIM_SECURITY_ATTRIBUTES_INFORMATION structure defines the security attributes for the claim.
 */
export interface CLAIM_SECURITY_ATTRIBUTES_INFORMATION {
    Version:        number
    Reserved:       0         // Reserved, must be 0
    AttributeCount: number
    Attribute: null | {
        AttributeV1: CLAIM_SECURITY_ATTRIBUTE_V1[]
    }
}

export const CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1 = 1

export const cCLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.struct('CLAIM_SECURITY_ATTRIBUTES_INFORMATION', {
    Version:        cWORD,
    Reserved:       cWORD,
    AttributeCount: cDWORD,
    Attribute: cPVOID
    // Attribute: koffi.union({
    //     pAttributeV1: koffi.pointer(cCLAIM_SECURITY_ATTRIBUTE_V1)
    // })
})

/**
 * The GUID structure stores a GUID.
 */
export interface GUID {
    Data1: number
    Data2: number
    Data3: number
    Data4: [ number, number, number, number, number, number, number, number ]
}

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
export const cUUID = koffi.alias('UUID', cGUID)

/**
 * The LUID structure is an opaque structure that specifies an identifier that is guaranteed to be unique on the local machine.
 */
export interface LUID {
    LowPart: number
    HighPart: number
}

export const cLUID = koffi.struct('LUID', {
    LowPart: cDWORD,
    HighPart: cLONG
})

/**
 * The LUID_AND_ATTRIBUTES structure represents a locally unique identifier (LUID) and its attributes.
 */
export interface LUID_AND_ATTRIBUTES {
    Lui: LUID
    Attributes: number
}

export const cLUID_AND_ATTRIBUTES = koffi.struct('LUID_AND_ATTRIBUTES', {
    Luid: cLUID,
    Attributes: cDWORD
})

/**
 * Used by various Local Security Authority (LSA) functions to specify a Unicode string.
 */
export class LSA_UNICODE_STRING {
    /** The length, in bytes, of the string pointed to by the Buffer member, not including the terminating null character, if any. */
    Length: number
    /** The total size, in bytes, of the memory allocated for Buffer. Up to MaximumLength bytes can be written into the buffer without trampling memory. */
    MaximumLength: number
    Buffer: Uint16Array

    constructor(string: string)
    constructor(length: number)
    constructor(strOrLen: string | number) {
        this.Buffer = typeof strOrLen === 'string'
            ? Uint16Array.from(strOrLen, c => c.charCodeAt(0))
            : new Uint16Array(strOrLen)
        this.Length = this.MaximumLength = this.Buffer.byteLength
    }
}

export const cLSA_UNICODE_STRING = koffi.struct('LSA_UNICODE_STRING', {
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cPWSTR
})

/**
 * Used with the LsaOpenPolicy function to specify the attributes of the connection to the Policy object.
 */
export class LSA_OBJECT_ATTRIBUTES {
    Length = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)
    declare RootDirectory:            HANDLE
    declare ObjectName:               LSA_UNICODE_STRING
    declare Attributes:               number
    declare SecurityDescriptor:       unknown       // Points to type SECURITY_DESCRIPTOR
    declare SecurityQualityOfService: unknown       // Points to type SECURITY_QUALITY_OF_SERVICE
}

export const cLSA_OBJECT_ATTRIBUTES = koffi.struct('LSA_OBJECT_ATTRIBUTES', {
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})

/**
 * The security identifier (SID) structure is a variable-length structure used to uniquely identify users or groups.
 */
export interface SID {
    Revision:            number
    IdentifierAuthority: [ number, number, number, number, number, number ]
    SubAuthorityCount:   number
    SubAuthority:        number[]
}

export const SID_REVISION = 1                       // Current revision level
export const SID_MAX_SUB_AUTHORITIES = 15
export const SID_RECOMMENDED_SUB_AUTHORITIES = 1    // Will change to around 6

export const cSID = koffi.struct('SID', {
    Revision:            cBYTE,
    IdentifierAuthority: koffi.array(cBYTE, 6, 'Array'),
    SubAuthorityCount:   cBYTE,
    SubAuthority:        koffi.array(cDWORD, Internals.SID_MAX_SUB_AUTHORITIES, 'Array')   // DWORD SubAuthority[]
})

/**
 * The SID_IDENTIFIER_AUTHORITY structure represents the top-level authority of a security identifier (SID).
 */
export type SID_IDENTIFIER_AUTHORITY = [ number, number, number, number, number, number ]

export const cSID_IDENTIFIER_AUTHORITY = koffi.array(cBYTE, 6)

/**
 * The SID_AND_ATTRIBUTES structure represents a security identifier (SID) and its attributes.
 */
export interface SID_AND_ATTRIBUTES {
    Sid: SID
    Attributes: number
}

export const cSID_AND_ATTRIBUTES = koffi.struct('SID_AND_ATTRIBUTES', {
    Sid: koffi.pointer(cSID),
    Attributes: cDWORD
})

/**
 * The SID_AND_ATTRIBUTES_HASH structure specifies a hash values for the specified array of security identifiers (SIDs).
 */
export interface SID_AND_ATTRIBUTES_HASH {
    SidCount: number
    SidAttr:  SID_AND_ATTRIBUTES[]
    Hash:     BigInt[]
}

export const SID_HASH_SIZE = 32

export const cSID_AND_ATTRIBUTES_HASH = koffi.struct('SID_AND_ATTRIBUTES_HASH', {
    SidCount: cDWORD,
    SidAttr:  koffi.pointer(koffi.array(cSID_AND_ATTRIBUTES, 1)),
    Hash:     koffi.array(cULONG_PTR, SID_HASH_SIZE)
})

/**
 * Contains message information from a thread's message queue.
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

export const cWNDCLASS = koffi.struct('WNDCLASS', {
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cPWSTR,
    lpszClassName: cPWSTR
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
    lpszMenuName:  cPWSTR,
    lpszClassName: cPWSTR,
    hIconSm:       cHANDLE
})

/**
 * Contains information about a window that denied a request from `BroadcastSystemMessageEx`.
 */
export class BSMINFO {
    readonly cbSize = koffi.sizeof(cBSMINFO)
    declare hDesk: HDESK
    declare hWnd:  HWND
    declare luid:  LUID
}

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
 */
export interface TOKEN_APPCONTAINER_INFORMATION {
    TokenAppContainer: SID
}

export const cTOKEN_APPCONTAINER_INFORMATION = koffi.struct('TOKEN_APPCONTAINER_INFORMATION', {
    TokenAppContainer: koffi.pointer(cSID)
})

/**
 * The TOKEN_DEFAULT_DACL structure specifies a discretionary access control list (DACL).
 */
export interface TOKEN_DEFAULT_DACL {
    DefaultDacl: ACL
}

export const cTOKEN_DEFAULT_DACL = koffi.struct('TOKEN_DEFAULT_DACL', {
    DefaultDacl: koffi.pointer(cACL)
})

/**
 * The TOKEN_ELEVATION structure indicates whether a token has elevated privileges.
 */
export interface TOKEN_ELEVATION {
    TokenIsElevated: number
}

export const cTOKEN_ELEVATION = koffi.struct('TOKEN_ELEVATION', {
    TokenIsElevated: cDWORD
})

/**
 * The TOKEN_GROUPS structure contains information about the group security identifiers (SIDs) in an access token.
 */
export interface TOKEN_GROUPS {
    GroupCount: number
    Groups: SID_AND_ATTRIBUTES[]
}

export const cTOKEN_GROUPS = koffi.struct('TOKEN_GROUPS', {
    GroupCount: cDWORD,
    Groups: koffi.array(cSID_AND_ATTRIBUTES, 1)
})

/**
 * The TOKEN_GROUPS_AND_PRIVILEGES structure contains information about the group security identifiers (SIDs) and privileges in an access token.
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
 */
export interface TOKEN_LINKED_TOKEN {
    LinkedToken: HTOKEN
}

export const cTOKEN_LINKED_TOKEN = koffi.struct('TOKEN_LINKED_TOKEN', {
    LinkedToken: cHANDLE
})

/**
 * The TOKEN_MANDATORY_LABEL structure specifies the mandatory integrity level for a token.
 */
export interface TOKEN_MANDATORY_LABEL {
    Label: SID_AND_ATTRIBUTES
}

export const cTOKEN_MANDATORY_LABEL = koffi.struct('TOKEN_MANDATORY_LABEL', {
    Label: cSID_AND_ATTRIBUTES
})

/**
 * The TOKEN_MANDATORY_POLICY structure specifies the mandatory integrity policy for a token.
 */
export interface TOKEN_MANDATORY_POLICY {
    Policy: number
}

export const cTOKEN_MANDATORY_POLICY = koffi.struct('TOKEN_MANDATORY_POLICY', {
    Policy: cDWORD
})

/**
 * The TOKEN_ORIGIN structure contains information about the origin of the logon session.
 */
export interface TOKEN_ORIGIN {
    OriginatingLogonSession: LUID
}

export const cTOKEN_ORIGIN = koffi.struct('TOKEN_ORIGIN', {
    OriginatingLogonSession: cLUID
})

/**
 * The TOKEN_OWNER structure contains the default owner security identifier (SID) that will be applied to newly created objects.
 */
export interface TOKEN_OWNER {
    Owner: SID
}

export const cTOKEN_OWNER = koffi.struct('TOKEN_OWNER', {
    Owner: koffi.pointer(cSID)
})

/**
 * The TOKEN_PRIMARY_GROUP structure specifies a group security identifier (SID) for an access token.
 */
export interface TOKEN_PRIMARY_GROUP {
    PrimaryGroup: SID
}

export const cTOKEN_PRIMARY_GROUP = koffi.struct('TOKEN_PRIMARY_GROUP', {
    PrimaryGroup: koffi.pointer(cSID)
})

/**
 * The TOKEN_PRIVILEGES structure contains information about a set of privileges for an access token.
 */
export interface TOKEN_PRIVILEGES {
    PrivilegeCount: number
    Privileges: LUID_AND_ATTRIBUTES[]
}

export const cTOKEN_PRIVILEGES = koffi.struct('TOKEN_PRIVILEGES', {
    PrivilegeCount: cDWORD,
    Privileges: koffi.array(cLUID_AND_ATTRIBUTES, 1)
})

/**
 * The TOKEN_SOURCE structure identifies the source of an access token.
 */
export interface TOKEN_SOURCE {
    SourceName: string
    SourceIdentifier: LUID
}

export const TOKEN_SOURCE_LENGTH = 8

export const cTOKEN_SOURCE = koffi.struct('TOKEN_SOURCE', {
    SourceName: koffi.array(cCHAR, TOKEN_SOURCE_LENGTH),
    SourceIdentifier: cLUID
})

/**
 * The TOKEN_STATISTICS structure contains information about an access token.
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
 */
export interface TOKEN_USER {
    User: SID_AND_ATTRIBUTES
}

export const cTOKEN_USER = koffi.struct('TOKEN_USER', {
    User: cSID_AND_ATTRIBUTES
})

/**
 * The TOKEN_ACCESS_INFORMATION structure specifies all the information in a token that is necessary to perform an access check.
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
