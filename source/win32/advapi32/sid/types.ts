import { SID_REVISION } from './consts.js'

/**
 * The security identifier (SID) structure is a variable-length structure used to uniquely identify users or groups.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid
 */
export class SID {
    readonly Revision = SID_REVISION
    public SubAuthorityCount = 0
    public SubAuthority: number[] = null!
    public IdentifierAuthority: SID_IDENTIFIER_AUTHORITY  = null!
}

/**
 * The SID_IDENTIFIER_AUTHORITY structure represents the top-level authority of a security identifier (SID).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_identifier_authority
 */
export type SID_IDENTIFIER_AUTHORITY = [ number, number, number, number, number, number ]

/**
 * The SID_AND_ATTRIBUTES structure represents a security identifier (SID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes
 */
export interface SID_AND_ATTRIBUTES {
    Sid: SID
    Attributes: number
}

/**
 * The SID_AND_ATTRIBUTES_HASH structure specifies a hash values for the specified array of security identifiers (SIDs).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-sid_and_attributes_hash
 */
export interface SID_AND_ATTRIBUTES_HASH {
    SidCount: number
    SidAttr:  SID_AND_ATTRIBUTES[]
    Hash:     readonly unknown[]
}
