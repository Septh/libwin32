import koffi from 'koffi-cream'
import { Win32Dll, Internals, binaryBuffer, type OUT } from '../private.js'
import { cBOOL, cBYTE, cINT, cDWORD, cHANDLE, cPVOID, type HTOKEN } from '../ctypes.js'
import { cSID, type SID } from '../structs.js'

export const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

// To be removed when Koffi has support for variable-length arrays is live.
export function decodeSid(sidPtr: unknown): SID {

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

export const enum TOKEN_INFORMATION_CLASS {
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

const dwTokens = /*#__PURE__*/new Set<TOKEN_INFORMATION_CLASS>([
    TOKEN_INFORMATION_CLASS.TokenType,
    TOKEN_INFORMATION_CLASS.TokenImpersonationLevel,
    TOKEN_INFORMATION_CLASS.TokenSessionId,
    TOKEN_INFORMATION_CLASS.TokenSandBoxInert,
    TOKEN_INFORMATION_CLASS.TokenElevationType,
    TOKEN_INFORMATION_CLASS.TokenElevation,
    TOKEN_INFORMATION_CLASS.TokenHasRestrictions,
    TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed,
    TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled,
    TOKEN_INFORMATION_CLASS.TokenUIAccess,
    TOKEN_INFORMATION_CLASS.TokenIsAppContainer,
    TOKEN_INFORMATION_CLASS.TokenAppContainerNumber,
])

const pTokens = /*#__PURE__*/new Set<TOKEN_INFORMATION_CLASS>([
    TOKEN_INFORMATION_CLASS.TokenLinkedToken,
    TOKEN_INFORMATION_CLASS.TokenAppContainerSid,
])

// Called by the various GetToken<xxx>Information() stubs.
export function getTokenInfo(hToken: HTOKEN, infoClass: TOKEN_INFORMATION_CLASS): boolean {
    getTokenInfo.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const bufferLength = dwTokens.has(infoClass)
        ? koffi.sizeof(cDWORD)
        : pTokens.has(infoClass)
            ? koffi.sizeof(cPVOID)
            : binaryBuffer.length
    const pLength: OUT<number> = [0]
    return getTokenInfo.native(hToken, infoClass, binaryBuffer.buffer, bufferLength, pLength) !== 0
}
