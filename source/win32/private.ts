
/** Various Win32 constants used internally. */
export const enum Internals {
    // This is the size (in bytes) of pre-allocated internal Buffer instances used for pooling.
    // (Note: Buffer.poolSize was raised from 8192 to 65536 in Node.js 26.3.0)
    BUFFER_POOLSIZE = 0x8000,

    ANYSIZE_ARRAY = 1,
    DWORD_LENGTH = 4,   // == koffi.sizeof(cDWORD)

    UNLEN = 256,
    GNLEN = UNLEN,
    PWLEN = 256,
    MAX_PATH = 260,

    ACL_REVISION = 2,
    ACL_REVISION_DS = 4,
    CLAIM_SECURITY_ATTRIBUTES_INFORMATION_VERSION_V1 = 1,
    SID_HASH_SIZE = 32,
    SID_MAX_SUB_AUTHORITIES = 15,
    SID_RECOMMENDED_SUB_AUTHORITIES = 1,
    SID_REVISION = 1,
    TOKEN_SOURCE_LENGTH = 8,
    TOKEN_GROUPS_MAX_GROUPS = 32,   // No idea if this is enough, but Koffi needs an upper limit
    TOKEN_PRIVILEGES_MAX_PRIVILEGES = 32,   // No idea if this is enough, but Koffi needs an upper limit
    TOKEN_PRIVILEGES_SET_MAX_PRIVILEGES = 32,   // No idea if this is enough, but Koffi needs an upper limit
    POLICY_AUDIT_EVENTS_INFO_MAX_OPTIONS = 16,   // No idea if this is enough, but Koffi needs an upper limit
    LSALOOKUPNAMES2_MAX_NAMES = 8,

    NOERROR = 0,
    ERROR_SUCCESS = 0, // LSTATUS
    NTSTATUS_SUCCESS = 0, // NTSTATUS
    MAX_KEY_LENGTH = 255,
    MAX_VALUE_NAME = 16383,
    MAX_NAME = 256,
    INVALID_HANDLE_VALUE = -1,

    INFINITE = 0xffffffff,  // Infinite timeout
}

export const binaryBuffer = /*#__PURE__*/ Buffer.alloc(32768)
export const textDecoder  = /*#__PURE__*/ new TextDecoder('utf-16')

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
        if (Buffer.poolSize < Internals.BUFFER_POOLSIZE)
            Buffer.poolSize = Internals.BUFFER_POOLSIZE
    }
}

/** koffi.out() and koffi.inout() expect a table with a single entry. */
export type OUT<T> = [T]

export type Pointer = bigint
export function isPointer(value: unknown): value is Pointer {
    return typeof value === "bigint"
}
