import koffi from 'koffi'
import { cNOTIFYICONDATA, cSHELLEXECUTEINFO } from './ctypes.js'

/**
 * Values for NOTIFYICONDATA.uFlags
 */
export enum NIF_ {
    MESSAGE  = 0x0001,
    ICON     = 0x0002,
    TIP      = 0x0004,
    STATE    = 0x0008,
    INFO     = 0x0010,
    GUID     = 0x0020,
    REALTIME = 0x0040,
    SHOWTIP  = 0x0080,
}

/**
 * Values for the dwMessage parameter of Shell_NotifyIcon()
 */
export enum NIM_ {
    ADD        = 0x00000000,
    MODIFY     = 0x00000001,
    DELETE     = 0x00000002,
    SETFOCUS   = 0x00000003,
    SETVERSION = 0x00000004,
}

/**
 * ShellExecute() and ShellExecuteEx() error codes
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-shellexecuteinfow
 */
export enum SE_ERR_ {
    FNF             = 2,
    PNF             = 3,
    ACCESSDENIED    = 5,
    OOM             = 8,
    DLLNOTFOUND     = 32,
    SHARE           = 26,
    ASSOCINCOMPLETE = 27,
    DDETIMEOUT      = 28,
    DDEFAIL         = 29,
    DDEBUSY         = 30,
    NOASSOC         = 31
}

/**
 * Flags for SHELLEXECUTEINFO.fMask
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/shellapi/ns-shellapi-shellexecuteinfow
 */
export enum SEE_MASK_ {
    DEFAULT           = 0x00000000,
    CLASSNAME         = 0x00000001,
    CLASSKEY          = 0x00000003,
    IDLIST            = 0x00000004,
    INVOKEIDLIST      = 0x0000000c,
    ICON              = 0x00000010,
    HOTKEY            = 0x00000020,
    NOCLOSEPROCESS    = 0x00000040,
    CONNECTNETDRV     = 0x00000080,
    NOASYNC           = 0x00000100,
    FLAG_DDEWAIT      = NOASYNC,
    DOENVSUBST        = 0x00000200,
    FLAG_NO_UI        = 0x00000400,
    UNICODE           = 0x00004000,
    NO_CONSOLE        = 0x00008000,
    ASYNCOK           = 0x00100000,
    HMONITOR          = 0x00200000,
    NOZONECHECKS      = 0x00800000,
    NOQUERYCLASSSTORE = 0x01000000,
    WAITFORINPUTIDLE  = 0x02000000,
    FLAG_LOG_USAGE    = 0x04000000,
    HINST_IS_SITE     = 0x08000000
}

export const SIZEOF_NOTIFYICONDATA = koffi.sizeof(cNOTIFYICONDATA)

export const SIZEOF_SHELLEXECUTEINFO = koffi.sizeof(cSHELLEXECUTEINFO)
