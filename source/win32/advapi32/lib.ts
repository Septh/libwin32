import koffi from 'koffi'
import {
    Internals, binaryBuffer, textDecoder, StringOutputBuffer, isPointer,
    cBOOL, cINT, cDWORD, cPVOID, cPPVOID, cPDWORD, cULONG, cSTR, cBYTE,
    cHANDLE, cLSTATUS, cNTSTATUS,
    type HANDLE, type OUT, type Pointer
} from '../internals.js'
import { SetLastError, cLocalAllocatedString, LocalFree, GetLastError } from '../kernel32/lib.js'
import type { FILETIME } from '../kernel32/types.js'
import { cFILETIME } from '../kernel32/ctypes.js'
import type { LUID } from '../misc/types.js'
import { ERROR_, NTSTATUS_ } from '../misc/consts.js'
import {
    LSA_OBJECT_ATTRIBUTES, LSA_UNICODE_STRING,
    type HKEY, type HTOKEN, type LSA_HANDLE,
    type SID, type LSA_TRANSLATED_SID2, type LSA_REFERENCED_DOMAIN_LIST,
    type POLICY_ACCOUNT_DOMAIN_INFO, type POLICY_AUDIT_EVENTS_INFO,
    type POLICY_DNS_DOMAIN_INFO, type POLICY_LSA_SERVER_ROLE_INFO, type POLICY_MODIFICATION_INFO, type POLICY_PRIMARY_DOMAIN_INFO,
    type PRIVILEGE_SET, type SECURITY_ATTRIBUTES,
    type SID_IDENTIFIER_AUTHORITY, type TOKEN_PRIVILEGES,
    type CLAIM_SECURITY_ATTRIBUTES_INFORMATION, type SID_AND_ATTRIBUTES_HASH, type TOKEN_ACCESS_INFORMATION,
    type TOKEN_APPCONTAINER_INFORMATION, type TOKEN_DEFAULT_DACL, type TOKEN_ELEVATION, type TOKEN_GROUPS, type TOKEN_GROUPS_AND_PRIVILEGES,
    type TOKEN_LINKED_TOKEN, type TOKEN_MANDATORY_LABEL, type TOKEN_MANDATORY_POLICY, type TOKEN_ORIGIN, type TOKEN_OWNER, type TOKEN_PRIMARY_GROUP,
    type TOKEN_SOURCE, type TOKEN_STATISTICS, type TOKEN_USER
} from './types.js'
import {
    cLSA_UNICODE_STRING, cSID, cLSA_TRANSLATED_SID2,
    cLSA_REFERENCED_DOMAIN_LIST, cLSA_OBJECT_ATTRIBUTES, cPOLICY_ACCOUNT_DOMAIN_INFO, cPOLICY_AUDIT_EVENTS_INFO, cPOLICY_DNS_DOMAIN_INFO,
    cPOLICY_LSA_SERVER_ROLE_INFO, cPOLICY_MODIFICATION_INFO, cPOLICY_PRIMARY_DOMAIN_INFO,
    cLUID, cPSID,
    cPRIVILEGE_SET,cSECURITY_ATTRIBUTES, cSID_IDENTIFIER_AUTHORITY,
    cTOKEN_PRIVILEGES, cACL, cCLAIM_SECURITY_ATTRIBUTE_V1, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cSID_AND_ATTRIBUTES_HASH, cTOKEN_ACCESS_INFORMATION, cTOKEN_APPCONTAINER_INFORMATION, cTOKEN_DEFAULT_DACL, cTOKEN_ELEVATION, cTOKEN_GROUPS,
    cTOKEN_GROUPS_AND_PRIVILEGES, cTOKEN_LINKED_TOKEN, cTOKEN_MANDATORY_LABEL, cTOKEN_MANDATORY_POLICY, cTOKEN_ORIGIN, cTOKEN_OWNER, cTOKEN_PRIMARY_GROUP,
    cTOKEN_SOURCE, cTOKEN_STATISTICS, cTOKEN_USER
} from './ctypes.js'
import {
    POLICY_INFORMATION_CLASS, REG_,
    TOKEN_INFORMATION_CLASS,
    type LSA_LOOKUP, type POLICY_, type HKEY_, type KEY_, type REG_OPTION_,
    type RRF_, type SE_NAME, type SECURITY_IMPERSONATION_LEVEL, type SID_NAME_USE,
    type TOKEN_, type TOKEN_TYPE
} from './consts.js'

export const advapi32 = koffi.load('advapi32.dll')

type LSTATUS = ERROR_

function _LsaFree(ptr: Pointer): number {
    _LsaFree.native ??= advapi32.func('LsaFreeMemory', cNTSTATUS, [ cPVOID ])
    return _LsaFree.native(ptr)
}

function _FreeSid(ptr: unknown): void {
    _FreeSid.native ??= advapi32.func('FreeSid', cPVOID, [ cPVOID ])
    return _FreeSid.native(ptr)
}

type BufferSource = ArrayBufferView<ArrayBufferLike>
function regKeyDataToBuffer(type: REG_, data: any): BufferSource | ERROR_ {

    switch (type) {
        case REG_.NONE:
            return new Uint8Array()

        case REG_.SZ:
        case REG_.EXPAND_SZ:
            return typeof data === 'string'
                ? Uint16Array.from(data + '\0', c => c.charCodeAt(0))
                : ERROR_.BAD_ARGUMENTS

        case REG_.MULTI_SZ:
            return Array.isArray(data) && data.every(s => typeof s === 'string')
                ? Uint16Array.from(data.join('\0') + '\0\0', c => c.charCodeAt(0))
                : ERROR_.BAD_ARGUMENTS

        case REG_.BINARY:
            return ArrayBuffer.isView(data)
                ? data
                : ERROR_.BAD_ARGUMENTS

        case REG_.DWORD:
        case REG_.DWORD_BIG_ENDIAN:
            return Number.isFinite(data)
                ? binaryBuffer.subarray(0, binaryBuffer.writeUInt32LE(data, 0))
                : ERROR_.BAD_ARGUMENTS

        case REG_.QWORD:
            return Number.isFinite(data) || typeof data === 'bigint'
                ? binaryBuffer.subarray(0, binaryBuffer.writeBigUInt64LE(BigInt(data), 0))
                : ERROR_.BAD_ARGUMENTS

        default:
            return ERROR_.NOT_SUPPORTED
    }
}

/**
 * Enables or disables privileges in the specified access token.
 *
 * Note: in libwin32, the function returns the previous state of any privileges that the function modifies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-adjusttokenprivileges
 */
