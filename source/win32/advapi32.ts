import { koffi, Win32Dll, StringOutputBuffer, Internals, type OUT } from './private.js'
import {
    cVOID, cBOOL, cINT, cBYTE, cDWORD, cULONG, cPVOID, cSTR,
    cHANDLE, type HANDLE, type HTOKEN, type LSA_HANDLE, type HKEY,
    cLSTATUS, type LSTATUS,
    cNTSTATUS,
} from './ctypes.js'
import {
    cACL,
    cCLAIM_SECURITY_ATTRIBUTES_INFORMATION, type CLAIM_SECURITY_ATTRIBUTES_INFORMATION,
    cLSA_OBJECT_ATTRIBUTES, cLSA_UNICODE_STRING, LSA_UNICODE_STRING,
    cLUID_AND_ATTRIBUTES,
    cSID_AND_ATTRIBUTES, cSID_AND_ATTRIBUTES_HASH, cSID, type SID,
    cSID_IDENTIFIER_AUTHORITY, type SID_IDENTIFIER_AUTHORITY,
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
    cTOKEN_STATISTICS, LSA_OBJECT_ATTRIBUTES, type TOKEN_STATISTICS,
    cTOKEN_USER, type TOKEN_USER,
    cSECURITY_ATTRIBUTES, type SECURITY_ATTRIBUTES,
    cFILETIME, type FILETIME
} from './structs.js'
import {
    TOKEN_INFORMATION_CLASS,
    type NTSTATUS_, type TOKEN_, type POLICY_,
    type HKEY_, type REG_OPTION_, type KEY_, type REG_, type RRF_,
    type SID_NAME_USE
} from './consts.js'

const advapi32 = /*#__PURE__*/new Win32Dll('advapi32.dll')

/**
 * Allocates and initializes a security identifier (SID) with up to eight subauthorities.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-allocateandinitializesid
 *
 * Note: in libwin32, because the allocated SID is turned into a JS object, its memory is immediately returned to the system
 *       by this function. The net effect is that you don't need to call {@link FreeSid()} afterwards (which is a NOOP anyway).
 */
export function AllocateAndInitializeSid(identifierAuthority: SID_IDENTIFIER_AUTHORITY, subAuthorityCount: number, subAuthority0: number, subAuthority1: number, subAuthority2: number, subAuthority3: number, subAuthority4: number, subAuthority5: number, subAuthority6: number, subAuthority7: number): SID | null {
    AllocateAndInitializeSid.native ??= advapi32.func('AllocateAndInitializeSid', cBOOL, [ koffi.pointer(cSID_IDENTIFIER_AUTHORITY), cBYTE, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, cDWORD, koffi.out(koffi.pointer((cPVOID))) ])

    const pSID: OUT<SID> = [null!]
    if (AllocateAndInitializeSid.native([ identifierAuthority ], subAuthorityCount, subAuthority0, subAuthority1, subAuthority2, subAuthority3, subAuthority4, subAuthority5, subAuthority6, subAuthority7, pSID) !== 0) {
        const sid = _decodeAndCleanSid(pSID[0])
        _freeSid(pSID[0])
        return sid
    }
    return null
}

// Note: the SID parameter is actually a Koffi pointer.
function _decodeAndCleanSid(pSID: SID): SID {
    const sid: SID = koffi.decode(pSID, cSID)
    for (let i = sid.SubAuthorityCount; i < Internals.SID_MAX_SUB_AUTHORITIES; i++)
        sid.SubAuthority[i] = 0
    return sid
}

