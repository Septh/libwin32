import { Internals } from '../../internals.js'
import { ACCESS_MASK } from '../../chore/consts.js'

/**
 * Token Specific Access Rights.
 */
export enum TOKEN_ {
    ASSIGN_PRIMARY    = 0x0001,
    DUPLICATE         = 0x0002,
    IMPERSONATE       = 0x0004,
    QUERY             = 0x0008,
    QUERY_SOURCE      = 0x0010,
    ADJUST_PRIVILEGES = 0x0020,
    ADJUST_GROUPS     = 0x0040,
    ADJUST_DEFAULT    = 0x0080,
    ADJUST_SESSIONID  = 0x0100,

    ALL_ACCESS = ACCESS_MASK.STANDARD_RIGHTS_REQUIRED
                 | ASSIGN_PRIMARY
                 | DUPLICATE | IMPERSONATE | QUERY | QUERY_SOURCE
                 | ADJUST_PRIVILEGES | ADJUST_GROUPS | ADJUST_DEFAULT
}

/**
 * The TOKEN_ELEVATION_TYPE enumeration indicates the elevation type of token being queried by the GetTokenInformation() function.
 */
export enum TOKEN_ELEVATION_TYPE {
    TokenElevationTypeDefault = 1,
    TokenElevationTypeFull,
    TokenElevationTypeLimited
}

/**
 * Token information class values for GetTokenInformation() and SetTokenInformation().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-token_information_class
 */
export enum TOKEN_INFORMATION_CLASS {
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
    /** @deprecated */TokenSessionReference,
    TokenSandBoxInert,
    /** @deprecated */TokenAuditPolicy,
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
    /** @deprecated */TokenRestrictedUserClaimAttributes,
    /** @deprecated */TokenRestrictedDeviceClaimAttributes,
    TokenDeviceGroups,
    TokenRestrictedDeviceGroups,
    /** @deprecated */TokenSecurityAttributes,
    /** @deprecated */TokenIsRestricted,
    /** @deprecated */TokenProcessTrustLevel,
    /** @deprecated */TokenPrivateNameSpace,
    /** @deprecated */TokenSingletonAttributes,
    /** @deprecated */TokenBnoIsolation,
    /** @deprecated */TokenChildProcessFlags,
    /** @deprecated */TokenIsLessPrivilegedAppContainer,
    /** @deprecated */TokenIsSandboxed,
    /** @deprecated */TokenIsAppSilo,
    /** @deprecated */TokenLastEnforce = TokenIsAppSilo
}

export const TOKEN_SOURCE_LENGTH = Internals.TOKEN_SOURCE_LENGTH

export enum TOKEN_TYPE {
    TokenPrimary = 1,
    TokenImpersonation
}