export function AdjustTokenPrivileges(tokenHandle: HTOKEN, disableAllPrivileges: boolean, newState: TOKEN_PRIVILEGES | null = null): TOKEN_PRIVILEGES | null {
    AdjustTokenPrivileges.native ??= advapi32.func('AdjustTokenPrivileges', cBOOL, [
        cHANDLE, cBOOL, koffi.pointer(cTOKEN_PRIVILEGES), cDWORD, cPVOID, koffi.out(cPDWORD)
    ])

    const pLength: OUT<number> = [0]
    const ret = AdjustTokenPrivileges.native(tokenHandle, Number(disableAllPrivileges), newState, binaryBuffer.byteLength, binaryBuffer, pLength)
    return ret ? koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES) : null
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
        koffi.out(cPPVOID)
    ])

    const subAuthorityCount = subAuthorities.length
    if (subAuthorityCount > 0 && subAuthorityCount <= 8) {
        subAuthorities.length = 8
        subAuthorities.fill(0, subAuthorityCount)

        const ppSID: OUT<unknown> = [null]
        if (AllocateAndInitializeSid.native([ identifierAuthority ], subAuthorityCount,
            subAuthorities[0], subAuthorities[1], subAuthorities[2], subAuthorities[3],
            subAuthorities[4], subAuthorities[5], subAuthorities[6], subAuthorities[7],
            ppSID
        )) {
            const sid = koffi.decode(ppSID[0], cSID)
            _FreeSid(ppSID[0])
            return sid
        }
    }
    else SetLastError(ERROR_.BAD_ARGUMENTS)
    return null
}

/**
 * Determines whether a specified security identifier (SID) is enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-checktokenmembership
 */
export function CheckTokenMembership(tokenHandle: HTOKEN | null, sidToCheck: SID): boolean | null {
    CheckTokenMembership.native ??= advapi32.func('CheckTokenMembership', cBOOL, [ cHANDLE, cPSID, koffi.out(koffi.pointer(cBOOL)) ])

    const pBool: OUT<number> = [0]
    return CheckTokenMembership.native(tokenHandle, sidToCheck, pBool) ? Boolean(pBool[0]) : null
}

/**
 * Converts a security identifier (SID) to a string format suitable for display, storage, or transmission.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/sddl/nf-sddl-convertsidtostringsidw
 */
export function ConvertSidToStringSid(sid: SID): string | null {
    ConvertSidToStringSid.native ??= advapi32.func('ConvertSidToStringSidW', cBOOL, [
        cPSID, koffi.out(koffi.pointer(cLocalAllocatedString))
    ])

    const pStr: OUT<string> = [null!]
    return ConvertSidToStringSid.native(sid, pStr) ? pStr[0] : null
}

/**
 * Converts a string-format security identifier (SID) into a valid, functional SID.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/sddl/nf-sddl-convertstringsidtosidw
 */
export function ConvertStringSidToSid(stringSid: string): SID | null {
    ConvertStringSidToSid.native ??= advapi32.func('ConvertStringSidToSidW', cBOOL, [ cSTR, koffi.out(cPPVOID) ])

    const ppSID: OUT<unknown> = [null]
    if (ConvertStringSidToSid.native(stringSid, ppSID)) {
        const sid = koffi.decode(ppSID[0], cSID)
        LocalFree(ppSID[0])
        return sid
    }
    return null
}

/**
 * Copies a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-copysid
 */
export function CopySid(sourceSid: SID): SID | null {
    CopySid.native ??= advapi32.func('CopySid', cBOOL, [ cDWORD, koffi.out(cPVOID), cPSID ])
    return CopySid.native(binaryBuffer.length, binaryBuffer, sourceSid) ? koffi.decode(binaryBuffer, cSID) : null
}

/**
 * Creates a SID for predefined aliases.
 *
 * Note: libwin32 does not include the 100+ predefined types enumeration, see the complete list at
 *       https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-well_known_sid_type
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-createwellknownsid
 */
export function CreateWellKnownSid(wellKnownSidType: number, domainSid?: SID): SID | null {
    CreateWellKnownSid.native ??= advapi32.func('CreateWellKnownSid', cBOOL, [ cINT, cPSID, koffi.out(cPVOID), koffi.inout(cPDWORD) ])

    const pCbSid: OUT<number> = [binaryBuffer.length]
    return CreateWellKnownSid.native(wellKnownSidType, domainSid, binaryBuffer, pCbSid) ? koffi.decode(binaryBuffer, cSID) : null
}

/**
 * Tests two security identifier (SID) values for equality.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-equalsid
 */
export function EqualSid(sid1: SID, sid2: SID): boolean {
    EqualSid.native ??= advapi32.func('EqualSid', cBOOL, [ cPSID, cPSID ])
    return EqualSid.native(sid1, sid2) !== 0
}

/**
 * Frees a security identifier (SID) previously allocated by using the {@link AllocateAndInitializeSid()} function.
 *
 * Note: in libwin32, `AllocateAndInitializeSid()` immediately frees the allocated memory, so this function is a NOOP.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-freesid
 */
export function FreeSid(_sid: SID): boolean {
    return true
}

/**
 * Returns the length, in bytes, of a valid security identifier.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-getlengthsid
 */
export function GetLengthSid(sid: SID): number {
    GetLengthSid.native ??= advapi32.func('GetLengthSid', cDWORD, [ cPSID ])
    return GetLengthSid.native(sid)
}

