import koffi from 'koffi'

export const binaryBuffer = /*#__PURE__*/ Buffer.alloc(32768)
export const textDecoder  = /*#__PURE__*/ new TextDecoder('utf-16')

/*
 * (Some) C typedefs used throughout the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */

export const cVOID      = koffi.types.void
export const cBOOL      = koffi.types.int
export const cINT       = koffi.types.int
export const cUINT      = koffi.types.uint
export const cCHAR      = koffi.types.char
export const cUCHAR     = koffi.types.uchar
export const cWCHAR     = koffi.types.wchar
export const cBYTE      = koffi.types.uint8
export const cSHORT     = koffi.types.short
export const cUSHORT    = koffi.types.ushort
export const cWORD      = koffi.types.ushort
export const cLONG      = koffi.types.long
export const cULONG     = koffi.types.ulong
export const cDWORD     = koffi.types.ulong
export const cDWORD64   = koffi.types.uint64
export const cLONG64    = koffi.types.int64
export const cULONG64   = koffi.types.uint64
export const cLONGLONG  = koffi.types.int64
export const cLONG_PTR  = koffi.types.int64
export const cULONG_PTR = koffi.types.uint64
export const cFLOAT     = koffi.types.float
export const cSTR       = koffi.types.str16    // We let Koffi convert JS string parameters
export const cSIZE_T    = koffi.types.uint64

export const cPVOID     = koffi.pointer(koffi.types.void)
export const cPDWORD    = koffi.pointer(cDWORD)

export const cHANDLE    = koffi.pointer(koffi.opaque())
export const cLSTATUS   = koffi.types.int32
export const cNTSTATUS  = koffi.types.int32

export class StringOutputBuffer {
    readonly buffer: Buffer<ArrayBuffer>
    readonly pLength: OUT<number>
    get length() { return this.pLength[0] }

    constructor(length: number) {
        this.buffer  = Buffer.allocUnsafe(length * Uint16Array.BYTES_PER_ELEMENT)
        this.pLength = [length]
    }

    decode(length: number = this.length): string {
        return textDecoder.decode(this.buffer.subarray(0, length * 2))
    }

    static {
        // Increase the size of pre-allocated internal Buffer instances used for pooling to 32768.
        // (Note: Buffer.poolSize was raised from 8192 to 65536 in Node.js 26.3.0, so don't touch that)
        if (Buffer.poolSize < 0x8000)
            Buffer.poolSize = 0x8000
    }
}

/** The base type to define new HANDLEs. */
export type __HANDLE__<Kind extends string> = bigint & { __kind: Kind }

/** Any kind of handle */
export type HANDLE = __HANDLE__<string>

/** koffi.out() and koffi.inout() expect a table with a single entry. */
export type OUT<T> = [T]

export type Pointer = bigint
export function isPointer(value: unknown): value is Pointer {
    return typeof value === "bigint"
}

/** Various Win32 constants used internally. */
export const enum Internals {
    ANYSIZE_ARRAY = 1,
    INVALID_HANDLE_VALUE = -1,
    ERROR_SUCCESS = 0, // LSTATUS
    NTSTATUS_SUCCESS = 0, // NTSTATUS

    DWORD_LENGTH = 4,   // == koffi.sizeof(cDWORD)

    UNLEN = 256,
    GNLEN = UNLEN,
    PWLEN = 256,
    MAX_PATH = 260,
    MAX_NAME = 256,
    MAX_KEY_LENGTH = 255,
    MAX_VALUE_NAME = 16383,

    ACL_REVISION = 2,
    ACL_REVISION_DS = 4,

    CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1 = 1,

    SID_REVISION = 1,
    SID_HASH_SIZE = 32,
    SID_MAX_SUB_AUTHORITIES = 15,
    SID_RECOMMENDED_SUB_AUTHORITIES = 1,

    TOKEN_SOURCE_LENGTH = 8,
    TOKEN_GROUPS_MAX_GROUPS = 32,   // No idea if this is enough, but Koffi needs an upper limit
    TOKEN_PRIVILEGES_MAX_PRIVILEGES = 32,   // No idea if this is enough, but Koffi needs an upper limit
    TOKEN_PRIVILEGES_SET_MAX_PRIVILEGES = 32,   // No idea if this is enough, but Koffi needs an upper limit
    POLICY_AUDIT_EVENTS_INFO_MAX_OPTIONS = 16,   // No idea if this is enough, but Koffi needs an upper limit

    LSALOOKUPNAMES2_MAX_NAMES = 8,

    INFINITE = 0xffffffff,  // Infinite timeout
}
