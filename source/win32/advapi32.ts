import assert from 'node:assert'
import koffi from 'koffi-cream'
import { Win32Dll, binaryBuffer, textDecoder, StringOutputBuffer, Internals, type OUT } from './private.js'
import {
    cVOID, cBOOL, cINT, cBYTE, cDWORD, cULONG, cPVOID, cSTR,
    cHANDLE, type HANDLE, type HTOKEN, type LSA_HANDLE, type HKEY,
    cLSTATUS, type LSTATUS,
    cNTSTATUS,
} from './ctypes.js'
import {
    cACL,
    cLSA_OBJECT_ATTRIBUTES, LSA_OBJECT_ATTRIBUTES,
    cLSA_UNICODE_STRING, LSA_UNICODE_STRING,
    cLUID_AND_ATTRIBUTES, cSID_AND_ATTRIBUTES, cSID_AND_ATTRIBUTES_HASH,
    cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, type CLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cCLAIM_SECURITY_ATTRIBUTE_V1, type CLAIM_SECURITY_ATTRIBUTE_V1,
    cSID, type SID,
    cSID_IDENTIFIER_AUTHORITY, type SID_IDENTIFIER_AUTHORITY,
    cLUID, type LUID,
    cTOKEN_ACCESS_INFORMATION, type TOKEN_ACCESS_INFORMATION,
    cTOKEN_APPCONTAINER_INFORMATION, type TOKEN_APPCONTAINER_INFORMATION,
    cTOKEN_DEFAULT_DACL, type TOKEN_DEFAULT_DACL,
    cTOKEN_ELEVATION, type TOKEN_ELEVATION,
    cTOKEN_GROUPS_AND_PRIVILEGES, type TOKEN_GROUPS_AND_PRIVILEGES,
    cTOKEN_GROUPS, type TOKEN_GROUPS,
    cTOKEN_LINKED_TOKEN, type TOKEN_LINKED_TOKEN,
    cTOKEN_MANDATORY_LABEL, type TOKEN_MANDATORY_LABEL,
    cTOKEN_MANDATORY_POLICY, type TOKEN_MANDATORY_POLICY,
    cTOKEN_ORIGIN, type TOKEN_ORIGIN,
    cTOKEN_OWNER, type TOKEN_OWNER,
    cTOKEN_PRIMARY_GROUP, type TOKEN_PRIMARY_GROUP,
    cTOKEN_PRIVILEGES, type TOKEN_PRIVILEGES,
    cTOKEN_SOURCE, type TOKEN_SOURCE,
    cTOKEN_STATISTICS, type TOKEN_STATISTICS,
    cTOKEN_USER, type TOKEN_USER,
    cSECURITY_ATTRIBUTES, type SECURITY_ATTRIBUTES,
    cPRIVILEGE_SET, type PRIVILEGE_SET,
    cFILETIME, type FILETIME
} from './structs.js'
import {
    TOKEN_INFORMATION_CLASS, REG_,
    type NTSTATUS_, type TOKEN_, type POLICY_,
    type HKEY_, type REG_OPTION_, type KEY_, type RRF_,
    type SID_NAME_USE,
    type SE_NAME
} from './consts.js'
import { LocalFree, cLocalAllocatedString } from './kernel32.js'

/** @internal */
export const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

/**
 * The AdjustTokenPrivileges function enables or disables privileges in the specified access token.
 *
 * Note: in libwin32, the function returns the previous state of any privileges that the function modifies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-adjusttokenprivileges
 */
export function AdjustTokenPrivileges(tokenHandle: HANDLE, disableAllPrivileges: boolean, newState?: TOKEN_PRIVILEGES | null): TOKEN_PRIVILEGES | null {
    AdjustTokenPrivileges.native ??= advapi32.func('AdjustTokenPrivileges', cBOOL, [ cHANDLE, cBOOL, cTOKEN_PRIVILEGES, cDWORD, cPVOID, koffi.out(koffi.pointer(cDWORD)) ])

    const pReturnLength: OUT<number> = [0]
    if (AdjustTokenPrivileges.native(tokenHandle, Number(disableAllPrivileges), newState, binaryBuffer.byteLength, binaryBuffer, pReturnLength) !== 0) {
        const previousState: TOKEN_PRIVILEGES = koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES)
        if (previousState.PrivilegeCount > 1)
            previousState.Privileges = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, previousState.PrivilegeCount)
        return previousState
    }
    return null
}

