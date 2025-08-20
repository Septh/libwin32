import koffi from 'koffi-cream'
import { binaryBuffer, type OUT } from '../private.js'
import {
    cBOOL, cDWORD, cPVOID, cPDWORD,
    cHANDLE, type HANDLE, type HTOKEN
} from '../ctypes.js'
import {
    cPSID, type SID,
    cTOKEN_PRIVILEGES, type TOKEN_PRIVILEGES
} from '../structs.js'
import type { TOKEN_ } from '../consts.js'
import { advapi32 } from './lib.js'

/**
 * The AdjustTokenPrivileges function enables or disables privileges in the specified access token.
 *
 * Note: in libwin32, the function returns the previous state of any privileges that the function modifies.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/securitybaseapi/nf-securitybaseapi-adjusttokenprivileges
 */
export function AdjustTokenPrivileges(tokenHandle: HTOKEN, disableAllPrivileges: boolean, newState: TOKEN_PRIVILEGES | null = null): TOKEN_PRIVILEGES | null {
    AdjustTokenPrivileges.native ??= advapi32.func('AdjustTokenPrivileges', cBOOL, [
        cHANDLE, cBOOL, koffi.pointer(cTOKEN_PRIVILEGES), cDWORD, cPVOID, koffi.out(cPDWORD)
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