/**
 * Retrieves a `TokenAccessInformation` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenAccessInformation)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAccessInformation(tokenHandle: HTOKEN): TOKEN_ACCESS_INFORMATION | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAccessInformation)
}

/**
 * Retrieves a `TokenAppContainerNumber` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenAppContainerNumber)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerNumberInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAppContainerNumber)
}

/**
 * Retrieves a `TokenAppContainerSid` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenAppContainerSid)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerSidInformation(tokenHandle: HTOKEN): TOKEN_APPCONTAINER_INFORMATION | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAppContainerSid)
}

/**
 * Retrieves a `TokenCapabilities` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenCapabilities)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenCapabilitiesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenCapabilities)
}

/**
 * Retrieves a `TokenDefaultDacl` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenDefaultDacl)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDefaultDaclInformation(tokenHandle: HTOKEN): TOKEN_DEFAULT_DACL | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDefaultDacl)
}

/**
 * Retrieves a `TokenDeviceClaimAttributes` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenDeviceClaimAttributes)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes)
}

/**
 * Retrieves a `TokenDeviceGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenDeviceGroups)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDeviceGroups)
}

/**
 * Retrieves a `TokenElevation` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenElevation)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationInformation(tokenHandle: HTOKEN): TOKEN_ELEVATION | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenElevation)
}

/**
 * Retrieves a `TokenElevationType` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenElevationType)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationTypeInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenElevationType)
}

/**
 * Retrieves a `TokenGroupsAndPrivileges` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenGroupsAndPrivileges)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsAndPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS_AND_PRIVILEGES | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges)
}

/**
 * Retrieves `TokenGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenGroups)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenGroups)
}

/**
 * Retrieves a `TokenHasRestrictions` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenHasRestrictions)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenHasRestrictionsInformation(tokenHandle: HTOKEN): TOKEN_TYPE | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenHasRestrictions)
}

/**
 * Retrieves a `TokenImpersonationLevel` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenImpersonationLevel)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenImpersonationLevelInformation(tokenHandle: HTOKEN): SECURITY_IMPERSONATION_LEVEL | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenImpersonationLevel)
}

/**
 * Retrieves a `TokenIntegrityLevel` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenIntegrityLevel)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIntegrityLevelInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_LABEL | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenIntegrityLevel)
}

/**
 * Retrieves a `TokenIsAppContainer` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenIsAppContainer)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIsAppContainerInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenIsAppContainer)
}

/**
 * Retrieves a `TokenLinkedToken` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenLinkedToken)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLinkedTokenInformation(tokenHandle: HTOKEN): TOKEN_LINKED_TOKEN | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenLinkedToken)
}

/**
 * Retrieves a `TokenLogonSid` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenLogonSid)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLogonSidInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenLogonSid)
}

/**
 * Retrieves a `TokenMandatoryPolicy` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenMandatoryPolicy)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenMandatoryPolicyInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_POLICY | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy)
}

/**
 * Retrieves a `TokenOrigin` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenOrigin)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOriginInformation(tokenHandle: HTOKEN): TOKEN_ORIGIN | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenOrigin)
}

/**
 * Retrieves a `TokenOwner` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenOwner)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOwnerInformation(tokenHandle: HTOKEN): TOKEN_OWNER | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenOwner)
}

/**
 * Retrieves a `TokenPrimaryGroup` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenPrimaryGroup)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrimaryGroupInformation(tokenHandle: HTOKEN): TOKEN_PRIMARY_GROUP | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenPrimaryGroup)
}

/**
 * Retrieves a `TokenPrivileges` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenPrivileges)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_PRIVILEGES | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenPrivileges)
}

/**
 * Retrieves a `TokenRestrictedDeviceGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenRestrictedDeviceGroups)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups)
}

/**
 * Retrieves a `TokenRestrictedSids` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenRestrictedSids)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedSidsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenRestrictedSids)
}

/**
 * Retrieves a `TokenSandBoxInert` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenSandBoxInert)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSandBoxInertInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSandBoxInert)
}

/**
 * Retrieves a `TokenSessionId` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenSessionId)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSessionIdInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSessionId)
}

/**
 * Retrieves a `TokenSource` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenSource)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSourceInformation(tokenHandle: HTOKEN): TOKEN_SOURCE | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSource)
}

/**
 * Retrieves a `TokenStatistics` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenStatistics)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenStatisticsInformation(tokenHandle: HTOKEN): TOKEN_STATISTICS | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenStatistics)
}

/**
 * Retrieves `TokenType` specified class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenType)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenTypeInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenType)
}

/**
 * Retrieves a `TokenUIAccess` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenUIAccess)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUIAccessInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUIAccess)
}

/**
 * Retrieves a `TokenUserClaimAttributes` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenUserClaimAttributes)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes)
}

/**
 * Retrieves `TokenUser` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenUser)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserInformation(tokenHandle: HTOKEN): TOKEN_USER | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUser)
}

/**
 * Retrieves a `TokenVirtualizationAllowed` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenVirtualizationAllowed)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationAllowedInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed)
}

/**
 * Retrieves a `TokenVirtualizationEnabled` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * Note: this function is a libwin32 stub for `GetTokenInformation(tokenHandle, TOKEN_ACCESS_INFORMATION.TokenVirtualizationEnabled)`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationEnabledInformation(tokenHandle: HTOKEN): number | null {
    return GetTokenInformation(tokenHandle, TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled)
}

/**
 * Retrieves a specified class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUser):                   TOKEN_USER | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenGroups):                 TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenPrivileges):             TOKEN_PRIVILEGES | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenOwner):                  TOKEN_OWNER | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenPrimaryGroup):           TOKEN_PRIMARY_GROUP | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDefaultDacl):            TOKEN_DEFAULT_DACL | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSource):                 TOKEN_SOURCE | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenType):                   number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenImpersonationLevel):     number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenStatistics):             TOKEN_STATISTICS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenRestrictedSids):         TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSessionId):              number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges):    TOKEN_GROUPS_AND_PRIVILEGES | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSandBoxInert):           number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenOrigin):                 TOKEN_ORIGIN | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenElevationType):          number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenLinkedToken):            TOKEN_LINKED_TOKEN | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenElevation):              TOKEN_ELEVATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenHasRestrictions):        number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAccessInformation):      TOKEN_ACCESS_INFORMATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed):  number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled):  number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenIntegrityLevel):         TOKEN_MANDATORY_LABEL | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUIAccess):               number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy):        TOKEN_MANDATORY_POLICY | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenLogonSid):               TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenIsAppContainer):         number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenCapabilities):           TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAppContainerSid):        TOKEN_APPCONTAINER_INFORMATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAppContainerNumber):     number | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes):    CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes):  CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDeviceGroups):           TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups): TOKEN_GROUPS | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS): any
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS) {
    GetTokenInformation.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(cPDWORD) ])

    const pLength: OUT<number> = [0]
    if (!GetTokenInformation.native(tokenHandle, tokenInformationClass, binaryBuffer, binaryBuffer.byteLength, pLength))
        return null

    switch (tokenInformationClass as number) {
        case TOKEN_INFORMATION_CLASS.TokenUser: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_USER) as TOKEN_USER
            if (isPointer(ret.User.Sid))
                ret.User.Sid = koffi.decode(ret.User.Sid, cSID)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedSids:
        case TOKEN_INFORMATION_CLASS.TokenLogonSid:
        case TOKEN_INFORMATION_CLASS.TokenCapabilities:
        case TOKEN_INFORMATION_CLASS.TokenDeviceGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_GROUPS) as TOKEN_GROUPS
            for (let i = 0; i < ret.GroupCount; i++) {
                if (isPointer(ret.Groups[i].Sid))
                    ret.Groups[i].Sid = koffi.decode(ret.Groups[i].Sid, cSID)
            }
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrivileges:
            return koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES) as TOKEN_PRIVILEGES

        case TOKEN_INFORMATION_CLASS.TokenOwner: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_OWNER) as TOKEN_OWNER
            if (isPointer(ret.Owner))
                ret.Owner = koffi.decode(ret.Owner, cSID)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrimaryGroup: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_PRIMARY_GROUP) as TOKEN_PRIMARY_GROUP
            if (isPointer(ret.PrimaryGroup))
                ret.PrimaryGroup = koffi.decode(ret.PrimaryGroup, cSID)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenDefaultDacl: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_DEFAULT_DACL) as TOKEN_DEFAULT_DACL
            if (isPointer(ret.DefaultDacl))
                ret.DefaultDacl = koffi.decode(ret.DefaultDacl, cACL)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenSource:
            return koffi.decode(binaryBuffer, cTOKEN_SOURCE) as TOKEN_SOURCE

        case TOKEN_INFORMATION_CLASS.TokenType:
        case TOKEN_INFORMATION_CLASS.TokenImpersonationLevel:
        case TOKEN_INFORMATION_CLASS.TokenSessionId:
        case TOKEN_INFORMATION_CLASS.TokenSandBoxInert:
        case TOKEN_INFORMATION_CLASS.TokenElevationType:
        case TOKEN_INFORMATION_CLASS.TokenHasRestrictions:
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed:
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled:
        case TOKEN_INFORMATION_CLASS.TokenUIAccess:
        case TOKEN_INFORMATION_CLASS.TokenIsAppContainer:
        case TOKEN_INFORMATION_CLASS.TokenAppContainerNumber:
            return binaryBuffer.readUInt32LE(0)

        case TOKEN_INFORMATION_CLASS.TokenStatistics:
            return koffi.decode(binaryBuffer, cTOKEN_STATISTICS) as TOKEN_STATISTICS

        case TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_GROUPS_AND_PRIVILEGES) as TOKEN_GROUPS_AND_PRIVILEGES
            for (let i = 0; i < ret.SidCount; i++) {
                if (isPointer(ret.Sids[i].Sid))
                    ret.Sids[i].Sid = koffi.decode(ret.Sids[i].Sid, cSID)
            }
            for (let i = 0; i < ret.RestrictedSidCount; i++) {
                if (isPointer(ret.RestrictedSids[i].Sid))
                    ret.RestrictedSids[i].Sid = koffi.decode(ret.RestrictedSids[i].Sid, cSID)
            }
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenOrigin:
            return koffi.decode(binaryBuffer, cTOKEN_ORIGIN) as TOKEN_ORIGIN

        case TOKEN_INFORMATION_CLASS.TokenLinkedToken:
            return koffi.decode(binaryBuffer, cTOKEN_LINKED_TOKEN) as TOKEN_LINKED_TOKEN

        case TOKEN_INFORMATION_CLASS.TokenElevation:
            return koffi.decode(binaryBuffer, cTOKEN_ELEVATION) as TOKEN_ELEVATION

        case TOKEN_INFORMATION_CLASS.TokenAccessInformation: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_ACCESS_INFORMATION) as TOKEN_ACCESS_INFORMATION
            if (isPointer(ret.SidHash))
                ret.SidHash = decodeSidAndAttributesHash(ret.SidHash)
            if (isPointer(ret.RestrictedSidHash))
                ret.RestrictedSidHash = decodeSidAndAttributesHash(ret.RestrictedSidHash)
            if (isPointer(ret.Privileges))
                ret.Privileges = koffi.decode(ret.Privileges, cTOKEN_PRIVILEGES)
            if (isPointer(ret.PackageSid))
                ret.PackageSid = koffi.decode(ret.PackageSid, cSID)
            if (isPointer(ret.CapabilitiesHash))
                ret.CapabilitiesHash = decodeSidAndAttributesHash(ret.CapabilitiesHash)
            if (isPointer(ret.TrustLevelSid))
                ret.TrustLevelSid = koffi.decode(ret.TrustLevelSid, cSID)
            ret.SecurityAttributes = null   // Reserved. Must be set to NULL.
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenIntegrityLevel: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_MANDATORY_LABEL) as TOKEN_MANDATORY_LABEL
            if (isPointer(ret.Label.Sid))
                ret.Label.Sid = koffi.decode(ret.Label.Sid, cSID)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy:
            return koffi.decode(binaryBuffer, cTOKEN_MANDATORY_POLICY) as TOKEN_MANDATORY_POLICY

        case TOKEN_INFORMATION_CLASS.TokenAppContainerSid: {
            const ret = koffi.decode(binaryBuffer, cTOKEN_APPCONTAINER_INFORMATION) as TOKEN_APPCONTAINER_INFORMATION
            if (isPointer(ret.TokenAppContainer))
                ret.TokenAppContainer = koffi.decode(ret.TokenAppContainer, cSID)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes:
        case TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes: {
            const ret = koffi.decode(binaryBuffer, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION) as CLAIM_SECURITY_ATTRIBUTES_INFORMATION
            if (ret.Attribute?.pAttributeV1)
                ret.Attribute.pAttributeV1 = koffi.decode(ret.Attribute, cCLAIM_SECURITY_ATTRIBUTE_V1, ret.AttributeCount)
            else
                ret.Attribute = { pAttributeV1: [] }
            return ret
        }

        // Dismiss all other cases
        default:
            SetLastError(ERROR_.NOT_SUPPORTED)
            return null
    }

    function decodeSidAndAttributesHash(ptr: Pointer | Buffer<ArrayBuffer>): SID_AND_ATTRIBUTES_HASH {
        const ret = koffi.decode(ptr, cSID_AND_ATTRIBUTES_HASH) as SID_AND_ATTRIBUTES_HASH
        for (let i = 0; i < ret.SidCount; i++) {
            if (isPointer(ret.SidAttr[i]))
                ret.SidAttr[i].Sid = koffi.decode(ret.SidAttr[i].Sid, cSID)
        }
        // Don't decode the Hash array
        return ret
    }
}

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPVOID, koffi.inout(cPDWORD) ])

    const name = new StringOutputBuffer(Internals.UNLEN + 1)
    return GetUserName.native(name.buffer, name.pLength) !== 0
        ? name.decode(name.length - 1)   // GetUserName() returned length includes the final \0
        : null
}

/**
 * Compares a SID to a well-known SID and returns TRUE if they match.
 *
 * Note: libwin32 does not include the 100+ predefined types enumeration, see the complete list at
 *       https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-well_known_sid_type
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-iswellknownsid
 */
