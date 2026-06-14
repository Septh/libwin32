import koffi from 'koffi'
import {
    binaryBuffer, isPointer,
    cBOOL, cDWORD, cHANDLE, cINT, cP_DWORD, cP_VOID,
    type HANDLE, type OUT, type Pointer
} from '../../internals.js'
import type { CLAIM_SECURITY_ATTRIBUTES_INFORMATION } from '../security/types.js'
import type { SECURITY_IMPERSONATION_LEVEL } from '../security/consts.js'
import { cACL, cCLAIM_SECURITY_ATTRIBUTE_V1, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION } from '../security/ctypes.js'
import type { SID, SID_AND_ATTRIBUTES_HASH } from '../sid/types.js'
import { cPSID, cSID, cSID_AND_ATTRIBUTES_HASH } from '../sid/ctypes.js'
import { SetLastError } from '../../kernel32/functions.js'
import { advapi32 } from '../_dll.js'
import type {
    HTOKEN, TOKEN_ACCESS_INFORMATION, TOKEN_APPCONTAINER_INFORMATION,
    TOKEN_DEFAULT_DACL, TOKEN_ELEVATION,
    TOKEN_GROUPS, TOKEN_GROUPS_AND_PRIVILEGES, TOKEN_LINKED_TOKEN,
    TOKEN_MANDATORY_LABEL, TOKEN_MANDATORY_POLICY,
    TOKEN_ORIGIN, TOKEN_OWNER, TOKEN_PRIMARY_GROUP, TOKEN_PRIVILEGES,
    TOKEN_SOURCE, TOKEN_STATISTICS, TOKEN_USER
} from './types.js'
import { TOKEN_INFORMATION_CLASS, type TOKEN_, type TOKEN_TYPE } from './consts.js'
import {
    cTOKEN_ACCESS_INFORMATION, cTOKEN_APPCONTAINER_INFORMATION,
    cTOKEN_DEFAULT_DACL, cTOKEN_ELEVATION,
    cTOKEN_GROUPS, cTOKEN_GROUPS_AND_PRIVILEGES, cTOKEN_LINKED_TOKEN,
    cTOKEN_MANDATORY_LABEL, cTOKEN_MANDATORY_POLICY,
    cTOKEN_ORIGIN, cTOKEN_OWNER, cTOKEN_PRIMARY_GROUP, cTOKEN_PRIVILEGES,
    cTOKEN_SOURCE, cTOKEN_STATISTICS, cTOKEN_USER,
} from './ctypes.js'

/**
 * Enables or disables privileges in the specified access token.
 *
 * Note: in libwin32, the function returns the previous state of any privileges that the function modifies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-adjusttokenprivileges
 */
export function AdjustTokenPrivileges(tokenHandle: HTOKEN, disableAllPrivileges: boolean, newState: TOKEN_PRIVILEGES | null = null): TOKEN_PRIVILEGES | null {
    AdjustTokenPrivileges.native ??= advapi32.func('AdjustTokenPrivileges', cBOOL, [
        cHANDLE, cBOOL, koffi.pointer(cTOKEN_PRIVILEGES), cDWORD, cP_VOID, koffi.out(cP_DWORD)
    ])

    const pLength: OUT<number> = [0]
    return AdjustTokenPrivileges.native(
        tokenHandle, Number(disableAllPrivileges), newState, binaryBuffer.byteLength, binaryBuffer, pLength
    ) !== 0
        ? koffi.decode(binaryBuffer, cTOKEN_PRIVILEGES)
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
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: number): TOKEN_INFORMATION | null
export function GetTokenInformation(tokenHandle: HTOKEN, tokenInformationClass: number): any {
    GetTokenInformation.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cP_VOID, cDWORD, koffi.out(cP_DWORD) ])

    const pLength: OUT<number> = [0]
    GetTokenInformation.native(tokenHandle, tokenInformationClass, null, 0, pLength)
    if (pLength[0] === 0)
        return null
    if (!GetTokenInformation.native(tokenHandle, tokenInformationClass, binaryBuffer, pLength[0], pLength))
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
            SetLastError(50 /* ERROR_.NOT_SUPPORTED */)
            return null
    }

    function decodeSidAndAttributesHash(ptr: Pointer | Buffer<ArrayBuffer>): SID_AND_ATTRIBUTES_HASH {
        const ret = koffi.decode(ptr, cSID_AND_ATTRIBUTES_HASH) as SID_AND_ATTRIBUTES_HASH
        for (let i = 0; i < ret.SidCount; i++) {
            if (isPointer(ret.SidAttr[i].Sid))
                ret.SidAttr[i].Sid = koffi.decode(ret.SidAttr[i].Sid, cSID)
        }
        // Don't decode the Hash array
        return ret
    }
}

type TOKEN_INFORMATION =
    | TOKEN_USER | TOKEN_OWNER | TOKEN_GROUPS | TOKEN_PRIVILEGES | TOKEN_GROUPS_AND_PRIVILEGES
    | TOKEN_PRIMARY_GROUP | TOKEN_DEFAULT_DACL | TOKEN_SOURCE | TOKEN_ORIGIN | TOKEN_STATISTICS
    | TOKEN_LINKED_TOKEN | TOKEN_ELEVATION | TOKEN_ACCESS_INFORMATION | TOKEN_MANDATORY_LABEL | TOKEN_MANDATORY_POLICY
    | TOKEN_APPCONTAINER_INFORMATION | CLAIM_SECURITY_ATTRIBUTES_INFORMATION
    | number

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
