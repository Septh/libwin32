import { koffi, textDecoder } from '../private.js'
import {
    cBOOL, cBYTE, cDWORD, cPVOID, cPWSTR, cPDWORD,
    cHANDLE, type HANDLE, type HTOKEN,
    type OUT
} from '../ctypes.js'
import type { TOKEN_INFORMATION_CLASS } from '../consts/TOKEN_INFORMATION_CLASS.js'
import type { SID_NAME_USE } from '../consts/SID_NAME_USE.js'
import type { ACCESS_MASK } from '../consts/ACCESS_MASK.js'
import { advapi32 } from './_lib.js'

export interface SID {
    Revision:          number
    SubAuthorityCount: number
    SubAuthority: Uint32Array
}

export const cSID = koffi.struct({
    Revision:          cBYTE,
    SubAuthorityCount: cBYTE,
    SubAuthority:      cPVOID,     // DWORD *SubAuthority[]
}), cPSID = koffi.pointer(cSID)

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
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(
    lpSystemName: string | null,
    Sid: SID
): { Name: string, ReferencedDomainName: string, peUse: SID_NAME_USE } | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [
        cPWSTR, cPSID,
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
