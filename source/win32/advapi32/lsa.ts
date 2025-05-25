import { koffi } from '../private.js'
import {
    cULONG, cDWORD, cNTSTATUS,
    cHANDLE, type LSA_HANDLE,
    type OUT
} from '../ctypes.js'
import type { ACCESS_MASK } from '../consts/ACCESS_MASK.js'
import { NTSTATUS_ } from '../consts/NTSTATUS.js'
import { cLSA_OBJECT_ATTRIBUTES, type LSA_OBJECT_ATTRIBUTES } from '../structs/LSA_OBJECT_ATTRIBUTES.js'
import { cLSA_UNICODE_STRING, LSA_UNICODE_STRING } from '../structs/LSA_UNICODE_STRING.js'
import { advapi32 } from './_lib.js'

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
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

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