export function IsWellKnownSid(sid: SID, wellKnownSidType: number): boolean {
    IsWellKnownSid.native ??= advapi32.func('IsWellKnownSid', cBOOL, [ cPSID, cINT ])
    return IsWellKnownSid.native(sid, wellKnownSidType) !== 0
}

/**
 * Retrieves a security identifier (SID) for the account and the name of the domain on which the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountnamew
 */
export function LookupAccountName(systemName: string | null, accountName: string): LookupAccountNameResult | null {
    LookupAccountName.native ??= advapi32.func('LookupAccountNameW', cBOOL, [
        cSTR, cSTR, koffi.out(cPSID), koffi.inout(cPDWORD), cPVOID, koffi.inout(cPDWORD), koffi.out(koffi.pointer(cINT))
    ])

    const sid = {} as SID
    const pCbSid: OUT<number> = [koffi.sizeof(cSID)]
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const pUse: OUT<number> = [0]
    if (LookupAccountName.native(systemName, accountName, sid, pCbSid, domain.buffer, domain.pLength, pUse)) {
        return {
            sid,
            referencedDomainName: domain.decode(),
            use: pUse[0]
        }
    }
    return null
}

export interface LookupAccountNameResult {
    sid: SID,
    referencedDomainName: string
    use: SID_NAME_USE
}

/**
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(systemName: string | null, sid: SID): LookupAccountSidResult | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [
        cSTR, cPSID, cPVOID, koffi.inout(cPDWORD), cPVOID, koffi.inout(cPDWORD), koffi.out(koffi.pointer(cINT))
    ])

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
 * LookupAccountSidLocal is defined as a function that calls LookupAccountSid with `null` as the first parameter.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidlocalw
 */
