import koffi from 'koffi-cream'
import { Win32Dll, Internals, binaryBuffer, type OUT } from '../private.js'
import { cBOOL, cBYTE, cINT, cDWORD, cHANDLE, cPVOID, type HTOKEN } from '../ctypes.js'
import {
    cLUID_AND_ATTRIBUTES,
    cSID, type SID,
    cSID_AND_ATTRIBUTES, type SID_AND_ATTRIBUTES,
    cSID_AND_ATTRIBUTES_HASH, type SID_AND_ATTRIBUTES_HASH,
    cTOKEN_PRIVILEGES, type TOKEN_PRIVILEGES,
    cTOKEN_GROUPS, type TOKEN_GROUPS,
    cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, type CLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cCLAIM_SECURITY_ATTRIBUTE_V1,
} from '../structs.js'

export const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

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

// TODO: remove when Koffi's support for variable-length arrays is live.
export function decodeSid(ptr: unknown): SID {
    const [ Revision, SubAuthorityCount, ...IdentifierAuthority ] = koffi.decode(ptr, 0, cBYTE, 8) as [ number, number, number, number, number, number, number, number ]
    const SubAuthority: number[] = Array.from(koffi.decode(ptr, koffi.offsetof(cSID, 'SubAuthority'), cDWORD, SubAuthorityCount))
    SubAuthority.length = Internals.SID_MAX_SUB_AUTHORITIES
    SubAuthority.fill(0, SubAuthorityCount)
    return {
        Revision,
        SubAuthorityCount,
        IdentifierAuthority,
        SubAuthority
    }
}

// TODO: remove when Koffi's support for variable-length arrays is live.
export function decodeSidAndAttributesHash(ptr: unknown): SID_AND_ATTRIBUTES_HASH {
    const ret: SID_AND_ATTRIBUTES_HASH = koffi.decode(ptr, cSID_AND_ATTRIBUTES_HASH)
    if (ret.SidAttr) {
        ret.SidAttr = koffi.decode(ret.SidAttr, cSID_AND_ATTRIBUTES, ret.SidCount)
        ret.SidAttr.forEach(sid => sid.Sid = decodeSid(sid.Sid))
    }
    else ret.SidAttr = [], ret.SidCount = 0
    return ret
}

// TODO: remove when Koffi's support for variable-length arrays is live.
export function decodeTokenPrivileges(ptr: unknown): TOKEN_PRIVILEGES {
    const ret: TOKEN_PRIVILEGES = koffi.decode(ptr, cTOKEN_PRIVILEGES)
    if (ret.Privileges) {
        ret.Privileges = koffi.decode(ptr, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
    }
    else ret.Privileges = [], ret.PrivilegeCount = 0
    return ret
}

// TODO: remove when Koffi's support for variable-length arrays is live.
export function decodeTokenGroups(ptr: unknown): TOKEN_GROUPS {
    const ret: TOKEN_GROUPS = koffi.decode(ptr, cTOKEN_GROUPS)
    if (ret.GroupCount > 0) {
        ret.Groups = koffi.decode(ptr, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
        ret.Groups.forEach(group => group.Sid = decodeSid(group.Sid))
    }
    else ret.Groups = []
    return ret
}

// TODO: remove when Koffi's support for variable-length arrays is live.
export function decodeClaimSecurityAttributesInformation(ptr: unknown): CLAIM_SECURITY_ATTRIBUTES_INFORMATION {
    const ret: CLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.decode(ptr, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION)
    if (ret.Attribute?.pAttributeV1) {
        ret.Attribute = {
            pAttributeV1: koffi.decode(ret.Attribute, cCLAIM_SECURITY_ATTRIBUTE_V1, ret.AttributeCount)
        }
    }
    else {
        ret.AttributeCount = 0
        ret.Attribute = { pAttributeV1: [] }
    }
    return ret
}

// Called by GetTokenInformation() and the various GetToken<xxx>Information() stubs.
export function getTokenInfo(hToken: HTOKEN, infoClass: INTERNAL_TOKEN_INFORMATION_CLASS, tokenInformationLength = binaryBuffer.byteLength): boolean {
    getTokenInfo.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, cPVOID, cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const pLength: OUT<number> = [0]
    return getTokenInfo.native(hToken, infoClass, binaryBuffer.buffer, tokenInformationLength, pLength) !== 0
}
