import type { __HANDLE__, HANDLE } from '../internals.js'

export type HINSTANCE = __HANDLE__<'HINSTANCE'>
export type HMODULE   = HINSTANCE                   // HMODULE can be used in lieu of HINSTANCE
export type WPARAM    = number | bigint | HANDLE
export type LPARAM    = number | bigint | HANDLE
export type HRESULT   = number | HANDLE
export type LRESULT   = number | bigint | HANDLE
export type ATOM      = number

/**
 * The GUID structure stores a GUID.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/guiddef/ns-guiddef-guid
 */
export interface GUID {
    Data1: number
    Data2: number
    Data3: number
    Data4: [ number, number, number, number, number, number, number, number ]
}

/**
 * The UUID structure is a typedef'd synonym for the GUID structure.
 */
export type UUID = GUID

/**
 * The LUID structure is an opaque structure that specifies an identifier that is guaranteed to be unique on the local machine.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid
 */
export interface LUID {
    LowPart: number
    HighPart: number
}

/**
 * The LUID_AND_ATTRIBUTES structure represents a locally unique identifier (LUID) and its attributes.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-luid_and_attributes
 */
export interface LUID_AND_ATTRIBUTES {
    Luid: LUID
    Attributes: number
}

/**
 * The POINT structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-point
 */
export interface POINT {
    x: number
    y: number
}

/**
 * The POINTS structure defines the x- and y-coordinates of a point.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-points
 */
export interface POINTS {
    x: number
    y: number
}

/**
 * The RECT structure defines a rectangle by the coordinates of its upper-left and lower-right corners.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-rect
 */
export interface RECT {
    left:   number
    top:    number
    right:  number
    bottom: number
}

/**
 * The SIZE structure defines the width and height of a rectangle.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/windef/ns-windef-size
 */
export interface SIZE {
    x: number
    y: number
}
