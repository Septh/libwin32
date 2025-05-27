import { koffi, Win32Dll, textDecoder, Internals } from './private.js'
import {
    cBOOL, cDWORD, cULONG, cPVOID, cPDWORD, cPWSTR, cNTSTATUS,
    cHANDLE, type HANDLE, type HTOKEN, type LSA_HANDLE,
    type OUT,
    cBYTE,
    cVOID
} from './ctypes.js'
import {
    cACL, type ACL,
    cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, type CLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cLSA_OBJECT_ATTRIBUTES, type LSA_OBJECT_ATTRIBUTES,
    cLSA_UNICODE_STRING, LSA_UNICODE_STRING,
    cLUID_AND_ATTRIBUTES, type LUID_AND_ATTRIBUTES,
    cSID_AND_ATTRIBUTES_HASH, type SID_AND_ATTRIBUTES_HASH,
    cSID_AND_ATTRIBUTES, type SID_AND_ATTRIBUTES,
    cSID, type SID,
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
    cSID_IDENTIFIER_AUTHORITY, type SID_IDENTIFIER_AUTHORITY
} from './structs.js'
import {
    UNLEN, TOKEN_INFORMATION_CLASS,
    type NTSTATUS_,
    type SID_NAME_USE, type ACCESS_MASK, type TOKEN_
} from './consts.js'

const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

/**
 * Allocates and initializes a security identifier (SID) with up to eight subauthorities.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-allocateandinitializesid
 *
 * Note: because the allocated SID is turned into a JS object, its memory is immediately returned to the system
 *       by this function. The net effect is that you don't need to call FreeSid() afterwards.
 */
export function AllocateAndInitializeSid(pIdentifierAuthority: SID_IDENTIFIER_AUTHORITY, nSubAuthorityCount: number, nSubAuthority0: number, nSubAuthority1: number, nSubAuthority2: number, nSubAuthority3: number, nSubAuthority4: number, nSubAuthority5: number, nSubAuthority6: number, nSubAuthority7: number): SID | null {
    AllocateAndInitializeSid.native ??= advapi32.func('AllocateAndInitializeSid', cBOOL, [ koffi.pointer(cSID_IDENTIFIER_AUTHORITY), cBYTE, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, koffi.out(koffi.pointer(cPVOID)) ])

    const pSID: OUT<SID> = [ null! ]
    if (!AllocateAndInitializeSid.native([ pIdentifierAuthority ], nSubAuthorityCount, nSubAuthority0, nSubAuthority1, nSubAuthority2, nSubAuthority3, nSubAuthority4, nSubAuthority5, nSubAuthority6, nSubAuthority7, pSID))
        return null

    const sid = _decodeAndCleanSid(pSID[0])
    _freeSid(pSID[0])
    return sid
}

// Note: the SID parameter type is only a type guard, as the actual value is a Koffi pointer.
function _decodeAndCleanSid(pSID: SID): SID {
    const sid: SID = koffi.decode(pSID, cSID)
    for (let i = sid.SubAuthorityCount; i < Internals.SID_MAX_SUB_AUTHORITIES; i++)
        sid.SubAuthority[i] = 0
    return sid
}

// Ditto.
function _freeSid(pSID: SID): void {
    _freeSid.native ??= advapi32.func('FreeSid', cVOID, [ cPVOID ])
    if (pSID) {
        _freeSid.native(pSID)
    }
}

/**
 * Tests two security identifier (SID) values for equality.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-equalsid
 */
export function EqualSid(pSid1: SID, pSid2: SID): boolean {
    EqualSid.native ??= advapi32.func('EqualSid', cBOOL, [ koffi.pointer(cSID), koffi.pointer(cSID) ])
    return Boolean(EqualSid.native(pSid1, pSid2))
}

/**
 * Frees a security identifier (SID) previously allocated by using the AllocateAndInitializeSid function.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-freesid
 *
 * Note: because libwin32 doesn't keep pointers to allocated memory around, this functions is a NOOP.
 *       See `AllocateAndInitializeSid()` for details.
 */
export function FreeSid(pSid: SID): void {}

