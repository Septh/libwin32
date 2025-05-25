import { koffi, Win32Dll, textDecoder } from './private.js'
import {
    cBOOL, cDWORD, cULONG, cPVOID, cPDWORD, cPWSTR, cNTSTATUS,
    cHANDLE, type HANDLE, type HTOKEN, type LSA_HANDLE,
    type OUT
} from './ctypes.js'
import { cLSA_UNICODE_STRING, LSA_UNICODE_STRING } from './structs/LSA_UNICODE_STRING.js'
import { cLSA_OBJECT_ATTRIBUTES, type LSA_OBJECT_ATTRIBUTES } from './structs/LSA_OBJECT_ATTRIBUTES.js'
import { cSID, type SID } from './structs/SID.js'
import type { ACCESS_MASK } from './consts/ACCESS_MASK.js'
import { UNLEN } from './consts/EXTENDED_NAME_FORMAT.js'
import type { NTSTATUS_ } from './consts/NTSTATUS.js'
import type { SID_NAME_USE } from './consts/SID_NAME_USE.js'
import type { TOKEN_INFORMATION_CLASS } from './consts/TOKEN_INFORMATION_CLASS.js'

const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

/**
 * Retrieves a specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS): unknown | null {
    GetTokenInformation.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cDWORD, koffi.pointer(cPVOID), cDWORD, koffi.out(cPVOID) ])

    const out = new Uint32Array(256)
    const len: OUT<number> = [ 0 ]
    return GetTokenInformation.native(TokenHandle, TokenInformationClass, out, out.length, len) === 0
        ? null
        : out
}

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPWSTR, koffi.inout(cPDWORD) ])

    const out = new Uint16Array(UNLEN + 1)
    const len: OUT<number> = [ out.length ]
    return GetUserName.native(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0] - 1))   // -1 because GetUserName() includes the final \0
}

/**
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(
    lpSystemName: string | null,
    Sid: SID
): { Name: string, ReferencedDomainName: string, peUse: SID_NAME_USE } | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [
        cPWSTR, koffi.pointer(cSID),
        koffi.out(cPWSTR), koffi.inout(cPDWORD),
        koffi.out(cPWSTR), koffi.inout(cPDWORD),
        koffi.out(cPDWORD)
    ])

    const name = new Uint16Array(256)
    const cchName: OUT<number> = [ name.length ]
    const referencedDomainName = new Uint16Array(256)
    const cchReferencedDomainName: OUT<number> = [ referencedDomainName.length ]
    const peUse: OUT<number> = [ 0 ]

    return LookupAccountSid.native(lpSystemName, Sid, name, cchName, referencedDomainName, cchReferencedDomainName, peUse) === 0
        ? null
        : {
            Name: textDecoder.decode(name.subarray(0, cchName[0])),
            ReferencedDomainName: textDecoder.decode(referencedDomainName.subarray(0, cchReferencedDomainName[0])),
            peUse: peUse[0]
        }
}

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
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(Status: NTSTATUS_): number {
    LsaNtStatusToWinError.native ??= advapi32.func('LsaNtStatusToWinError', cULONG, [ cNTSTATUS ])
    return LsaNtStatusToWinError.native(Status)
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
 * Opens the access token associated with a process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function OpenProcessToken(ProcessHandle: HANDLE, DesiredAccess: ACCESS_MASK): HTOKEN | null {
    OpenProcessToken.native ??= advapi32.func('OpenProcessToken', cBOOL, [ cHANDLE, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const tokenHandle: OUT<HTOKEN> = [ null! ]
    return OpenProcessToken.native(ProcessHandle, DesiredAccess, tokenHandle) === 0
        ? null
        : tokenHandle[0]
}
