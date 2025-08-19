
export const binaryBuffer = /*#__PURE__*/Buffer.alloc(32768)
export const textDecoder  = /*#__PURE__*/new TextDecoder('utf-16')

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
}

/** Various Win32 constants. */
export const enum Internals {
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

    NOERROR = 0,
    ERROR_SUCCESS  = 0, // LSTATUS
    NTSTATUS_SUCCESS = 0, // NTSTATUS
    MAX_KEY_LENGTH = 255,
    MAX_VALUE_NAME = 16383,
    MAX_NAME = 256,
    INVALID_HANDLE_VALUE = -1,
    INFINITE = 0xffffffff,  // Infinite timeout
}

/** koffi.out() and koffi.inout() expect a table with a single entry. */
export type OUT<T> = [T]