export function LookupAccountSidLocal(sid: SID): LookupAccountSidResult | null {
    return LookupAccountSid(null, sid)
}

/**
 * Retrieves the name that corresponds to the privilege represented on a specific system by a specified locally unique identifier (LUID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegenamew
 */
export function LookupPrivilegeName(systemName: string | null, luid: LUID): string | null {
    LookupPrivilegeName.native ??= advapi32.func('LookupPrivilegeNameW', cBOOL, [ cSTR, koffi.pointer(cLUID), cPVOID, koffi.inout(cPDWORD) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    return LookupPrivilegeName.native(systemName, luid, name.buffer, name.pLength) ? name.decode() : null
}

/**
 * Retrieves the locally unique identifier (LUID) used on a specified system to locally represent the specified privilege name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegevaluew
 */
export function LookupPrivilegeValue(systemName: string | null, name: SE_NAME): LUID | null {
    LookupPrivilegeValue.native ??= advapi32.func('LookupPrivilegeValueW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cLUID)) ])

    const LUID = {} as LUID
    return LookupPrivilegeValue.native(systemName, name, LUID) ? LUID : null
}

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
 * Enumerates the privileges assigned to an account.
 *
 * You must run the process "As Administrator" so that the call doesn't fail with ERROR_ACCESS_DENIED.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaenumerateaccountrights
 */
export function LsaEnumerateAccountRights(policyHandle: LSA_HANDLE, accountSid: SID): LSA_UNICODE_STRING[] | NTSTATUS_ {
    LsaEnumerateAccountRights.native ??= advapi32.func('LsaEnumerateAccountRights', cNTSTATUS, [
        cHANDLE, koffi.pointer(cSID), koffi.out(cPPVOID), koffi.out(cPDWORD)
    ])

    const pUserRights: OUT<Pointer> = [null!]
    const pCountOfRights: OUT<number> = [0]
    const status = LsaEnumerateAccountRights.native(policyHandle, accountSid, pUserRights, pCountOfRights)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const ret = koffi.decode(pUserRights[0], cLSA_UNICODE_STRING, pCountOfRights[0])
        return ret
    }
    return status
}

/**
 * Frees memory allocated for an output buffer by an LSA function call.
 *
 * Note: in libwin32, all LSA functions automatically free the memory they allocate, so this function is a NOOP.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsafreememory
 */
export function LsaFreeMemory(buffer: unknown): NTSTATUS_ {
    return NTSTATUS_.SUCCESS
}

/**
 * Retrieves the security identifiers (SIDs) for specified account names in any domain in a Windows forest.
 *
 * Notes:
 * - in libwin32, LsaLookupNames2() accepts 1 to 8 names max. The function fails with `NTSTATUS_.INVALID_PARAMETER`
 *   if there are less than 1 or more than 8 name parameters.
 * - any memory allocated by the system is immediately returned to the system. The net effect is that you don't need
 *   to call {@link LsaFreeMemory()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsalookupnames2
 */
export function LsaLookupNames2(policyHandle: LSA_HANDLE, flags: LSA_LOOKUP, ...names: string[]): LsaLookupNames2Result | NTSTATUS_ {
    LsaLookupNames2.native ??= advapi32.func('LsaLookupNames2', cNTSTATUS, [
        cHANDLE, cULONG, cULONG, koffi.pointer(koffi.array(cLSA_UNICODE_STRING, Internals.LSALOOKUPNAMES2_MAX_NAMES)),
        koffi.out(cPPVOID), koffi.out(cPPVOID)
    ])

    const numNames = names.length
    if (numNames < 1 || numNames > Internals.LSALOOKUPNAMES2_MAX_NAMES)
        return NTSTATUS_.INVALID_PARAMETER

    names.length = Internals.LSALOOKUPNAMES2_MAX_NAMES
    names.fill('', numNames)

    const unicodeNames = names.map(name => new LSA_UNICODE_STRING(name))
    const pReferencedDomains: OUT<Pointer> = [0n]
    const pSids: OUT<Pointer> = [0n]

    const status = LsaLookupNames2.native(policyHandle, flags, numNames, [unicodeNames], pReferencedDomains, pSids)
    if (status === Internals.NTSTATUS_SUCCESS) {
        const sids = koffi.decode(pSids[0], cLSA_TRANSLATED_SID2, numNames) as LSA_TRANSLATED_SID2[]
        for (let i = 0; i < numNames; i++) {
            if (isPointer(sids[i].Sid))
                sids[i].Sid = koffi.decode(sids[i].Sid, cSID)
        }
        _LsaFree(pSids[0])

        const domains = koffi.decode(pReferencedDomains[0], cLSA_REFERENCED_DOMAIN_LIST) as LSA_REFERENCED_DOMAIN_LIST
        for (let i = 0; i < domains.Domains.length; i++) {
            if (isPointer(domains.Domains[i].Sid))
                domains.Domains[i].Sid = koffi.decode(domains.Domains[i].Sid, cSID)
        }
        _LsaFree(pReferencedDomains[0])

        return { sids, domains }
    }

    if (status === NTSTATUS_.NONE_MAPPED || status === NTSTATUS_.SOME_NOT_MAPPED) {
        _LsaFree(pSids[0])
        _LsaFree(pReferencedDomains[0])
    }

    return status
}

export interface LsaLookupNames2Result {
    sids: LSA_TRANSLATED_SID2[]
    domains: LSA_REFERENCED_DOMAIN_LIST
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
export function LsaOpenPolicy(systemName: LSA_UNICODE_STRING | string | null, desiredAccess: POLICY_): LSA_HANDLE | NTSTATUS_ {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

    const name = systemName instanceof LSA_UNICODE_STRING ? systemName
        : typeof systemName === 'string' ? new LSA_UNICODE_STRING(systemName)
        : null
    const pHandle: OUT<LSA_HANDLE> = [null!]
    const ret = LsaOpenPolicy.native(name, new LSA_OBJECT_ATTRIBUTES(), desiredAccess, pHandle)
    return ret === 0 ? pHandle[0] : ret
}

/**
 * Retrieves the name and SID of the system's account domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryAccountDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation)
}

/**
 * Retrieves the system's auditing rules.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryAuditEventsInformationPolicy(policyHandle: LSA_HANDLE): POLICY_AUDIT_EVENTS_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)
}

/**
 * Query Domain Name System (DNS) information about the account domain associated with a Policy object.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryDnsDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_DNS_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation)
}

/**
 * Query the role of an LSA server.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryLsaServerRoleInformationPolicy(policyHandle: LSA_HANDLE): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation)
}

/**
 * Retrieves information about the creation time and last modification of the LSA database.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyModificationInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryModificationInformationPolicy(policyHandle: LSA_HANDLE): POLICY_MODIFICATION_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyModificationInformation)
}

/**
 * Retrieves the name and SID of the system's primary domain.
 *
 * Note: this function is a libwin32 stub for `LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)`
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryPrimaryDomainInformationPolicy(policyHandle: LSA_HANDLE): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_ {
    return LsaQueryInformationPolicy(policyHandle, POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation)
}

/**
 * Retrieves information about a Policy object.
 *
 * Notes:
 * - In libwin32, the function only supports the values of the `POLICY_INFORMATION_CLASS` enumeration
 *   that are listed on the function's doc (link below).
 * - All other POLICY_INFORMATION_CLASS values return `STATUS_NOT_SUPPORTED`
 * - Values outside the enumeration return STATUS_INVALID_PARAMETER.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaqueryinformationpolicy
 */
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation):   POLICY_AUDIT_EVENTS_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation): POLICY_PRIMARY_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation): POLICY_ACCOUNT_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation): POLICY_LSA_SERVER_ROLE_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyModificationInformation):  POLICY_MODIFICATION_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation):     POLICY_DNS_DOMAIN_INFO | NTSTATUS_
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS): any
export function LsaQueryInformationPolicy(policyHandle: LSA_HANDLE, infoClass: POLICY_INFORMATION_CLASS) {
    LsaQueryInformationPolicy.native ??= advapi32.func('LsaQueryInformationPolicy', cNTSTATUS, [ cHANDLE, cINT, koffi.out(cPPVOID) ])

    const pBuffer: OUT<Pointer> = [0n]
    const status = LsaQueryInformationPolicy.native(policyHandle, infoClass, pBuffer)
    if (status !== NTSTATUS_.SUCCESS)
        return status

    switch (infoClass) {
        case POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_AUDIT_EVENTS_INFO) as POLICY_AUDIT_EVENTS_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyPrimaryDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_PRIMARY_DOMAIN_INFO) as POLICY_PRIMARY_DOMAIN_INFO
            ret.Sid = koffi.decode(ret.Sid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyAccountDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_ACCOUNT_DOMAIN_INFO) as POLICY_ACCOUNT_DOMAIN_INFO
            if (isPointer(ret.DomainSid))
                ret.DomainSid = koffi.decode(ret.DomainSid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyLsaServerRoleInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_LSA_SERVER_ROLE_INFO) as POLICY_LSA_SERVER_ROLE_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyModificationInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_MODIFICATION_INFO) as POLICY_MODIFICATION_INFO
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformation: {
            const ret = koffi.decode(pBuffer[0], cPOLICY_DNS_DOMAIN_INFO) as POLICY_DNS_DOMAIN_INFO
            if (isPointer(ret.Sid))
                ret.Sid = koffi.decode(ret.Sid, cSID)
            return _LsaFree(pBuffer[0]), ret
        }

        case POLICY_INFORMATION_CLASS.PolicyAuditLogInformation:
        case POLICY_INFORMATION_CLASS.PolicyPdAccountInformation:
        case POLICY_INFORMATION_CLASS.PolicyReplicaSourceInformation:
        case POLICY_INFORMATION_CLASS.PolicyDefaultQuotaInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullSetInformation:
        case POLICY_INFORMATION_CLASS.PolicyAuditFullQueryInformation:
        case POLICY_INFORMATION_CLASS.PolicyDnsDomainInformationInt:
        case POLICY_INFORMATION_CLASS.PolicyLocalAccountDomainInformation:
        case POLICY_INFORMATION_CLASS.PolicyMachineAccountInformation:
            if (pBuffer[0] !== 0n)
                _LsaFree(pBuffer[0])
            return NTSTATUS_.NOT_SUPPORTED

        default:
            if (pBuffer[0] !== 0n)
                _LsaFree(pBuffer[0])
            return NTSTATUS_.INVALID_PARAMETER
    }
}