/**
 * Retrieves a specified type of information about an access token. The calling process must have appropriate access rights to obtain the information.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-gettokeninformation
 */
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUser):                   TOKEN_USER | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenGroups):                 TOKEN_GROUPS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenPrivileges):             TOKEN_PRIVILEGES | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenOwner):                  TOKEN_OWNER | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenPrimaryGroup):           TOKEN_PRIMARY_GROUP | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDefaultDacl):            TOKEN_DEFAULT_DACL | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSource):                 TOKEN_SOURCE | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenType):                   number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenImpersonationLevel):     number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenStatistics):             TOKEN_STATISTICS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenRestrictedSids):         TOKEN_GROUPS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSessionId):              number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges):    TOKEN_GROUPS_AND_PRIVILEGES | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenSandBoxInert):           number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenOrigin):                 TOKEN_ORIGIN | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenElevationType):          number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenLinkedToken):            TOKEN_LINKED_TOKEN | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenElevation):              TOKEN_ELEVATION | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenHasRestrictions):        number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAccessInformation):      TOKEN_ACCESS_INFORMATION | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed):  number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled):  number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenIntegrityLevel):         TOKEN_MANDATORY_LABEL | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUIAccess):               number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy):        TOKEN_MANDATORY_POLICY | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenLogonSid):               TOKEN_GROUPS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenIsAppContainer):         number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenCapabilities):           TOKEN_GROUPS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAppContainerSid):        TOKEN_APPCONTAINER_INFORMATION | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenAppContainerNumber):     number | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes):    CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes):  CLAIM_SECURITY_ATTRIBUTES_INFORMATION | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenDeviceGroups):           TOKEN_GROUPS | null
export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups): TOKEN_GROUPS | null

