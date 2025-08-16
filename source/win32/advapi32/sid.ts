import koffi from 'koffi-cream'
import { StringOutputBuffer, Internals, type OUT } from '../private.js'
import { cBOOL, cINT, cBYTE, cDWORD, cPVOID, cSTR } from '../ctypes.js'
import {
    cSID, type SID,
    cSID_IDENTIFIER_AUTHORITY, type SID_IDENTIFIER_AUTHORITY
} from '../structs.js'
import { ERROR_, type SID_NAME_USE} from '../consts.js'
import { LocalFree, SetLastError, cLocalAllocatedString } from '../kernel32.js'
import { advapi32, decodeSid } from './lib.js'

export interface LookupAccountSidResult {
    name: string
    referencedDomainName: string
    use: SID_NAME_USE
}

/**
 * Allocates and initializes a security identifier (SID) with up to eight sub-authorities.
 *
 * Notes:
 * - in libwin32, there is no `nSubAuthorityCount` parameter, you simply pass 1 to 8 sub-authorities.
 * - the allocated SID is immediately returned to the system by this function.
 *   The net effect is that you don't need to call {@link FreeSid()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-allocateandinitializesid
 */
export function AllocateAndInitializeSid(identifierAuthority: SID_IDENTIFIER_AUTHORITY, ...subAuthorities: number[]): SID | null {
    AllocateAndInitializeSid.native ??= advapi32.func('AllocateAndInitializeSid', cBOOL, [
        koffi.pointer(cSID_IDENTIFIER_AUTHORITY), cBYTE,
        cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD,
        koffi.out(koffi.pointer(cPVOID))
    ])

    const subAuthorityCount = subAuthorities.length
    if (subAuthorityCount > 0 && subAuthorityCount <= 8) {
        subAuthorities.length = 8
        subAuthorities.fill(0, subAuthorityCount)

        const pSID: OUT<unknown> = [null]
        if (AllocateAndInitializeSid.native([ identifierAuthority ], subAuthorityCount,
            subAuthorities[0], subAuthorities[1], subAuthorities[2], subAuthorities[3],
            subAuthorities[4], subAuthorities[5], subAuthorities[6], subAuthorities[7],
            pSID
        ) !== 0) {
            const sid = decodeSid(pSID[0])
            freeSid(pSID[0])
            return sid
        }
    }
    else SetLastError(ERROR_.BAD_ARGUMENTS)
    return null

    function freeSid(ptr: unknown): void {
        (freeSid.native ??= advapi32.func('FreeSid', cPVOID, [ cPVOID ]))(ptr)
    }
}

/**
 * The ConvertSidToStringSid function converts a security identifier (SID) to a string format suitable for display, storage, or transmission.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/sddl/nf-sddl-convertsidtostringsidw
 */
export function ConvertSidToStringSid(sid: SID): string | null {
    ConvertSidToStringSid.native ??= advapi32.func('ConvertSidToStringSidW', cBOOL, [ koffi.pointer(cSID), koffi.out(koffi.pointer(cLocalAllocatedString)) ])

    const pStr: OUT<string> = [null!]
    return ConvertSidToStringSid.native(sid, pStr) !== 0
        ? pStr[0]
        : null
}

/**
 * The ConvertStringSidToSid function converts a string-format security identifier (SID) into a valid, functional SID.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/sddl/nf-sddl-convertstringsidtosidw
 */
export function ConvertStringSidToSid(stringSid: string): SID | null {
    ConvertStringSidToSid.native ??= advapi32.func('ConvertStringSidToSidW', cBOOL, [ cSTR, koffi.out(koffi.pointer(cPVOID)) ])

    const pSID: OUT<unknown> = [null]
    if (ConvertStringSidToSid.native(stringSid, pSID) !== 0) {
        const sid = decodeSid(pSID[0])
        LocalFree(pSID[0])
        return sid
    }
    return null
}

/**
 * Tests two security identifier (SID) values for equality.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-equalsid
 */
export function EqualSid(sid1: SID, sid2: SID): boolean {
    EqualSid.native ??= advapi32.func('EqualSid', cBOOL, [ koffi.pointer(cSID), koffi.pointer(cSID) ])
    return EqualSid.native(sid1, sid2) !== 0
}

/**
 * Frees a security identifier (SID) previously allocated by using the {@link AllocateAndInitializeSid} function.
 *
 * Note: in libwin32, `AllocateAndInitializeSid()` frees the allocated memory, so this functions is a NOOP.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-freesid
 */
export function FreeSid(_sid: SID): void {}

/**
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(systemName: string | null, sid: SID): LookupAccountSidResult | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [ cSTR, koffi.pointer(cSID), cPVOID, koffi.inout(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cINT)) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const pUse: OUT<SID_NAME_USE> = [0 as SID_NAME_USE]
    if (LookupAccountSid.native(systemName, sid, name.buffer, name.pLength, domain.buffer, domain.pLength, pUse) !== 0) {
        return {
            name: name.decode(),
            referencedDomainName: domain.decode(),
            use: pUse[0]
        }
    }
    return null
}

/**
 * Retrieves the name of the account for the specified SID on the local machine.
 * LookupAccountSidLocal is defined as a function that calls LookupAccountSid with null as the first parameter.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidlocalw
 */
export function LookupAccountSidLocal(sid: SID): LookupAccountSidResult | null {
    return LookupAccountSid(null, sid)
}
