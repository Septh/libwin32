import koffi from 'koffi-cream'
import { binaryBuffer, type OUT } from '../private.js'
import { cBOOL, cINT, cDWORD, cHANDLE, cPVOID, cPDWORD, type HTOKEN } from '../ctypes.js'

export const advapi32 = koffi.load('advapi32.dll')

export const enum INTERNAL_TOKEN_INFORMATION_CLASS {
    TokenUser = 1,
    TokenGroups,
    TokenPrivileges,
    TokenOwner,
    TokenPrimaryGroup,
    TokenDefaultDacl,
    TokenSource,
    TokenType,
    TokenImpersonationLevel,
    TokenStatistics,
    TokenRestrictedSids,
    TokenSessionId,
    TokenGroupsAndPrivileges,
    TokenSessionReference,
    TokenSandBoxInert,
    TokenAuditPolicy,
    TokenOrigin,
    TokenElevationType,
    TokenLinkedToken,
    TokenElevation,
    TokenHasRestrictions,
    TokenAccessInformation,
    TokenVirtualizationAllowed,
    TokenVirtualizationEnabled,
    TokenIntegrityLevel,
    TokenUIAccess,
    TokenMandatoryPolicy,
    TokenLogonSid,
    TokenIsAppContainer,
    TokenCapabilities,
    TokenAppContainerSid,
    TokenAppContainerNumber,
    TokenUserClaimAttributes,
    TokenDeviceClaimAttributes,
    TokenRestrictedUserClaimAttributes,
    TokenRestrictedDeviceClaimAttributes,
    TokenDeviceGroups,
    TokenRestrictedDeviceGroups,
    TokenSecurityAttributes,
    TokenIsRestricted,
    TokenProcessTrustLevel,
    TokenPrivateNameSpace,
    TokenSingletonAttributes,
    TokenBnoIsolation,
    TokenChildProcessFlags,
    TokenIsLessPrivilegedAppContainer,
    TokenIsSandboxed,
    TokenIsAppSilo,
    TokenLastEnforce = TokenIsAppSilo,
    MaxTokenInfoClass
}

export function getTokenInfo(hToken: HTOKEN, infoClass: INTERNAL_TOKEN_INFORMATION_CLASS, tokenInformationLength = binaryBuffer.byteLength): boolean {
    getTokenInfo.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(cPDWORD) ])

    const pLength: OUT<number> = [0]
    return getTokenInfo.native(hToken, infoClass, binaryBuffer.buffer, tokenInformationLength, pLength) !== 0
}
