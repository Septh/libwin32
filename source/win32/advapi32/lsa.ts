import { koffi } from '../private.js'
import {
    cUSHORT, cULONG, cDWORD, cHANDLE, cNTSTATUS, cPVOID, cPWSTR,
    type HANDLE, type LSA_HANDLE,
    type OUT
} from '../ctypes.js'
import type { ACCESS_MASK } from '../consts/ACCESS_MASK.js'
import { NTSTATUS_ } from '../consts/NTSTATUS.js'
import { advapi32 } from './_lib.js'

/**
 * The LSA_UNICODE_STRING structure is used by various Local Security Authority (LSA) functions to specify a Unicode string.
 */
export class LSA_UNICODE_STRING {
    Length:        number       // The length, in bytes, of the string pointed to by the Buffer member, not including the terminating null character, if any.
    MaximumLength: number       // The total size, in bytes, of the memory allocated for Buffer. Up to MaximumLength bytes can be written into the buffer without trampling memory.
    Buffer:        Uint16Array

    constructor(string: string)
    constructor(length: number)
    constructor(strOrLen: string | number) {
        this.Buffer = typeof strOrLen === 'string'
            ? Uint16Array.from(strOrLen, c => c.charCodeAt(0))
            : new Uint16Array(strOrLen)
        this.Length = this.MaximumLength = this.Buffer.byteLength
    }
}

export const cLSA_UNICODE_STRING = koffi.struct({
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cPWSTR
}), cPLSA_UNICODE_STRING = koffi.pointer(cLSA_UNICODE_STRING)

/**
 * Used with the LsaOpenPolicy function to specify the attributes of the connection to the Policy object.
 */
export class LSA_OBJECT_ATTRIBUTES {
    Length:                   number = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)
    RootDirectory:            HANDLE = null!
    ObjectName:               string = null!
    Attributes:               number = 0
    SecurityDescriptor:       any    = null     // Points to type SECURITY_DESCRIPTOR
    SecurityQualityOfService: any    = null     // Points to type SECURITY_QUALITY_OF_SERVICE
}

export const cLSA_OBJECT_ATTRIBUTES = koffi.struct({
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               cPLSA_UNICODE_STRING,
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})

/**
 * Closes a handle to a Policy or TrustedDomain object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaclose
 */
export function LsaClose(ObjectHandle: LSA_HANDLE): NTSTATUS_ {
    LsaClose.native ??= advapi32.func('LsaClose', cNTSTATUS, [ cHANDLE ])
    return LsaClose.native(ObjectHandle)
}

/**
 * Opens a handle to the Policy object on a local or remote system.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaopenpolicy
 */
export function LsaOpenPolicy(SystemName: string | null, ObjectAttributes: LSA_OBJECT_ATTRIBUTES, DesiredAcces: ACCESS_MASK, PolicyHandle: LSA_HANDLE | null = null): LSA_HANDLE | null {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ cPLSA_UNICODE_STRING, koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

    const lusSystemName = typeof SystemName === 'string' ? new LSA_UNICODE_STRING(SystemName) : null
    const pPolicyHandle: OUT<LSA_HANDLE> = [ PolicyHandle! ]
    return LsaOpenPolicy.native(lusSystemName, ObjectAttributes, DesiredAcces, pPolicyHandle) === 0
        ? pPolicyHandle[0]
        : null
}

/**
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(Status: NTSTATUS_): number {
    LsaNtStatusToWinError.native ??= advapi32.func('LsaNtStatusToWinError', cULONG, [ cNTSTATUS ])
    return LsaNtStatusToWinError.native(Status)
}