export function GetTokenInformation(TokenHandle: HTOKEN, TokenInformationClass: TOKEN_INFORMATION_CLASS) {
    GetTokenInformation.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cDWORD, koffi.out(cPVOID), cDWORD, koffi.out(cPDWORD) ])

    const out = new Uint8Array(4096)
    const returnLength: OUT<number> = [ 0 ]
    if (GetTokenInformation.native(TokenHandle, TokenInformationClass, out, out.byteLength, returnLength) === 0)
        return null

    switch (TokenInformationClass) {
        case TOKEN_INFORMATION_CLASS.TokenUser: {
            const ret: TOKEN_USER = koffi.decode(out, cTOKEN_USER)
            ret.User.Sid = _decodeAndCleanSid(ret.User.Sid)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedSids:
        case TOKEN_INFORMATION_CLASS.TokenLogonSid:
        case TOKEN_INFORMATION_CLASS.TokenCapabilities:
        case TOKEN_INFORMATION_CLASS.TokenDeviceGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups: {
            const ret: TOKEN_GROUPS = koffi.decode(out, cTOKEN_GROUPS)
            ret.Groups = koffi.decode(out, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
            ret.Groups.forEach(group => group.Sid = _decodeAndCleanSid(group.Sid))
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrivileges: {
            const ret: TOKEN_PRIVILEGES = koffi.decode(out, cTOKEN_PRIVILEGES)
            ret.Privileges = koffi.decode(out, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenOwner: {
            const ret: TOKEN_OWNER = koffi.decode(out, cTOKEN_OWNER)
            ret.Owner = _decodeAndCleanSid(ret.Owner)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrimaryGroup: {
            const ret: TOKEN_PRIMARY_GROUP = koffi.decode(out, cTOKEN_PRIMARY_GROUP)
            ret.PrimaryGroup = _decodeAndCleanSid(ret.PrimaryGroup)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenDefaultDacl: {
            const ret: TOKEN_DEFAULT_DACL = koffi.decode(out, cTOKEN_DEFAULT_DACL)
            ret.DefaultDacl = koffi.decode(ret.DefaultDacl, cACL)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenSource: {
            const ret: TOKEN_SOURCE = koffi.decode(out, cTOKEN_SOURCE)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenStatistics: {
            const ret: TOKEN_STATISTICS = koffi.decode(out, cTOKEN_STATISTICS)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges: {
            const ret: TOKEN_GROUPS_AND_PRIVILEGES = koffi.decode(out, cTOKEN_GROUPS_AND_PRIVILEGES)

            if (ret.Sids && ret.SidCount > 0) {
                ret.Sids = koffi.decode(ret.Sids, cSID_AND_ATTRIBUTES, ret.SidCount)
                ret.Sids.forEach(sid => sid.Sid = _decodeAndCleanSid(sid.Sid))
            }
            else ret.Sids = []

            if (ret.RestrictedSids && ret.RestrictedSidCount > 0) {
                ret.RestrictedSids = koffi.decode(ret.RestrictedSids, cSID_AND_ATTRIBUTES, ret.RestrictedSidCount)
                ret.RestrictedSids.forEach(sid => sid.Sid = _decodeAndCleanSid(sid.Sid))
            }
            else ret.RestrictedSids = []

            if (ret.Privileges && ret.PrivilegeCount > 0) {
                ret.Privileges = koffi.decode(ret.Privileges, cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
            }
            else ret.Privileges = []

            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenOrigin: {
            const ret: TOKEN_ORIGIN = koffi.decode(out, cTOKEN_ORIGIN)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenLinkedToken: {
            const ret: TOKEN_LINKED_TOKEN = koffi.decode(out, cTOKEN_LINKED_TOKEN)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenElevation: {
            const ret: TOKEN_ELEVATION = koffi.decode(out, cTOKEN_ELEVATION)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenAccessInformation: {
            const ret: TOKEN_ACCESS_INFORMATION = koffi.decode(out, cTOKEN_ACCESS_INFORMATION)

            ret.SidHash = koffi.decode(ret.SidHash, cSID_AND_ATTRIBUTES_HASH)
            ret.SidHash.SidAttr = koffi.decode(ret.SidHash.SidAttr, cSID_AND_ATTRIBUTES, ret.SidHash.SidCount)
            ret.SidHash.SidAttr.forEach(sid => sid.Sid = _decodeAndCleanSid(sid.Sid))

            ret.RestrictedSidHash = koffi.decode(ret.RestrictedSidHash, cSID_AND_ATTRIBUTES_HASH)
            ret.RestrictedSidHash.SidAttr = koffi.decode(ret.RestrictedSidHash.SidAttr, cSID_AND_ATTRIBUTES, ret.RestrictedSidHash.SidCount)
            ret.RestrictedSidHash.SidAttr.forEach(sid => sid.Sid = _decodeAndCleanSid(sid.Sid))

            ret.CapabilitiesHash = koffi.decode(ret.CapabilitiesHash, cSID_AND_ATTRIBUTES_HASH)
            ret.CapabilitiesHash.SidAttr = koffi.decode(ret.CapabilitiesHash.SidAttr, cSID_AND_ATTRIBUTES, ret.CapabilitiesHash.SidCount)
            ret.CapabilitiesHash.SidAttr.forEach(sid => sid.Sid = _decodeAndCleanSid(sid.Sid))

            const { Privileges } = ret
            ret.Privileges = koffi.decode(Privileges, cTOKEN_PRIVILEGES)
            ret.Privileges.Privileges = koffi.decode(Privileges, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.Privileges.PrivilegeCount)

            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenIntegrityLevel: {
            const ret: TOKEN_MANDATORY_LABEL = koffi.decode(out, cTOKEN_MANDATORY_LABEL)
            ret.Label.Sid = _decodeAndCleanSid(ret.Label.Sid)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy: {
            const ret: TOKEN_MANDATORY_POLICY = koffi.decode(out, cTOKEN_MANDATORY_POLICY)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenAppContainerSid: {
            const ret: TOKEN_APPCONTAINER_INFORMATION = koffi.decode(out, cTOKEN_APPCONTAINER_INFORMATION)
            ret.TokenAppContainer = _decodeAndCleanSid(ret.TokenAppContainer)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes:
        case TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes: {
            const ret: CLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.decode(out, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION)
            if (ret.Attribute && ret.AttributeCount > 0) {
                // TODO
            }
            return ret
        }

        // Theses queries return a DWORD.
        case TOKEN_INFORMATION_CLASS.TokenType:
        case TOKEN_INFORMATION_CLASS.TokenImpersonationLevel:
        case TOKEN_INFORMATION_CLASS.TokenSessionId:
        case TOKEN_INFORMATION_CLASS.TokenSandBoxInert:
        case TOKEN_INFORMATION_CLASS.TokenHasRestrictions:
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationAllowed:
        case TOKEN_INFORMATION_CLASS.TokenVirtualizationEnabled:
        case TOKEN_INFORMATION_CLASS.TokenUIAccess:
        case TOKEN_INFORMATION_CLASS.TokenIsAppContainer:
        case TOKEN_INFORMATION_CLASS.TokenAppContainerNumber:
        case TOKEN_INFORMATION_CLASS.TokenElevationType: {
            const ptr = new Uint32Array(out.buffer)
            return ptr[0]
        }

        // Dismiss all other cases
        default:
            return
    }
}

/**
 * Retrieves the name of the user associated with the current thread.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-getusernamew
 */
export function GetUserName(): string | null {
    GetUserName.native ??= advapi32.func('GetUserNameW', cBOOL, [ cPWSTR, koffi.inout(cPDWORD) ])

    const out = new Uint16Array(UNLEN + 1)
    const len: OUT<number> = [ out.length ]
    return GetUserName.native(out, len) === 0
        ? null
        : textDecoder.decode(out.subarray(0, len[0] - 1))   // -1 because GetUserName() includes the final \0
}

/**
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(
    lpSystemName: string | null,
    Sid: SID
): { Name: string, ReferencedDomainName: string, peUse: SID_NAME_USE } | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [
        cPWSTR, koffi.pointer(cSID),
        koffi.out(cPWSTR), koffi.inout(cPDWORD),
        koffi.out(cPWSTR), koffi.inout(cPDWORD),
        koffi.out(cPDWORD)
    ])

    const name = new Uint16Array(256)
    const cchName: OUT<number> = [ name.length ]
    const referencedDomainName = new Uint16Array(256)
    const cchReferencedDomainName: OUT<number> = [ referencedDomainName.length ]
    const peUse: OUT<number> = [ 0 ]

    return LookupAccountSid.native(lpSystemName, Sid, name, cchName, referencedDomainName, cchReferencedDomainName, peUse) === 0
        ? null
        : {
            Name: textDecoder.decode(name.subarray(0, cchName[0])),
            ReferencedDomainName: textDecoder.decode(referencedDomainName.subarray(0, cchReferencedDomainName[0])),
            peUse: peUse[0]
        }
}

/**
 * Closes a handle to a Policy or TrustedDomain object.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaclose
 */
export function LsaClose(ObjectHandle: LSA_HANDLE): NTSTATUS_ {
    LsaClose.native ??= advapi32.func('LsaClose', cNTSTATUS, [ cHANDLE ])
    return LsaClose.native(ObjectHandle)
}

/**
 * Converts an NTSTATUS code returned by an LSA function to a Windows error code.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsantstatustowinerror
 */
export function LsaNtStatusToWinError(Status: NTSTATUS_): number {
    LsaNtStatusToWinError.native ??= advapi32.func('LsaNtStatusToWinError', cULONG, [ cNTSTATUS ])
    return LsaNtStatusToWinError.native(Status)
}

/**
 * Opens a handle to the Policy object on a local or remote system.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/ntsecapi/nf-ntsecapi-lsaopenpolicy
 */
export function LsaOpenPolicy(SystemName: string | null, ObjectAttributes: LSA_OBJECT_ATTRIBUTES, DesiredAcces: ACCESS_MASK, PolicyHandle: LSA_HANDLE | null = null): LSA_HANDLE | null {
    LsaOpenPolicy.native ??= advapi32.func('LsaOpenPolicy', cNTSTATUS, [ koffi.pointer(cLSA_UNICODE_STRING), koffi.pointer(cLSA_OBJECT_ATTRIBUTES), cDWORD, koffi.inout(koffi.pointer(cHANDLE)) ])

    const lusSystemName = typeof SystemName === 'string' ? new LSA_UNICODE_STRING(SystemName) : null
    const pPolicyHandle: OUT<LSA_HANDLE> = [ PolicyHandle! ]
    return LsaOpenPolicy.native(lusSystemName, ObjectAttributes, DesiredAcces, pPolicyHandle) === 0
        ? pPolicyHandle[0]
        : null
}

/**
 * Opens the access token associated with a process.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-openprocesstoken
 */
export function OpenProcessToken(ProcessHandle: HANDLE, DesiredAccess: TOKEN_): HTOKEN | null {
    OpenProcessToken.native ??= advapi32.func('OpenProcessToken', cBOOL, [ cHANDLE, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const tokenHandle: OUT<HTOKEN> = [ null! ]
    return OpenProcessToken.native(ProcessHandle, DesiredAccess, tokenHandle) === 0
        ? null
        : tokenHandle[0]
}