/**
 * Opens the access token associated with a process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function OpenProcessToken(processHandle: HANDLE, desiredAccess: TOKEN_): HTOKEN | null {
    OpenProcessToken.native ??= advapi32.func('OpenProcessToken', cBOOL, [ cHANDLE, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HTOKEN> = [null!]
    return OpenProcessToken.native(processHandle, desiredAccess, pHandle) !== 0
        ? pHandle[0]
        : null
}

/**
 * Determines whether a specified set of privileges are enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-privilegecheck
 */
export function PrivilegeCheck(clientToken: HANDLE, requiredPrivileges: PRIVILEGE_SET): boolean | null {
    PrivilegeCheck.native ??= advapi32.func('PrivilegeCheck', cBOOL, [ cHANDLE, koffi.inout(koffi.pointer(cPRIVILEGE_SET)), koffi.out(koffi.pointer(cBOOL)) ])

    const pfResult: OUT<number> = [0]
    return PrivilegeCheck.native(clientToken, requiredPrivileges, pfResult) !== 0
        ? Boolean(pfResult[0])
        : null
}


/**
 * Closes a handle to the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regclosekey
 */
export function RegCloseKey(hKey: HKEY): LSTATUS {
    RegCloseKey.native ??= advapi32.func('RegCloseKey', cLSTATUS, [ cHANDLE ])
    return RegCloseKey.native(hKey)
}

/**
 * Establishes a connection to a predefined registry key on another computer.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regconnectregistryw
 */
