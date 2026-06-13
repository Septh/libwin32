import { Union } from 'koffi'
import type { HANDLE } from '../internals.js'
import type { GUID } from '../misc/types.js'
import type { HKEY } from '../advapi32/types.js'
import type { HWND, HICON, HMONITOR } from '../user32/types.js'
import type { SW_ } from '../user32/consts.js'
import {
    SIZEOF_NOTIFYICONDATA, SIZEOF_SHELLEXECUTEINFO,
    type SE_ERR_, type SEE_MASK_, type NIF_
} from './consts.js'
import { cNOTIFYICONDATA_DUMMYUNIONNAME } from './ctypes.js'

/**
 * Contains information that the system needs to display notifications in the notification area.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-notifyicondataw
 */
export class NOTIFYICONDATA {
    readonly cbSize = SIZEOF_NOTIFYICONDATA
    readonly DUMMYUNIONNAME = new Union(cNOTIFYICONDATA_DUMMYUNIONNAME) as {
        uTimeout?: number
        uVersion?: number
    }
    public hWnd:             HWND   = null!
    public uID:              number = 0
    public uFlags:           NIF_   = 0 as NIF_
    public uCallbackMessage: number = 0
    public hIcon:            HICON  = null!
    public szTip:            string = null!
    public dwState:          number = 0
    public dwStateMask:      number = 0
    public szInfo:           string = null!
    public szInfoTitle:      string = null!
    public dwInfoFlags:      number = 0
    public guidItem:         GUID   = null!
    public hBalloonIcon:     HICON  = null!
}

/**
 * Contains information used by ShellExecuteEx().
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-shellexecuteinfow
 */
export class SHELLEXECUTEINFO {
    readonly cbSize = SIZEOF_SHELLEXECUTEINFO
    readonly hInstApp: SE_ERR_ = 0 as SE_ERR_
    readonly hProcess: HANDLE | null = null
    public lpVerb:       string    = null!
    public fMask:        SEE_MASK_ = 0
    public lpFile:       string    = null!
    public lpParameters: string    = null!
    public lpDirectory:  string    = null!
    public hwnd:         HWND      = null!
    public nShow:        SW_       = 0
    public lpClass:      string    = null!
    public hkeyClass:    HKEY      = null!
    public dwHotKey:     number    = 0
    public lpIDList:     any       = null
    public hMonitor:     HMONITOR  = null!
}
