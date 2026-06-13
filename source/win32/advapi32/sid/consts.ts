import koffi from 'koffi'
import { Internals } from '../../internals.js'
import type { SID_IDENTIFIER_AUTHORITY } from './types.js'
import { cSID } from './ctypes.js'

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

export const SECURITY_APP_PACKAGE_AUTHORITY: SID_IDENTIFIER_AUTHORITY      = [ 0, 0, 0, 0, 0, 15 ]
export const SECURITY_AUTHENTICATION_AUTHORITY: SID_IDENTIFIER_AUTHORITY   = [ 0, 0, 0, 0, 0, 18 ]
export const SECURITY_CREATOR_SID_AUTHORITY: SID_IDENTIFIER_AUTHORITY      = [ 0, 0, 0, 0, 0,  3 ]
export const SECURITY_LOCAL_SID_AUTHORITY: SID_IDENTIFIER_AUTHORITY        = [ 0, 0, 0, 0, 0,  2 ]
export const SECURITY_MANDATORY_LABEL_AUTHORITY: SID_IDENTIFIER_AUTHORITY  = [ 0, 0, 0, 0, 0, 16 ]
export const SECURITY_NON_UNIQUE_AUTHORITY: SID_IDENTIFIER_AUTHORITY       = [ 0, 0, 0, 0, 0,  4 ]
export const SECURITY_NT_AUTHORITY: SID_IDENTIFIER_AUTHORITY               = [ 0, 0, 0, 0, 0,  5 ]
export const SECURITY_NULL_SID_AUTHORITY: SID_IDENTIFIER_AUTHORITY         = [ 0, 0, 0, 0, 0,  0 ]
export const SECURITY_PROCESS_TRUST_AUTHORITY: SID_IDENTIFIER_AUTHORITY    = [ 0, 0, 0, 0, 0, 19 ]
export const SECURITY_RESOURCE_MANAGER_AUTHORITY: SID_IDENTIFIER_AUTHORITY = [ 0, 0, 0, 0, 0,  9 ]
export const SECURITY_SCOPED_POLICY_ID_AUTHORITY: SID_IDENTIFIER_AUTHORITY = [ 0, 0, 0, 0, 0, 17 ]
export const SECURITY_WORLD_SID_AUTHORITY: SID_IDENTIFIER_AUTHORITY        = [ 0, 0, 0, 0, 0,  1 ]
