import { pointer, out, type koffi } from '../../private.js'
import {
    cBOOL, cDWORD, cLPVOID, cLPWSTR, cPDWORD, cLPDWORD,
    cHANDLE, type HANDLE
} from '../../ctypes.js'
import { advapi32 } from './_lib.js'


// #region Types

export const cPSID = pointer('PSID', cLPVOID)
export type PSID = HANDLE<'SID'>

export const cTOKEN_INFORMATION_CLASS = cDWORD
export type TOKEN_INFORMATION_CLASS = number

/**
 * Token information class values for GetTokenInformation and SetTokenInformation
 */
export enum TOKEN_INFORMATION {
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

// #endregion

// #region Functions

/**
 * Retrieves a specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export const GetTokenInformation: koffi.KoffiFunc<(
    TokenHandle: HANDLE<'TOKEN'>,
    TokenInformationClass: TOKEN_INFORMATION_CLASS,
    TokenInformation: number | null,
    TokenInformationLength: number,
    ReturnLength: { [0]: number }
) => number> = advapi32('GetTokenInformation', cBOOL, [
    cHANDLE,
    cTOKEN_INFORMATION_CLASS,
    cLPVOID,
    cDWORD,
    out(cPDWORD)
])

/**
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 * 
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export const LookupAccountSid: koffi.KoffiFunc<(
    lpSystemName: string | null,
    Sid: PSID,
    Name: Uint16Array | null,
    cchName: { [0]: number },
    ReferencedDomainName: Uint16Array | null,
    cchReferencedDomainName: { [0]: number },
    peUse: { [0]: number }
) => number> = advapi32('LookupAccountSidW', cBOOL, [
    cLPWSTR,
    cPSID,
    out(cLPWSTR),
    out(cLPDWORD),
    out(cLPWSTR),
    out(cPDWORD),
    out(pointer('PSID_NAME_USE', cDWORD))
])