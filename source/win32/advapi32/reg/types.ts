import type { __HANDLE__ } from '../../internals.js'
import type { REG_ } from './consts.js'

export type HKEY = __HANDLE__<'HKEY'>

/**
 * Contains information about a registry value.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/ns-winreg-valentw
 */
export interface VALENT {
    ve_valuename: string
    ve_valuelen:  number
    ve_valueptr:  any
    ve_type:      REG_
}
