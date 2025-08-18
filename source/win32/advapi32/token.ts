import koffi from 'koffi-cream'
import { binaryBuffer, Internals, type OUT } from '../private.js'
import {
    cBOOL, cDWORD, cPVOID, cPDWORD,
    cHANDLE, type HANDLE, type HTOKEN
} from '../ctypes.js'
import {
    cACL, cPSID, type SID,
    cLUID_AND_ATTRIBUTES, cSID_AND_ATTRIBUTES, type CLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cTOKEN_ACCESS_INFORMATION, type TOKEN_ACCESS_INFORMATION,
    cTOKEN_APPCONTAINER_INFORMATION, type TOKEN_APPCONTAINER_INFORMATION,
    cTOKEN_DEFAULT_DACL, type TOKEN_DEFAULT_DACL,
    cTOKEN_ELEVATION, type TOKEN_ELEVATION,
    cTOKEN_GROUPS_AND_PRIVILEGES, type TOKEN_GROUPS_AND_PRIVILEGES, type TOKEN_GROUPS,
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
} from '../structs.js'
import { TOKEN_INFORMATION_CLASS, ERROR_, type SECURITY_IMPERSONATION_LEVEL, type TOKEN_TYPE, type TOKEN_ } from '../consts.js'
import { SetLastError } from '../kernel32.js'
import {
    advapi32,
    getTokenInfo, INTERNAL_TOKEN_INFORMATION_CLASS,
    decodeSid, decodeSidAndAttributesHash, decodeTokenPrivileges, decodeTokenGroups,
    decodeClaimSecurityAttributesInformation
} from './lib.js'

/**
 * The AdjustTokenPrivileges function enables or disables privileges in the specified access token.
 *
 * Note: in libwin32, the function returns the previous state of any privileges that the function modifies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-adjusttokenprivileges
 */
export function AdjustTokenPrivileges(tokenHandle: HTOKEN, disableAllPrivileges: boolean, newState?: TOKEN_PRIVILEGES | null): TOKEN_PRIVILEGES | null {
    AdjustTokenPrivileges.native ??= advapi32.func('AdjustTokenPrivileges', cBOOL, [
        cHANDLE, cBOOL, koffi.pointer(cTOKEN_PRIVILEGES), cDWORD, cPVOID, koffi.out(cPDWORD)
    ])

    const pLength: OUT<number> = [0]
    return AdjustTokenPrivileges.native(
        tokenHandle, Number(disableAllPrivileges), newState, binaryBuffer.byteLength, binaryBuffer, pLength
    ) !== 0
        ? decodeTokenPrivileges(binaryBuffer)
        : null
}

/**
 * Determines whether a specified security identifier (SID) is enabled in an access token.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-checktokenmembership
 */
export function CheckTokenMembership(tokenHandle: HTOKEN | null, sidToCheck: SID): boolean | null {
    CheckTokenMembership.native ??= advapi32.func('CheckTokenMembership', cBOOL, [ cHANDLE, cPSID, koffi.out(koffi.pointer(cBOOL)) ])

    const pBool: OUT<number> = [0]
    return CheckTokenMembership.native(tokenHandle, sidToCheck, pBool) !== 0
        ? Boolean(pBool[0])
        : null
}