// Ditto.
function _freeSid(pSID: SID): void {
    _freeSid.native ??= advapi32.func('FreeSid', cVOID, [ cPVOID ])
    _freeSid.native(pSID)
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
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-freesid
 *
 * Note: because libwin32 doesn't keep pointers to allocated memory around, this functions is a NOOP.
 *       See `AllocateAndInitializeSid()` for details.
 */
export function FreeSid(_sid: SID): void {}

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
    GetTokenInformation.native ??= advapi32.func('GetTokenInformation', cBOOL, [ cHANDLE, cINT, koffi.out(cPVOID), cDWORD, koffi.out(koffi.pointer(cDWORD)) ])

    const output = new Uint8Array(4096)
    const pLength: OUT<number> = [0]
    if (GetTokenInformation.native(tokenHandle, tokenInformationClass, output.buffer, output.byteLength, pLength) === 0)
        return null

    switch (tokenInformationClass) {
        case TOKEN_INFORMATION_CLASS.TokenUser: {
            const ret: TOKEN_USER = koffi.decode(output, cTOKEN_USER)
            ret.User.Sid = _decodeAndCleanSid(ret.User.Sid)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedSids:
        case TOKEN_INFORMATION_CLASS.TokenLogonSid:
        case TOKEN_INFORMATION_CLASS.TokenCapabilities:
        case TOKEN_INFORMATION_CLASS.TokenDeviceGroups:
        case TOKEN_INFORMATION_CLASS.TokenRestrictedDeviceGroups: {
            const ret: TOKEN_GROUPS = koffi.decode(output, cTOKEN_GROUPS)
            ret.Groups = koffi.decode(output, koffi.offsetof(cTOKEN_GROUPS, 'Groups'), cSID_AND_ATTRIBUTES, ret.GroupCount)
            ret.Groups.forEach(group => group.Sid = _decodeAndCleanSid(group.Sid))
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrivileges: {
            const ret: TOKEN_PRIVILEGES = koffi.decode(output, cTOKEN_PRIVILEGES)
            ret.Privileges = koffi.decode(output, koffi.offsetof(cTOKEN_PRIVILEGES, 'Privileges'), cLUID_AND_ATTRIBUTES, ret.PrivilegeCount)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenOwner: {
            const ret: TOKEN_OWNER = koffi.decode(output, cTOKEN_OWNER)
            ret.Owner = _decodeAndCleanSid(ret.Owner)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenPrimaryGroup: {
            const ret: TOKEN_PRIMARY_GROUP = koffi.decode(output, cTOKEN_PRIMARY_GROUP)
            ret.PrimaryGroup = _decodeAndCleanSid(ret.PrimaryGroup)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenDefaultDacl: {
            const ret: TOKEN_DEFAULT_DACL = koffi.decode(output, cTOKEN_DEFAULT_DACL)
            ret.DefaultDacl = koffi.decode(ret.DefaultDacl, cACL)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenSource: {
            const ret: TOKEN_SOURCE = koffi.decode(output, cTOKEN_SOURCE)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenStatistics: {
            const ret: TOKEN_STATISTICS = koffi.decode(output, cTOKEN_STATISTICS)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenGroupsAndPrivileges: {
            const ret: TOKEN_GROUPS_AND_PRIVILEGES = koffi.decode(output, cTOKEN_GROUPS_AND_PRIVILEGES)

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
            const ret: TOKEN_ORIGIN = koffi.decode(output, cTOKEN_ORIGIN)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenLinkedToken: {
            const ret: TOKEN_LINKED_TOKEN = koffi.decode(output, cTOKEN_LINKED_TOKEN)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenElevation: {
            const ret: TOKEN_ELEVATION = koffi.decode(output, cTOKEN_ELEVATION)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenAccessInformation: {
            const ret: TOKEN_ACCESS_INFORMATION = koffi.decode(output, cTOKEN_ACCESS_INFORMATION)

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
            const ret: TOKEN_MANDATORY_LABEL = koffi.decode(output, cTOKEN_MANDATORY_LABEL)
            ret.Label.Sid = _decodeAndCleanSid(ret.Label.Sid)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenMandatoryPolicy: {
            const ret: TOKEN_MANDATORY_POLICY = koffi.decode(output, cTOKEN_MANDATORY_POLICY)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenAppContainerSid: {
            const ret: TOKEN_APPCONTAINER_INFORMATION = koffi.decode(output, cTOKEN_APPCONTAINER_INFORMATION)
            ret.TokenAppContainer = _decodeAndCleanSid(ret.TokenAppContainer)
            return ret
        }

        case TOKEN_INFORMATION_CLASS.TokenUserClaimAttributes:
        case TOKEN_INFORMATION_CLASS.TokenDeviceClaimAttributes: {
            const ret: CLAIM_SECURITY_ATTRIBUTES_INFORMATION = koffi.decode(output, cCLAIM_SECURITY_ATTRIBUTES_INFORMATION)
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
            const ptr = new Uint32Array(output.buffer)
            return ptr[0]
        }

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
 * Retrieves the name of the account for a security identifier (SID) and the name of the domain where the account was found.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-lookupaccountsidw
 */
export function LookupAccountSid(systemName: string | null, sid: SID): LookupAccountSidResult | null {
    LookupAccountSid.native ??= advapi32.func('LookupAccountSidW', cBOOL, [ cSTR, koffi.pointer(cSID), koffi.out(cPVOID), koffi.inout(koffi.pointer(cDWORD)), koffi.out(cPVOID), koffi.inout(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cINT)) ])

    const name = new StringOutputBuffer(Internals.UNLEN)
    const domain = new StringOutputBuffer(256)
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
    const pHandle: OUT<LSA_HANDLE | null> = [null]
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

    const pHandle: OUT<HTOKEN | null> = [null]
    if (OpenProcessToken.native(processHandle, desiredAccess, pHandle) !== 0)
        return pHandle[0]
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
export function RegDeleteKeyValue(hKey: HKEY | HKEY_, subKey?: string, valueName?: string): LSTATUS {
    RegDeleteKeyValue.native ??= advapi32.func('RegDeleteKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR ])
    return RegDeleteKeyValue.native(hKey, subKey, valueName)
}

/**
 * Deletes the subkeys and values of the specified key recursively.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletetreew
 */
export function RegDeleteTree(hKey: HKEY | HKEY_, subKey?: string): LSTATUS {
    RegDeleteTree.native ??= advapi32.func('RegDeleteTreeW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegDeleteTree.native(hKey, subKey)
}

/**
 * Removes a named value from the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletevaluew
 */
export function RegDeleteValue(hKey: HKEY | HKEY_, valueName?: string): LSTATUS {
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
    const className = new StringOutputBuffer(Internals.MAX_VALUE_NAME + 1)
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
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumvaluew
 */
export function RegEnumValue(hKey: HKEY | HKEY_, index: number): RegEnumValueResult | LSTATUS {
    RegEnumValue.native ??= advapi32.func('RegEnumValueW', cLSTATUS, [ cHANDLE, cDWORD, cPVOID, koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cDWORD)), koffi.out(koffi.pointer(cBYTE)), koffi.out(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.MAX_VALUE_NAME + 1)
    const pType: OUT<REG_> = [0]
    const status: LSTATUS = RegEnumValue.native(hKey, index, name.buffer, name.pLength, null, pType, null, null)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            name: name.decode(),
            type: pType[0]
        }
    }
    return status
}

export interface RegEnumValueResult {
    name: string
    type: REG_
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
export function RegGetValue(hKey: HKEY | HKEY_, subKey: string | null, value: string | null, flags: RRF_, cbData: number = 16384): RegGetValueResult | LSTATUS {
    RegGetValue.native ??= advapi32.func('RegGetValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, koffi.out(koffi.pointer(cDWORD)), koffi.out(cPVOID), koffi.out(koffi.pointer(cDWORD)) ])

    const pType: OUT<REG_> = [0]
    const pData = new Uint8Array(cbData)
    const pcbData: OUT<number> = [cbData]
    const status: LSTATUS = RegGetValue.native(hKey, subKey, value, flags, pType, pData.buffer, pcbData)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            type: pType[0],
            data: pData,
            cbData: pData.byteLength
        }
    }
    return status
}

export interface RegGetValueResult {
    type: REG_
    data: Uint8Array
    cbData: number
}

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
export function RegOpenKeyEx(hKey: HKEY | HKEY_, subKey: string | undefined, options: REG_OPTION_, samDesired: KEY_): HKEY | LSTATUS {
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

    const className = new StringOutputBuffer(Internals.MAX_PATH)
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
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string, type: REG_, data: any, cbData: number): LSTATUS {
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
