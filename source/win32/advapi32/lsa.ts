import koffi from 'koffi-cream'
import { Internals, type OUT } from '../private.js'
import {
    cDWORD, cULONG,
    cHANDLE, type LSA_HANDLE,
    cNTSTATUS
} from '../ctypes.js'
import {
    cLSA_OBJECT_ATTRIBUTES, LSA_OBJECT_ATTRIBUTES,
    cLSA_UNICODE_STRING, LSA_UNICODE_STRING
} from '../structs.js'
import {
    type NTSTATUS_, type POLICY_
} from '../consts.js'
import { advapi32 } from './lib.js'

/**
 * Closes a handle to a Policy or TrustedDomain object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaclose
 */
export function LsaClose(objectHandle: LSA_HANDLE): NTSTATUS_ {
    LsaClose.native ??= advapi32.func('LsaClose', cNTSTATUS, [ cHANDLE ])
    return LsaClose.native(objectHandle)
}

/**
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(status: NTSTATUS_ | number): number {
    LsaNtStatusToWinError.native ??= advapi32.func('LsaNtStatusToWinError', cULONG, [ cNTSTATUS ])
    return LsaNtStatusToWinError.native(status)
}

/**
 * Opens a handle to the Policy object on a local or remote system.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaopenpolicy
 */
export function LsaOpenPolicy(systemName: string | null, desiredAcces: POLICY_): LSA_HANDLE | null {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

    const name = typeof systemName === 'string' ? new LSA_UNICODE_STRING(systemName) : null
    const pHandle: OUT<LSA_HANDLE> = [null!]
    if (LsaOpenPolicy.native(name, new LSA_OBJECT_ATTRIBUTES(), desiredAcces, pHandle) === Internals.STATUS_SUCCESS)
        return pHandle[0]
    return null
}
