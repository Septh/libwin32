import koffi from 'koffi-cream'
import { StringOutputBuffer, Internals, type OUT } from '../private.js'
import { cBOOL, cINT, cBYTE, cDWORD, cPVOID, cSTR } from '../ctypes.js'
import {
    cSID, type SID,
    cSID_IDENTIFIER_AUTHORITY, type SID_IDENTIFIER_AUTHORITY
} from '../structs.js'
import { LocalFree, cLocalAllocatedString } from '../kernel32.js'
import type { SID_NAME_USE} from '../consts.js'
import { advapi32, decodeSid } from './lib.js'

/**
 * Allocates and initializes a security identifier (SID) with up to eight subauthorities.
 *
 * Note: in libwin32, because the allocated SID is turned into a JS object, its memory is immediately returned to the system
 *       by this function. The net effect is that you don't need to call {@link FreeSid()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-allocateandinitializesid
 */
export function AllocateAndInitializeSid(identifierAuthority: SID_IDENTIFIER_AUTHORITY, subAuthorityCount: number, subAuthority0: number = 0, subAuthority1: number = 0, subAuthority2: number = 0, subAuthority3: number = 0, subAuthority4: number = 0, subAuthority5: number = 0, subAuthority6: number = 0, subAuthority7: number = 0): SID | null {

    // A note about the last parameter (pSid):
    // `[out] PSID *pSid` should be declared as `koffi.out(koffi.pointer(koffi.pointer(cSID)))`,
    // and we could even use a disposable type.
    // We don't do that however because Koffi does not handle variable-length arrays:
    // it would always decode 15 sub-authorities, possibly accessing random memory beyond the allocated SID.
    // To avoid that, we have to manually decode the SID.
    AllocateAndInitializeSid.native ??= advapi32.func('AllocateAndInitializeSid', cBOOL, [ koffi.pointer(cSID_IDENTIFIER_AUTHORITY), cBYTE, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, koffi.out(koffi.pointer(cPVOID)) ])

    const pSID: OUT<unknown> = [null]
    if (AllocateAndInitializeSid.native([ identifierAuthority ], subAuthorityCount, subAuthority0, subAuthority1, subAuthority2, subAuthority3, subAuthority4, subAuthority5, subAuthority6, subAuthority7, pSID) !== 0) {
        const sid = decodeSid(pSID[0])
        freeSid()
        return sid
    }
    return null

    function freeSid(): void {
        (freeSid.native ??= advapi32.func('FreeSid', cPVOID, [ cPVOID ]))(pSID[0])
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
    if (ConvertSidToStringSid.native(sid, pStr) !== 0)
        return pStr[0]
    return null
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

export interface LookupAccountSidResult {
    name: string
    referencedDomainName: string
    use: SID_NAME_USE
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