/**
 * Retrieves a `TokenAccessInformation` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAccessInformation(tokenHandle: HTOKEN): TOKEN_ACCESS_INFORMATION | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenAccessInformation)) {
        const ret: TOKEN_ACCESS_INFORMATION = koffi.decode(binaryBuffer, cTOKEN_ACCESS_INFORMATION)
        if (ret.SidHash)
            ret.SidHash = decodeSidAndAttributesHash(ret.SidHash)
        if (ret.RestrictedSidHash)
            ret.RestrictedSidHash = decodeSidAndAttributesHash(ret.RestrictedSidHash)
        if (ret.Privileges)
            ret.Privileges = decodeTokenPrivileges(ret.Privileges)
        if (ret.PackageSid)
            ret.PackageSid = decodeSid(ret.PackageSid)
        if (ret.CapabilitiesHash)
            ret.CapabilitiesHash = decodeSidAndAttributesHash(ret.CapabilitiesHash)
        if (ret.TrustLevelSid)
            ret.TrustLevelSid = decodeSid(ret.TrustLevelSid)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenAppContainerNumber` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerNumberInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenAppContainerNumber, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenAppContainerSid` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenAppContainerSidInformation(tokenHandle: HTOKEN): TOKEN_APPCONTAINER_INFORMATION | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenAppContainerSid)) {
        const ret: TOKEN_APPCONTAINER_INFORMATION = koffi.decode(binaryBuffer, cTOKEN_APPCONTAINER_INFORMATION)
        if (ret.TokenAppContainer)
            ret.TokenAppContainer = decodeSid(ret.TokenAppContainer)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenCapabilities` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenCapabilitiesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenCapabilities))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenDefaultDacl` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDefaultDaclInformation(tokenHandle: HTOKEN): TOKEN_DEFAULT_DACL | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenDefaultDacl)) {
        const ret: TOKEN_DEFAULT_DACL = koffi.decode(binaryBuffer, cTOKEN_DEFAULT_DACL)
        if (ret.DefaultDacl)
            ret.DefaultDacl = koffi.decode(ret.DefaultDacl, cACL)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenDeviceClaimAttributes` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes))
        return decodeClaimSecurityAttributesInformation(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenDeviceGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenDeviceGroups))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenElevation` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationInformation(tokenHandle: HTOKEN): TOKEN_ELEVATION | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenElevation, Internals.DWORD_LENGTH)) {
        const ret: TOKEN_ELEVATION = koffi.decode(binaryBuffer, cTOKEN_ELEVATION)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenElevationType` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenElevationTypeInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenElevationType, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenGroupsAndPrivileges` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsAndPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_GROUPS_AND_PRIVILEGES | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges)) {
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
 * Retrieves `TokenGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenGroups))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenHasRestrictions` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenHasRestrictionsInformation(tokenHandle: HTOKEN): TOKEN_TYPE | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenHasRestrictions, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenImpersonationLevel` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenImpersonationLevelInformation(tokenHandle: HTOKEN): SECURITY_IMPERSONATION_LEVEL | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenImpersonationLevel, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenIntegrityLevel` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIntegrityLevelInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_LABEL | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenIntegrityLevel)) {
        const ret: TOKEN_MANDATORY_LABEL = koffi.decode(binaryBuffer, cTOKEN_MANDATORY_LABEL)
        ret.Label.Sid = decodeSid(ret.Label.Sid)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenIsAppContainer` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenIsAppContainerInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenIsAppContainer, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenLinkedToken` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLinkedTokenInformation(tokenHandle: HTOKEN): TOKEN_LINKED_TOKEN | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenLinkedToken, koffi.sizeof(cTOKEN_LINKED_TOKEN))
        ? koffi.decode(binaryBuffer, cTOKEN_LINKED_TOKEN)
        : null
}

/**
 * Retrieves a `TokenLogonSid` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenLogonSidInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenLogonSid))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenMandatoryPolicy` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenMandatoryPolicyInformation(tokenHandle: HTOKEN): TOKEN_MANDATORY_POLICY | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy)
        ? koffi.decode(binaryBuffer, cTOKEN_MANDATORY_POLICY)
        : null
}

/**
 * Retrieves a `TokenOrigin` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOriginInformation(tokenHandle: HTOKEN): TOKEN_ORIGIN | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenOrigin)
        ? koffi.decode(binaryBuffer, cTOKEN_ORIGIN)
        : null
}

/**
 * Retrieves a `TokenOwner` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenOwnerInformation(tokenHandle: HTOKEN): TOKEN_OWNER | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenOwner)) {
        const ret: TOKEN_OWNER = koffi.decode(binaryBuffer, cTOKEN_OWNER)
        ret.Owner = decodeSid(ret.Owner)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenPrimaryGroup` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrimaryGroupInformation(tokenHandle: HTOKEN): TOKEN_PRIMARY_GROUP | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenPrimaryGroup)) {
        const ret: TOKEN_PRIMARY_GROUP = koffi.decode(binaryBuffer, cTOKEN_PRIMARY_GROUP)
        ret.PrimaryGroup = decodeSid(ret.PrimaryGroup)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenPrivileges` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenPrivilegesInformation(tokenHandle: HTOKEN): TOKEN_PRIVILEGES | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenPrivileges)) {
        const ret: TOKEN_PRIVILEGES = koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES)
        ret.Privileges = koffi.decode(binaryBuffer, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenRestrictedDeviceGroups` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedDeviceGroupsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenRestrictedSids` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenRestrictedSidsInformation(tokenHandle: HTOKEN): TOKEN_GROUPS | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenRestrictedSids))
        return decodeTokenGroups(binaryBuffer)
    return null
}

/**
 * Retrieves a `TokenSandBoxInert` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSandBoxInertInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenSandBoxInert, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenSessionId` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSessionIdInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenSessionId, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenSource` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenSourceInformation(tokenHandle: HTOKEN): TOKEN_SOURCE | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenSource)
        ? koffi.decode(binaryBuffer, cTOKEN_SOURCE)
        : null
}

/**
 * Retrieves a `TokenStatistics` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenStatisticsInformation(tokenHandle: HTOKEN): TOKEN_STATISTICS | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenStatistics)
        ? koffi.decode(binaryBuffer, cTOKEN_STATISTICS)
        : null
}

/**
 * Retrieves `TokenType` specified class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenTypeInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenType, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenUIAccess` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUIAccessInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenUIAccess, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenUserClaimAttributes` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserClaimAttributesInformation(tokenHandle: HTOKEN): CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes))
        return decodeClaimSecurityAttributesInformation(binaryBuffer)
    return null
}

/**
 * Retrieves `TokenUser` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenUserInformation(tokenHandle: HTOKEN): TOKEN_USER | null {
    if (getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenUser)) {
        const ret: TOKEN_USER = koffi.decode(binaryBuffer, cTOKEN_USER)
        ret.User.Sid = decodeSid(ret.User.Sid)
        return ret
    }
    return null
}

/**
 * Retrieves a `TokenVirtualizationAllowed` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationAllowedInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
}

/**
 * Retrieves a `TokenVirtualizationEnabled` class of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenVirtualizationEnabledInformation(tokenHandle: HTOKEN): number | null {
    return getTokenInfo(tokenHandle, INTERNAL_TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled, Internals.DWORD_LENGTH)
        ? binaryBuffer.readUInt32LE(0)
        : null
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
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: number): any
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: TOKEN_INFORMATION_CLASS) {

    switch (tokenInformationClass as number) {
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenUser:                   return GetTokenUserInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenGroups:                 return GetTokenGroupsInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenPrivileges:             return GetTokenPrivilegesInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenOwner:                  return GetTokenOwnerInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenPrimaryGroup:           return GetTokenPrimaryGroupInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenDefaultDacl:            return GetTokenDefaultDaclInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenSource:                 return GetTokenSourceInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenType:                   return GetTokenTypeInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenImpersonationLevel:     return GetTokenImpersonationLevelInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenStatistics:             return GetTokenStatisticsInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenRestrictedSids:         return GetTokenRestrictedSidsInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenSessionId:              return GetTokenSessionIdInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges:    return GetTokenGroupsAndPrivilegesInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenSandBoxInert:           return GetTokenSandBoxInertInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenOrigin:                 return GetTokenOriginInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenElevationType:          return GetTokenElevationTypeInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenLinkedToken:            return GetTokenLinkedTokenInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenElevation:              return GetTokenElevationInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenHasRestrictions:        return GetTokenHasRestrictionsInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenAccessInformation:      return GetTokenAccessInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed:  return GetTokenVirtualizationAllowedInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled:  return GetTokenVirtualizationEnabledInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenIntegrityLevel:         return GetTokenIntegrityLevelInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenUIAccess:               return GetTokenUIAccessInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy:        return GetTokenMandatoryPolicyInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenLogonSid:               return GetTokenLogonSidInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenIsAppContainer:         return GetTokenIsAppContainerInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenCapabilities:           return GetTokenCapabilitiesInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenAppContainerSid:        return GetTokenAppContainerSidInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenAppContainerNumber:     return GetTokenAppContainerNumberInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes:    return GetTokenUserClaimAttributesInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes:  return GetTokenDeviceClaimAttributesInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenDeviceGroups:           return GetTokenDeviceGroupsInformation(tokenHandle)
        case INTERNAL_TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups: return GetTokenRestrictedDeviceGroupsInformation(tokenHandle)

        // Dismiss all other cases
        default:
            SetLastError(ERROR_.NOT_SUPPORTED)
            return null
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