/**
 * Allocates and initializes a security identifier (SID) with up to eight subauthorities.
 *
 * Note: in libwin32, because the allocated SID is turned into a JS object, its memory is immediately returned to the system
 *       by this function. The net effect is that you don't need to call {@link FreeSid()} afterwards (which is a NOOP anyway).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-allocateandinitializesid
 */
export function AllocateAndInitializeSid(identifierAuthority: SID_IDENTIFIER_AUTHORITY, subAuthorityCount: number, subAuthority0: number, subAuthority1: number, subAuthority2: number, subAuthority3: number, subAuthority4: number, subAuthority5: number, subAuthority6: number, subAuthority7: number): SID | null {

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
        freeSid.native ??= advapi32.func('FreeSid', cVOID, [ cPVOID ])
        freeSid.native(pSID[0])
    }
}

function decodeSid(sidPtr: unknown): SID {

    // Decode the 8-bytes header.
    const [ Revision, SubAuthorityCount, ...IdentifierAuthority ] = koffi.decode(sidPtr, 0, cBYTE, 8) as [ number, number, number, number, number, number, number, number ]

    // Decode the exact number of sub-authorities present in the SID. Yet, we still must set the array length
    // to SID_MAX_SUB_AUTHORITIES otherwise calls to other functions that expect a SID parameter would fail.
    const SubAuthority: number[] = Array.from(koffi.decode(sidPtr, koffi.offsetof(cSID, 'SubAuthority'), cDWORD, SubAuthorityCount))
    SubAuthority.length = Internals.SID_MAX_SUB_AUTHORITIES
    SubAuthority.fill(0, SubAuthorityCount)

    // Return the decoded SID.
    return {
        Revision,
        SubAuthorityCount,
        IdentifierAuthority,
        SubAuthority
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
 * Note: because `AllocateAndInitializeSid()` already freed the allocated memory, this functions is a NOOP.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-freesid
 */
export function FreeSid(_sid: SID): void {}

/**
 * Retrieves a `TokenAccessInformation` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAccessInformation(tokenHandle: HTOKEN): TOKEN_ACCESS_INFORMATION | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAccessInformation)) {
        const ret: TOKEN_ACCESS_INFORMATION = koffi.decode(binaryBuffer, cTOKEN_ACCESS_INFORMATION)

        ret.SidHash = koffi.decode(ret.SidHash, cSID_AND_ATTRIBUTES_HASH)
        ret.SidHash.SidAttr = koffi.decode(ret.SidHash.SidAttr, cSID_AND_ATTRIBUTES, ret.SidHash.SidCount)
        ret.SidHash.SidAttr.forEach(sid => sid.Sid = decodeSid(sid.Sid))

        ret.RestrictedSidHash = koffi.decode(ret.RestrictedSidHash, cSID_AND_ATTRIBUTES_HASH)
        ret.RestrictedSidHash.SidAttr = koffi.decode(ret.RestrictedSidHash.SidAttr, cSID_AND_ATTRIBUTES, ret.RestrictedSidHash.SidCount)
        ret.RestrictedSidHash.SidAttr.forEach(sid => sid.Sid = decodeSid(sid.Sid))

        ret.CapabilitiesHash = koffi.decode(ret.CapabilitiesHash, cSID_AND_ATTRIBUTES_HASH)
        ret.CapabilitiesHash.SidAttr = koffi.decode(ret.CapabilitiesHash.SidAttr, cSID_AND_ATTRIBUTES, ret.CapabilitiesHash.SidCount)
        ret.CapabilitiesHash.SidAttr.forEach(sid => sid.Sid = decodeSid(sid.Sid))

        const { Privileges } = ret
        ret.Privileges = koffi.decode(Privileges, cTOKEN_PRIVILEGES)
        ret.Privileges.Privileges = koffi.decode(Privileges, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.Privileges.PrivilegeCount)

        return ret
    }
    return null
}

/**
 * Retrieves a `TokenAppContainerNumber` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerNumberInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAppContainerNumber)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenAppContainerSid` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerSidInformation(tokenHandle: HTOKEN): TOKEN_APPCONTAINER_INFORMATION | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenAppContainerSid)) {
        const ret: TOKEN_APPCONTAINER_INFORMATION = koffi.decode(binaryBuffer, cTOKEN_APPCONTAINER_INFORMATION)
        ret.TokenAppContainer = decodeSid(ret.TokenAppContainer)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenCapabilities` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenCapabilitiesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenCapabilities)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenDefaultDacl` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDefaultDaclInformation(tokenHandle: HTOKEN): TOKEN_DEFAULT_DACL | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDefaultDacl)) {
        const ret: TOKEN_DEFAULT_DACL = koffi.decode(binaryBuffer, cTOKEN_DEFAULT_DACL)
        ret.DefaultDacl = koffi.decode(ret.DefaultDacl, cACL)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenDeviceClaimAttributes` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes)) {
        const ret: CLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.decode(binaryBuffer, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION)
        if (ret.Attribute && ret.AttributeCount > 0) {
            ret.Attribute = {
                AttributeV1: koffi.decode(binaryBuffer, koffi.offsetof(cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, 'Attribute'), cCLAIM_SECURITY_ATTRIBUTE_V1, ret.AttributeCount)
            }
        }
        else ret.Attribute = { AttributeV1: [] }
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenDeviceGroups` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenDeviceGroups)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenElevation` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationInformation(tokenHandle: HTOKEN): TOKEN_ELEVATION | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenElevation)) {
        const ret: TOKEN_ELEVATION = koffi.decode(binaryBuffer, cTOKEN_ELEVATION)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenElevationType` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationTypeInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenElevationType)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenGroupsAndPrivileges` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsAndPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS_AND_PRIVILEGES | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges)) {
        const ret: TOKEN_GROUPS_AND_PRIVILEGES = koffi.decode(binaryBuffer, cTOKEN_GROUPS_AND_PRIVILEGES)

        if (ret.Sids && ret.SidCount > 0) {
            ret.Sids = koffi.decode(ret.Sids, cSID_AND_ATTRIBUTES, ret.SidCount)
            ret.Sids.forEach(sid => sid.Sid = decodeSid(sid.Sid))
        }
        else ret.Sids = []

        if (ret.RestrictedSids && ret.RestrictedSidCount > 0) {
            ret.RestrictedSids = koffi.decode(ret.RestrictedSids, cSID_AND_ATTRIBUTES, ret.RestrictedSidCount)
            ret.RestrictedSids.forEach(sid => sid.Sid = decodeSid(sid.Sid))
        }
        else ret.RestrictedSids = []

        if (ret.Privileges && ret.PrivilegeCount > 0) {
            ret.Privileges = koffi.decode(ret.Privileges, cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
        }
        else ret.Privileges = []

        return ret
    }
    return null
}

/**
 * Retrieves `TokenGroups` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenGroups)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenHasRestrictions` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenHasRestrictionsInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenHasRestrictions)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenImpersonationLevel` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenImpersonationLevelInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenImpersonationLevel)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenIntegrityLevel` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIntegrityLevelInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_LABEL | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenIntegrityLevel)) {
        const ret: TOKEN_MANDATORY_LABEL = koffi.decode(binaryBuffer, cTOKEN_MANDATORY_LABEL)
        ret.Label.Sid = decodeSid(ret.Label.Sid)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenIsAppContainer` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIsAppContainerInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenIsAppContainer)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenLinkedToken` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLinkedTokenInformation(tokenHandle: HTOKEN): TOKEN_LINKED_TOKEN | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenLinkedToken)) {
        const ret: TOKEN_LINKED_TOKEN = koffi.decode(binaryBuffer, cTOKEN_LINKED_TOKEN)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenLogonSid` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLogonSidInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenLogonSid)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenMandatoryPolicy` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenMandatoryPolicyInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_POLICY | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy)) {
        const ret: TOKEN_MANDATORY_POLICY = koffi.decode(binaryBuffer, cTOKEN_MANDATORY_POLICY)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenOrigin` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOriginInformation(tokenHandle: HTOKEN): TOKEN_ORIGIN | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenOrigin)) {
        const ret: TOKEN_ORIGIN = koffi.decode(binaryBuffer, cTOKEN_ORIGIN)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenOwner` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOwnerInformation(tokenHandle: HTOKEN): TOKEN_OWNER | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenOwner)) {
        const ret: TOKEN_OWNER = koffi.decode(binaryBuffer, cTOKEN_OWNER)
        ret.Owner = decodeSid(ret.Owner)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenPrimaryGroup` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrimaryGroupInformation(tokenHandle: HTOKEN): TOKEN_PRIMARY_GROUP | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenPrimaryGroup)) {
        const ret: TOKEN_PRIMARY_GROUP = koffi.decode(binaryBuffer, cTOKEN_PRIMARY_GROUP)
        ret.PrimaryGroup = decodeSid(ret.PrimaryGroup)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenPrivileges` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_PRIVILEGES | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenPrivileges)) {
        const ret: TOKEN_PRIVILEGES = koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES)
        ret.Privileges = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenRestrictedDeviceGroups` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenRestrictedSids` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedSidsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenRestrictedSids)) {
        const ret: TOKEN_GROUPS = koffi.decode(binaryBuffer, cTOKEN_GROUPS)
        ret.Groups = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenSandBoxInert` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSandBoxInertInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSandBoxInert)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenSessionId` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSessionIdInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSessionId)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenSource` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSourceInformation(tokenHandle: HTOKEN): TOKEN_SOURCE | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenSource)) {
        const ret: TOKEN_SOURCE = koffi.decode(binaryBuffer, cTOKEN_SOURCE)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenStatistics` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenStatisticsInformation(tokenHandle: HTOKEN): TOKEN_STATISTICS | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenStatistics)) {
        const ret: TOKEN_STATISTICS = koffi.decode(binaryBuffer, cTOKEN_STATISTICS)
        return ret
    }
    return null
}

/**
 * Retrieves `TokenType` specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenTypeInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenType)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenUIAccess` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUIAccessInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUIAccess)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenUserClaimAttributes` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes)) {
        const ret: CLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.decode(binaryBuffer, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION)
        if (ret.Attribute && ret.AttributeCount > 0) {
            ret.Attribute = {
                AttributeV1: koffi.decode(binaryBuffer, koffi.offsetof(cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, 'Attribute'), cCLAIM_SECURITY_ATTRIBUTE_V1, ret.AttributeCount)
            }
        }
        else ret.Attribute = { AttributeV1: [] }
        return ret
    }
    return null
}

/**
 * Retrieves `TokenUser` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserInformation(tokenHandle: HTOKEN): TOKEN_USER | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenUser)) {
        const ret: TOKEN_USER = koffi.decode(binaryBuffer, cTOKEN_USER)
        ret.User.Sid = decodeSid(ret.User.Sid)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenVirtualizationAllowed` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationAllowedInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

/**
 * Retrieves a `TokenVirtualizationEnabled` type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationEnabledInformation(tokenHandle: HTOKEN): number | null {
    if (getTokenInfo(tokenHandle, TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled)) {
        const ptr = new Uint32Array(binaryBuffer.buffer, 0, 1)
        return ptr[0]
    }
    return null
}

function getTokenInfo(hToken: HTOKEN, infoClass: TOKEN_INFORMATION_CLASS): boolean {
    getTokenInfo.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const pLength: OUT<number> = [0]
    return getTokenInfo.native(hToken, infoClass, binaryBuffer.buffer, binaryBuffer.byteLength, pLength) !== 0
}

/**
 * Retrieves a specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
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
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS) {
    switch (tokenInformationClass) {
        case TOKEN_INFORMATION_CLASS.TokenAccessInformation:      return GetTokenAccessInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenAppContainerNumber:     return GetTokenAppContainerNumberInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenAppContainerSid:        return GetTokenAppContainerSidInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenCapabilities:           return GetTokenCapabilitiesInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenDefaultDacl:            return GetTokenDefaultDaclInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes:  return GetTokenDeviceClaimAttributesInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenDeviceGroups:           return GetTokenDeviceGroupsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenElevation:              return GetTokenElevationInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenElevationType:          return GetTokenElevationTypeInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenGroups:                 return GetTokenGroupsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges:    return GetTokenGroupsAndPrivilegesInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenHasRestrictions:        return GetTokenHasRestrictionsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenImpersonationLevel:     return GetTokenImpersonationLevelInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenIntegrityLevel:         return GetTokenIntegrityLevelInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenIsAppContainer:         return GetTokenIsAppContainerInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenLinkedToken:            return GetTokenLinkedTokenInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenLogonSid:               return GetTokenLogonSidInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy:        return GetTokenMandatoryPolicyInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenOrigin:                 return GetTokenOriginInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenOwner:                  return GetTokenOwnerInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenPrimaryGroup:           return GetTokenPrimaryGroupInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenPrivileges:             return GetTokenPrivilegesInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups: return GetTokenRestrictedDeviceGroupsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenRestrictedSids:         return GetTokenRestrictedSidsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenSandBoxInert:           return GetTokenSandBoxInertInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenSessionId:              return GetTokenSessionIdInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenSource:                 return GetTokenSourceInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenStatistics:             return GetTokenStatisticsInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenType:                   return GetTokenTypeInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenUIAccess:               return GetTokenUIAccessInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenUser:                   return GetTokenUserInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes:    return GetTokenUserClaimAttributesInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed:  return GetTokenVirtualizationAllowedInformation(tokenHandle)
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled:  return GetTokenVirtualizationEnabledInformation(tokenHandle)

        // Dismiss all other cases
        default:
            return null
    }
}

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.UNLEN + 1)
    if (GetUserName.native(name.buffer, name.pLength) !== 0)
        return name.decode(name.length - 1)   // GetUserName() returned length includes the final \0
    return null
}

/**
 * Retrieves a security identifier (SID) for the account and the name of the domain on which the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountnamew
 */
export function LookupAccountName(systemName: string | null, accountName: string): LookupAccountNameResult | null {
    LookupAccountName.native ??= advapi32.func('LookupAccountNameW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cSID)), koffi.inout(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cINT)) ])

    const pSID: OUT<SID> = [{} as SID]
    const pcbSid: OUT<number> = [koffi.sizeof(cSID)]
    const domain = new StringOutputBuffer(Internals.MAX_NAME)
    const peUse: OUT<SID_NAME_USE> = [0 as SID_NAME_USE]
    if (LookupAccountName.native(systemName, accountName, pSID, pcbSid, domain.buffer, domain.pLength, peUse) !== 0) {
        return {
            sid: pSID[0],
            referencedDomainName: domain.decode(),
            use: peUse[0]
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

/**
 * Retrieves the name that corresponds to the privilege represented on a specific system by a specified locally unique identifier (LUID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegenamew
 */
export function LookupPrivilegeName(systemName: string | null, luid: LUID): string | null {
    LookupPrivilegeName.native ??= advapi32.func('LookupPrivilegeNameW', cBOOL, [ cSTR, koffi.pointer(cLUID), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.MAX_NAME)
    if (LookupPrivilegeName.native(systemName, luid, name.buffer, name.pLength) !== 0)
        return name.decode()
    return null
}

/**
 * Retrieves the locally unique identifier (LUID) used on a specified system to locally represent the specified privilege name.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupprivilegevaluew
 */
export function LookupPrivilegeValue(systemName: string | null, name: SE_NAME): LUID | null {
    LookupPrivilegeValue.native ??= advapi32.func('LookupPrivilegeValueW', cBOOL, [ cSTR, cSTR, koffi.out(koffi.pointer(cLUID)) ])

    const pLUID: OUT<LUID> = [{} as LUID]
    if (LookupPrivilegeValue.native(systemName, name, pLUID) !== 0)
        return pLUID[0]
    return null
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
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(status: NTSTATUS_): number {
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
    if (LsaOpenPolicy.native(name, new LSA_OBJECT_ATTRIBUTES(), desiredAcces, pHandle) === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return null
}

/**
 * Opens the access token associated with a process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function OpenProcessToken(processHandle: HANDLE, desiredAccess: TOKEN_): HTOKEN | null {
    OpenProcessToken.native ??= advapi32.func('OpenProcessToken', cBOOL, [ cHANDLE, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HTOKEN> = [null!]
    if (OpenProcessToken.native(processHandle, desiredAccess, pHandle) !== 0)
        return pHandle[0]
    return null
}

/**
 * The PrivilegeCheck function determines whether a specified set of privileges are enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-privilegecheck
 */
export function PrivilegeCheck(clientToken: HANDLE, RequiredPrivileges: PRIVILEGE_SET): boolean | null {
    PrivilegeCheck.native ??= advapi32.func('PrivilegeCheck', cBOOL, [ cHANDLE, koffi.inout(koffi.pointer(cPRIVILEGE_SET)), koffi.out(koffi.pointer(cBOOL)) ])

    const pRequiredPrivileges: OUT<PRIVILEGE_SET> = [RequiredPrivileges]
    const pfResult: OUT<number> = [0]
    if (PrivilegeCheck.native(clientToken, pRequiredPrivileges, pfResult) !== 0) {
        return Boolean(pfResult[0])
    }
    return null
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
    const status: LSTATUS = RegConnectRegistry.native(machineName, hKey, pHandle)
    if (status === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return status
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
export function RegCreateKeyEx(hKey: HKEY | HKEY_, subKey: string, className: string | null, options: REG_OPTION_, samDesired: KEY_, securityAttributes: SECURITY_ATTRIBUTES | null): HKEY | LSTATUS {
    RegCreateKeyEx.native ??= advapi32.func('RegCreateKeyExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cSTR, cDWORD, cDWORD, koffi.pointer(cSECURITY_ATTRIBUTES), koffi.out(koffi.pointer(cHANDLE)), koffi.out(koffi.pointer(cDWORD)) ])

    const pHandle: OUT<HKEY> = [null!]
    const status: LSTATUS = RegCreateKeyEx.native(hKey, subKey, 0, className, options, samDesired, securityAttributes, pHandle, null)
    if (status === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return status
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
 * Enumerates the subkeys of the specified open registry key. The function retrieves information about one subkey each time it is called.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumkeyexw
 */
export function RegEnumKeyEx(hKey: HKEY | HKEY_, index: number): RegEnumKeyExResult | LSTATUS {
    RegEnumKeyEx.native ??= advapi32.func('RegEnumKeyExW', cLSTATUS, [ cHANDLE, cDWORD, cPVOID, koffi.inout(koffi.pointer(cDWORD)), koffi.pointer(cDWORD), cPVOID, koffi.inout(koffi.pointer(cDWORD)), koffi.pointer(cFILETIME) ])

    const name = new StringOutputBuffer(Internals.MAX_KEY_LENGTH + 1)
    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const pLastWriteTime: OUT<FILETIME> = [{} as FILETIME]
    const status: LSTATUS = RegEnumKeyEx.native(hKey, index, name.buffer, name.pLength, null, className.buffer, className.pLength, pLastWriteTime)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            name: name.decode(),
            className: className.decode(),
            lastWriteTime: pLastWriteTime[0]
        }
    }
    return status
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
 *       use {@link RegGetValue()} to actually read the data.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumvaluew
 */
export function RegEnumValue(hKey: HKEY | HKEY_, index: number): RegEnumValueResult | LSTATUS {
    RegEnumValue.native ??= advapi32.func('RegEnumValueW', cLSTATUS, [ cHANDLE, cDWORD, cPVOID, koffi.inout(koffi.pointer(cDWORD)), cPVOID, koffi.out(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.MAX_KEY_LENGTH + 1)
    const pType: OUT<REG_> = [0]
    const pSize: OUT<number> = [0]
    const status: LSTATUS = RegEnumValue.native(hKey, index, name.buffer, name.pLength, null, pType, null, pSize)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            name: name.decode(),
            type: pType[0],
            size: pSize[0]
        }
    }
    return status
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
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-reggetvaluew
 */
export function RegGetValue(hKey: HKEY | HKEY_, subKey: string | null, value: string | null, flags: RRF_): RegGetValueResult | LSTATUS {
    RegGetValue.native ??= advapi32.func('RegGetValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, koffi.out(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const pType: OUT<REG_> = [0]
    const pCount: OUT<number> = [binaryBuffer.byteLength]
    const status: LSTATUS = RegGetValue.native(hKey, subKey, value, flags, pType, binaryBuffer, pCount)
    if (status === Internals.ERROR_SUCCESS) {
        const type = pType[0]
        const count = pCount[0]
        let value: any
        switch (type) {
            case REG_.NONE:
                value = null
                break

            case REG_.SZ:
            case REG_.EXPAND_SZ:
                value = new Uint16Array(binaryBuffer.buffer, binaryBuffer.byteOffset, (count / Uint16Array.BYTES_PER_ELEMENT) - 1)
                value = textDecoder.decode(value)
                break

            case REG_.MULTI_SZ:
                value = new Uint16Array(binaryBuffer.buffer, binaryBuffer.byteOffset, (count / Uint16Array.BYTES_PER_ELEMENT) - 2)
                value = textDecoder.decode(value).split('\0')
                break

            case REG_.BINARY:
                value = new Uint8Array(binaryBuffer.buffer, binaryBuffer.byteOffset, count)
                break

            case REG_.DWORD:
                assert(count === Uint32Array.BYTES_PER_ELEMENT)
                value = new Uint32Array(binaryBuffer.buffer, binaryBuffer.byteOffset, 1)
                value = value[0]
                break

            case REG_.DWORD_BIG_ENDIAN:
                assert(count === Uint32Array.BYTES_PER_ELEMENT)
                value = new Uint32Array(binaryBuffer.buffer, binaryBuffer.byteOffset, 1)
                value = new DataView(value).getUint32(0, false)
                break

            case REG_.QWORD:
                assert(count === BigUint64Array.BYTES_PER_ELEMENT)
                value = new BigUint64Array(binaryBuffer.buffer, binaryBuffer.byteOffset, 1)
                value = value[0]
                break
        }

        return { type, value }
    }
    return status
}

export type RegGetValueResult =
    | { type: REG_.NONE,             value: null       }
    | { type: REG_.SZ,               value: string     }
    | { type: REG_.EXPAND_SZ,        value: string     }
    | { type: REG_.MULTI_SZ,         value: string[]   }
    | { type: REG_.BINARY,           value: Uint8Array }
    | { type: REG_.DWORD,            value: number     }
    | { type: REG_.DWORD_BIG_ENDIAN, value: number     }
    | { type: REG_.QWORD,            value: BigInt     }
    | { type: REG_,                  value: unknown    }

/**
 * Loads the specified registry hive as an application hive.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regloadappkeyw
 */
export function RegLoadAppKey(file: string, samDesired: KEY_, options: number): HKEY | LSTATUS {
    RegLoadAppKey.native ??= advapi32.func('RegLoadAppKeyW', cLSTATUS, [ cSTR, koffi.out(koffi.pointer(cHANDLE)), cDWORD, cDWORD, cDWORD ])
    const pHandle: OUT<HKEY> = [null!]
    const status: LSTATUS = RegLoadAppKey.native(file, pHandle, samDesired, options, 0)
    if (status === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return status
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
    RegOpenKeyEx.native ??= advapi32.func('RegOpenKeyExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HKEY> = [null!]
    const status: LSTATUS = RegOpenKeyEx.native(hKey, subKey, options, samDesired, pHandle)
    if (status === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return status
}

/**
 * Retrieves information about the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regqueryinfokeyw
 */
export function RegQueryInfoKey(hKey: HKEY | HKEY_): RegQueryInfoKeyResult | LSTATUS {
    RegQueryInfoKey.native ??= advapi32.func('RegQueryInfoKeyW', cLSTATUS, [ cHANDLE, cPVOID, koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cFILETIME)) ])

    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const pSubKeys: OUT<number> = [0]
    const pValues: OUT<number> = [0]
    const pLastWriteTime: OUT<FILETIME> = [{} as FILETIME]
    const status: LSTATUS = RegQueryInfoKey.native(hKey, className.buffer, className.pLength, null, pSubKeys, null, null, pValues, null, null, null, pLastWriteTime)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            className: className.decode(),
            subKeys: pSubKeys[0],
            values: pValues[0],
            lastWriteTime: pLastWriteTime[0]
        }
    }
    return status
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
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetkeyvaluew
 */
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_, data: any, cbData: number): LSTATUS {
    RegSetKeyValue.native ??= advapi32.func('RegSetKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, cVOID, cDWORD ])
    return RegSetKeyValue.native(hKey, subKey, valueName, type, data, cbData)
}

/**
 * Sets the data and type of a specified value under a registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetvalueexw
 */
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_, data: any, cbData: number): LSTATUS {
    RegSetValueEx.native ??= advapi32.func('RegSetValueExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD, cPVOID, cDWORD ])
    return RegSetValueEx.native(hKey, valueName, 0, type, data, cbData)
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
