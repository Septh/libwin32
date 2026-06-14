import koffi from 'koffi'
import { Internals } from '../../internals.js'
import type { SID_IDENTIFIER_AUTHORITY } from './types.js'
import { cSID } from './ctypes.js'

export const SECURITY_APP_PACKAGE_AUTHORITY      = [ 0, 0, 0, 0, 0, 15 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_AUTHENTICATION_AUTHORITY   = [ 0, 0, 0, 0, 0, 18 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_CREATOR_SID_AUTHORITY      = [ 0, 0, 0, 0, 0,  3 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_LOCAL_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  2 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_MANDATORY_LABEL_AUTHORITY  = [ 0, 0, 0, 0, 0, 16 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NON_UNIQUE_AUTHORITY       = [ 0, 0, 0, 0, 0,  4 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NT_AUTHORITY               = [ 0, 0, 0, 0, 0,  5 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_NULL_SID_AUTHORITY         = [ 0, 0, 0, 0, 0,  0 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_PROCESS_TRUST_AUTHORITY    = [ 0, 0, 0, 0, 0, 19 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_RESOURCE_MANAGER_AUTHORITY = [ 0, 0, 0, 0, 0,  9 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_SCOPED_POLICY_ID_AUTHORITY = [ 0, 0, 0, 0, 0, 17 ] as const satisfies SID_IDENTIFIER_AUTHORITY
export const SECURITY_WORLD_SID_AUTHORITY        = [ 0, 0, 0, 0, 0,  1 ] as const satisfies SID_IDENTIFIER_AUTHORITY

/**
 * The SID_NAME_USE enumeration contains values that specify the type of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ne-winnt-sid_name_use
 */
export enum SID_NAME_USE {
    SidTypeUser = 1,
    SidTypeGroup,
    SidTypeDomain,
    SidTypeAlias,
    SidTypeWellKnownGroup,
    SidTypeDeletedAccount,
    SidTypeInvalid,
    SidTypeUnknown,
    SidTypeComputer,
    SidTypeLabel,
    SidTypeLogonSession
}

export const SID_REVISION = Internals.SID_REVISION
export const SIZEOF_SID = koffi.sizeof(cSID)
