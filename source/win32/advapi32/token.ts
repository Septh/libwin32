import { koffi, textDecoder, type NUMBER_OUT } from '../private.js'
import {
    cBOOL, cBYTE, cDWORD, cLPVOID, cLPWSTR, cLPDWORD,
    cHANDLE, type __HANDLE__
} from '../ctypes.js'
import { advapi32 } from './_lib.js'
import type { TOKEN_INFORMATION_CLASS } from '../consts.js'
import type { SID_NAME_USE } from '../consts.js'

export type HTOKEN = __HANDLE__<'ACCESS_TOKEN'>

export interface SID {
    Revision: number
    SubAuthorityCount: number
    SubAuthority: Uint8Array
}

export const cSID = koffi.struct({
    Revision: cBYTE,
    SubAuthorityCount: cBYTE,
    SubAuthority: koffi.array(cDWORD, 0)
}), cPSID = koffi.pointer(cSID)

/**
 * Retrieves a specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS | number): Uint8Array | null {
    GetTokenInformation.fn ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cDWORD, koffi.pointer(cLPVOID), cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const out = new Uint8Array(1024)
    const len: NUMBER_OUT = [ 0 ]
    return GetTokenInformation.fn(TokenHandle, TokenInformationClass, out, out.length, len) === 0
        ? null
        : out
}

/** @internal */
export declare namespace GetTokenInformation {
    export var fn: koffi.KoffiFunc<(
        TokenHandle: HTOKEN,
        TokenInformationClass: number,
        TokenInformation: Uint8Array, TokenInformationLength: number,
        ReturnLength: NUMBER_OUT
    ) => number>
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
    LookupAccountSid.fn ??= advapi32.func('LookupAccountSidW', cBOOL, [
        cLPWSTR, cPSID,
        koffi.out(cLPWSTR), koffi.inout(cLPDWORD),
        koffi.out(cLPWSTR), koffi.inout(cLPDWORD),
        koffi.out(cLPDWORD)
    ])

    const name = new Uint16Array(256)
    const cchName: NUMBER_OUT = [ name.length ]
    const referencedDomainName = new Uint16Array(256)
    const cchReferencedDomainName: NUMBER_OUT = [ referencedDomainName.length ]
    const peUse: NUMBER_OUT = [ 0 ]

    return LookupAccountSid.fn(lpSystemName, Sid, name, cchName, referencedDomainName, cchReferencedDomainName, peUse) === 0
        ? null
        : {
            Name: textDecoder.decode(name.slice(0, cchName[0])),
            ReferencedDomainName: textDecoder.decode(referencedDomainName.slice(0, cchReferencedDomainName[0])),
            peUse: peUse[0]
        }
}

/** @internal */
export declare namespace LookupAccountSid {
    export var fn: koffi.KoffiFunc<(lpSystemName: string | null, Sid: SID, Name: Uint16Array, cchName: NUMBER_OUT, ReferencedDomainName: Uint16Array, cchReferencedDomainName: NUMBER_OUT, peUse: NUMBER_OUT) => number>
}
