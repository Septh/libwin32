import { koffi } from './private.js'
import {
    cINT, cUINT, cBYTE, cSHORT, cUSHORT, cLONG, cULONG, cDWORD, cPVOID, cPWSTR,
    cHANDLE, type HANDLE, type HINSTANCE, type HICON, type HCURSOR, type HBRUSH, type HDESK, type HWND,
    cWNDPROC, type WNDPROC,
    cWPARAM, type WPARAM,
    cLPARAM, type LPARAM
} from './ctypes.js'
import type { CS_, NIF_ } from './consts.js'

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
    SubAuthority:        Uint32Array
}

export const SID_REVISION = 1                       // Current revision level
export const SID_MAX_SUB_AUTHORITIES = 15
export const SID_RECOMMENDED_SUB_AUTHORITIES = 1    // Will change to around 6

export const cSID = koffi.struct('SID', {
    Revision:            cBYTE,
    IdentifierAuthority: koffi.array(koffi.types.uint8, 6, 'Array'),
    SubAuthorityCount:   cBYTE,
    SubAuthority:        cPVOID   // DWORD *SubAuthority[]
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
