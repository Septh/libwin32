import koffi from 'koffi-cream'
import { Win32Dll, Internals, binaryBuffer, type OUT } from '../private.js'
import { cBOOL, cBYTE, cINT, cDWORD, cHANDLE, cPVOID, type HTOKEN, cVOID } from '../ctypes.js'
import { cSID, type SID } from '../structs.js'

export const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

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

export function freeSid(sidPtr: unknown): void {
    freeSid.native ??= advapi32.func('FreeSid', cVOID, [ cPVOID ])
    freeSid.native(sidPtr)
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

export function getTokenInfo(hToken: HTOKEN, infoClass: TOKEN_INFORMATION_CLASS): boolean {
    getTokenInfo.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const pLength: OUT<number> = [0]
    return getTokenInfo.native(hToken, infoClass, binaryBuffer.buffer, binaryBuffer.byteLength, pLength) !== 0
}