export function RegConnectRegistry(machineName: string, hKey: HKEY | HKEY_): HKEY | LSTATUS {
    RegConnectRegistry.native ??= advapi32.func('RegConnectRegistryW', cLSTATUS, [ cSTR, cHANDLE, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HKEY> = [null!]
    return RegConnectRegistry.native(machineName, hKey, pHandle) || pHandle[0]
}

/**
 * Copies the specified registry key, along with its values and subkeys, to the specified destination key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regcopytreew
 */
export function RegCopyTree(hKeySrc: HKEY | HKEY_, subKey: string | null, hKeyDest: HKEY | HKEY_): LSTATUS {
    RegCopyTree.native ??= advapi32.func('RegCopyTreeW', cLSTATUS, [ cHANDLE, cSTR, cHANDLE ])
    return RegCopyTree.native(hKeySrc, subKey, hKeyDest)
}

/**
 * Creates the specified registry key. If the key already exists, the function opens it.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regcreatekeyexw
 */
export function RegCreateKeyEx(
    hKey: HKEY | HKEY_, subKey: string, className: string | null, options: REG_OPTION_, samDesired: KEY_,
    securityAttributes: SECURITY_ATTRIBUTES | null
): HKEY | LSTATUS {
    RegCreateKeyEx.native ??= advapi32.func('RegCreateKeyExW', cLSTATUS, [
        cHANDLE, cSTR, cDWORD, cSTR, cDWORD, cDWORD,
        koffi.pointer(cSECURITY_ATTRIBUTES), koffi.out(koffi.pointer(cHANDLE)), koffi.out(cPDWORD)
    ])

    const pHandle: OUT<HKEY> = [null!]
    return RegCreateKeyEx.native(hKey, subKey, 0, className, options, samDesired, securityAttributes, pHandle, null) || pHandle[0]
}

/**
 * Deletes a subkey and its values.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletekeyw
 */
export function RegDeleteKey(hKey: HKEY | HKEY_, subKey: string): LSTATUS {
    RegDeleteKey.native ??= advapi32.func('RegDeleteKeyW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegDeleteKey.native(hKey, subKey)
}

/**
 * Deletes a subkey and its values from the specified platform-specific view of the registry.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletekeyexw
 */
export function RegDeleteKeyEx(hKey: HKEY | HKEY_, subKey: string, samDesired: KEY_): LSTATUS {
    RegDeleteKeyEx.native ??= advapi32.func('RegDeleteKeyExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD ])
    return RegDeleteKeyEx.native(hKey, subKey, samDesired, 0)
}

/**
 * Removes the specified value from the specified registry key and subkey.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletekeyvaluew
 */
export function RegDeleteKeyValue(hKey: HKEY | HKEY_, subKey: string | null = null, valueName: string | null = null): LSTATUS {
    RegDeleteKeyValue.native ??= advapi32.func('RegDeleteKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR ])
    return RegDeleteKeyValue.native(hKey, subKey, valueName)
}

/**
 * Deletes the subkeys and values of the specified key recursively.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletetreew
 */
export function RegDeleteTree(hKey: HKEY | HKEY_, subKey: string | null = null): LSTATUS {
    RegDeleteTree.native ??= advapi32.func('RegDeleteTreeW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegDeleteTree.native(hKey, subKey)
}

/**
 * Removes a named value from the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletevaluew
 */
export function RegDeleteValue(hKey: HKEY | HKEY_, valueName: string | null = null): LSTATUS {
    RegDeleteValue.native ??= advapi32.func('RegDeleteValueW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegDeleteValue.native(hKey, valueName)
}

/**
 * Enumerates the subkeys of the specified open registry key. The function retrieves information about one subkey
 * each time it is called.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumkeyexw
 */
export function RegEnumKeyEx(hKey: HKEY | HKEY_, index: number): RegEnumKeyExResult | LSTATUS {
    RegEnumKeyEx.native ??= advapi32.func('RegEnumKeyExW', cLSTATUS, [
        cHANDLE, cDWORD, cPVOID, koffi.inout(cPDWORD), cPDWORD, cPVOID, koffi.inout(cPDWORD), koffi.pointer(cFILETIME)
    ])

    const name = new StringOutputBuffer(Internals.MAX_KEY_LENGTH + 1)
    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const lastWriteTime = {} as FILETIME
    return RegEnumKeyEx.native(hKey, index, name.buffer, name.pLength, null, className.buffer, className.pLength, lastWriteTime) || {
        name: name.decode(),
        className: className.decode(),
        lastWriteTime
    }
}

export interface RegEnumKeyExResult {
    name: string
    className: string
    lastWriteTime: FILETIME
}

/**
 * Enumerates the values for the specified open registry key.
 *
 * Note: in libwin32, this function doest not return the value's data, only its type and size (in bytes).
 *       Use {@link RegGetValue()} to actually read the data.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumvaluew
 */
export function RegEnumValue(hKey: HKEY | HKEY_, index: number): RegEnumValueResult | LSTATUS {
    RegEnumValue.native ??= advapi32.func('RegEnumValueW', cLSTATUS, [
        cHANDLE, cDWORD, cPVOID, koffi.inout(cPDWORD), cPVOID, koffi.out(cPDWORD), cPVOID, koffi.inout(cPDWORD)
    ])

    const name = new StringOutputBuffer(Internals.MAX_KEY_LENGTH + 1)
    const pType: OUT<REG_> = [0]
    const pSize: OUT<number> = [0]
    return RegEnumValue.native(hKey, index, name.buffer, name.pLength, null, pType, null, pSize) || {
        name: name.decode(),
        type: pType[0],
        size: pSize[0]
    }
}

export interface RegEnumValueResult {
    name: string
    type: REG_
    size: number
}

/**
 * Writes all the attributes of the specified open registry key into the registry.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regflushkey
 */
export function RegFlushKey(hKey: HKEY | HKEY_): LSTATUS {
    RegFlushKey.native ??= advapi32.func('RegFlushKey', cLSTATUS, [ cHANDLE ])
    return RegFlushKey.native(hKey)
}

/**
 * Retrieves the type and data for the specified registry value.
 *
 * Notes:
 * - In libwin32, only `REG_NONE`, `REG_SZ`, `REG_EXPAND_SZ`, `REG_MULTI_SZ`,
 *   `REG_BINARY`, `REG_DWORD`, `REG_DWORD_BIG_ENDIAN` and `REG_QWORD`
 *   are supported. All other types return `ERROR_NOT_SUPPORTED`.
 * - `REG_BINARY` values are returned as a `Buffer`.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-reggetvaluew
 */
export function RegGetValue(hKey: HKEY | HKEY_, subKey: string | null, value: string | null, flags: RRF_): RegGetValueResult | LSTATUS {
    RegGetValue.native ??= advapi32.func('RegGetValueW', cLSTATUS, [
        cHANDLE, cSTR, cSTR, cDWORD, koffi.out(cPDWORD), cPVOID, koffi.inout(cPDWORD)
    ])

    const pType: OUT<REG_> = [0]
    const pCount: OUT<number> = [binaryBuffer.byteLength]
    const status = RegGetValue.native(hKey, subKey, value, flags, pType, binaryBuffer, pCount)
    if (status === Internals.ERROR_SUCCESS) {
        const type = pType[0]
        const count = pCount[0]
        switch (type) {
            case REG_.NONE:
                return { type, value: null }

            case REG_.SZ:
            case REG_.EXPAND_SZ:
                return { type, value: textDecoder.decode(binaryBuffer.subarray(0, count - 2)) }

            case REG_.MULTI_SZ:
                return { type, value: textDecoder.decode(binaryBuffer.subarray(0, count - 4)).split('\0') }

            case REG_.BINARY:
                return { type, value: Buffer.from(binaryBuffer.subarray(0, count)) }

            case REG_.DWORD:
            case REG_.DWORD_BIG_ENDIAN:
                return { type, value: binaryBuffer.readUInt32LE(0) }

            case REG_.QWORD:
                return { type, value: binaryBuffer.readBigUInt64LE(0) }

            default:
                return ERROR_.NOT_SUPPORTED
        }
    }
    return status
}

export type RegGetValueResult =
    | { type: REG_.NONE,             value: null     }
    | { type: REG_.SZ,               value: string   }
    | { type: REG_.EXPAND_SZ,        value: string   }
    | { type: REG_.MULTI_SZ,         value: string[] }
    | { type: REG_.BINARY,           value: Buffer   }
    | { type: REG_.DWORD,            value: number   }
    | { type: REG_.DWORD_BIG_ENDIAN, value: number   }
    | { type: REG_.QWORD,            value: bigint   }

/**
 * Loads the specified registry hive as an application hive.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regloadappkeyw
 */
export function RegLoadAppKey(file: string, samDesired: KEY_, options: number): HKEY | LSTATUS {
    RegLoadAppKey.native ??= advapi32.func('RegLoadAppKeyW', cLSTATUS, [
        cSTR, koffi.out(koffi.pointer(cHANDLE)), cDWORD, cDWORD, cDWORD
    ])
    const pHandle: OUT<HKEY> = [null!]
    return RegLoadAppKey.native(file, pHandle, samDesired, options, 0) || pHandle[0]
}

/**
 * Creates a subkey under HKEY_USERS or HKEY_LOCAL_MACHINE and loads the data from the specified registry hive into that subkey.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regloadkeyw
 */
export function RegLoadKey(hKey: HKEY | HKEY_, subKey: string | null, file: string): LSTATUS {
    RegLoadKey.native ??= advapi32.func('RegLoadKeyW', cLSTATUS, [ cHANDLE, cSTR, cSTR ])
    return RegLoadKey.native(hKey, subKey, file)
}

/**
 * Opens the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regopenkeyexw
 */
export function RegOpenKeyEx(hKey: HKEY | HKEY_, subKey: string | null, options: REG_OPTION_, samDesired: KEY_): HKEY | LSTATUS {
    RegOpenKeyEx.native ??= advapi32.func('RegOpenKeyExW', cLSTATUS, [
        cHANDLE, cSTR, cDWORD, cDWORD, koffi.out(koffi.pointer(cHANDLE))
    ])

    const pHandle: OUT<HKEY> = [null!]
    return RegOpenKeyEx.native(hKey, subKey, options, samDesired, pHandle) || pHandle[0]
}

/**
 * Retrieves information about the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regqueryinfokeyw
 */
export function RegQueryInfoKey(hKey: HKEY | HKEY_): RegQueryInfoKeyResult | LSTATUS {
    RegQueryInfoKey.native ??= advapi32.func('RegQueryInfoKeyW', cLSTATUS, [
        cHANDLE, cPVOID, koffi.inout(cPDWORD), cPDWORD,
        koffi.out(cPDWORD), koffi.out(cPDWORD), koffi.out(cPDWORD),
        koffi.out(cPDWORD), koffi.out(cPDWORD), koffi.out(cPDWORD),
        koffi.out(cPDWORD),
        koffi.out(koffi.pointer(cFILETIME))
    ])

    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const pSubKeys: OUT<number> = [0]
    const pValues: OUT<number> = [0]
    const lastWriteTime = {} as FILETIME
    const status = RegQueryInfoKey.native(hKey, className.buffer, className.pLength, null,
        pSubKeys, null, null,
        pValues, null, null, null,
        lastWriteTime
    )
    return status || {
        className: className.decode(),
        subKeys: pSubKeys[0],
        values: pValues[0],
        lastWriteTime
    }
}

export interface RegQueryInfoKeyResult {
    className: string
    subKeys: number
    values: number
    lastWriteTime: FILETIME
}

/**
 * Saves the specified key and all of its subkeys and values to a new file, in the standard format.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsavekeyw
 */
export function RegSaveKey(hKey: HKEY | HKEY_, file: string, securityAttributes: SECURITY_ATTRIBUTES): LSTATUS {
    RegSaveKey.native ??= advapi32.func('RegSaveKeyW', cLSTATUS, [ cHANDLE, cSTR, cSECURITY_ATTRIBUTES ])
    return RegSaveKey.native(hKey, file, securityAttributes)
}

/**
 * Saves the specified key and all of its subkeys and values to a new file, in the specified format.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsavekeyexw
 */
export function RegSaveKeyEx(hKey: HKEY | HKEY_, file: string, securityAttributes: SECURITY_ATTRIBUTES, flags: number): LSTATUS {
    RegSaveKeyEx.native ??= advapi32.func('RegSaveKeyW', cLSTATUS, [ cHANDLE, cSTR, cSECURITY_ATTRIBUTES, cDWORD ])
    return RegSaveKeyEx.native(hKey, file, securityAttributes, flags)
}

/**
 * Sets the data for the specified value in the specified registry key and subkey.
 *
 * Notes:
 * - In libwin32, only `REG_NONE`, `REG_SZ`, `REG_EXPAND_SZ`, `REG_MULTI_SZ`, `REG_BINARY`, `REG_DWORD`,
 *   `REG_DWORD_BIG_ENDIAN` and `REG_QWORD` are supported. All other types return `ERROR_NOT_SUPPORTED`.
 * - For `REG_BINARY`, `data` is expected bo be a `UInt8Array` or a `Buffer`.
 * - If `data` if not of the expected type, `ERROR_BAD_ARGUMENTS` is returned.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetkeyvaluew
 */
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.NONE,             data?: null):           LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.SZ,               data: string):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.EXPAND_SZ,        data: string):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.BINARY,           data: BufferSource):    LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.DWORD,            data: number):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.DWORD_BIG_ENDIAN, data: number):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.MULTI_SZ,         data: string[]):        LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.QWORD,            data: number | bigint): LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_, data: any): LSTATUS {
    RegSetKeyValue.native ??= advapi32.func('RegSetKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, cPVOID, cDWORD ])

    const source = regKeyDataToBuffer(type, data)
    return typeof source === 'number' ? source : RegSetKeyValue.native(hKey, valueName, 0, type, source, source.byteLength)
}

/**
 * Sets the data and type of a specified value under a registry key.
 *
 * Notes:
 * - In libwin32, only `REG_NONE`, `REG_SZ`, `REG_EXPAND_SZ`, `REG_MULTI_SZ`, `REG_BINARY`, `REG_DWORD`,
 *   `REG_DWORD_BIG_ENDIAN` and `REG_QWORD` are supported. All other types return `ERROR_NOT_SUPPORTED`.
 * - For `REG_BINARY`, `data` is expected bo be a `UInt8Array` or a `Buffer`.
 * - If `data` if not of the expected type, `ERROR_BAD_ARGUMENTS` is returned.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetvalueexw
 */
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.NONE,             data?: null):           LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.SZ,               data: string):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.EXPAND_SZ,        data: string):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.BINARY,           data: BufferSource):    LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.DWORD,            data: number):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.DWORD_BIG_ENDIAN, data: number):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.MULTI_SZ,         data: string[]):        LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.QWORD,            data: number | bigint): LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_, data: any): LSTATUS {
    RegSetValueEx.native ??= advapi32.func('RegSetValueExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD, cPVOID, cDWORD ])

    const source = regKeyDataToBuffer(type, data)
    return typeof source === 'number' ? source : RegSetValueEx.native(hKey, valueName, 0, type, source, source.byteLength)
}

/**
 * Unloads the specified registry key and its subkeys from the registry.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regunloadkeyw
 */
export function RegUnLoadKey(hKey: HKEY | HKEY_, subKey: string | null): LSTATUS {
    RegUnLoadKey.native ??= advapi32.func('RegUnLoadKeyW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegUnLoadKey.native(hKey, subKey)
}
