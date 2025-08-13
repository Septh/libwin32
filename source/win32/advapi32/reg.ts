import assert from 'node:assert'
import koffi from 'koffi-cream'
import { binaryBuffer, textDecoder, StringOutputBuffer, Internals, type OUT } from '../private.js'
import {
    cVOID, cDWORD, cPVOID, cSTR, cLSTATUS,
    cHANDLE, type HKEY,
} from '../ctypes.js'
import {
    cSECURITY_ATTRIBUTES, type SECURITY_ATTRIBUTES,
    cFILETIME, type FILETIME
} from '../structs.js'
import {
    ERROR_,
    REG_, type REG_OPTION_,
    type HKEY_, type KEY_, type RRF_
} from '../consts.js'
import { advapi32 } from './lib.js'

type LSTATUS = ERROR_

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
    const status = RegConnectRegistry.native(machineName, hKey, pHandle)
    if (status === Internals.ERROR_SUCCESS)
        return pHandle[0]
    return status
}

/**
 * Copies the specified registry key, along with its values and subkeys, to the specified destination key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regcopytreew
 */
export function RegCopyTree(hKeySrc: HKEY | HKEY_, subKey: string | null, hKeyDest: HKEY | HKEY_): LSTATUS {
    RegCopyTree.native ??= advapi32.func('RegCopyTreeW', cLSTATUS, [ cHANDLE, cSTR, cHANDLE ])
    return RegCopyTree.native(hKeySrc, subKey, hKeyDest)
}

/**
 * Creates the specified registry key. If the key already exists, the function opens it.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regcreatekeyexw
 */
export function RegCreateKeyEx(hKey: HKEY | HKEY_, subKey: string, className: string | null, options: REG_OPTION_, samDesired: KEY_, securityAttributes: SECURITY_ATTRIBUTES | null): HKEY | LSTATUS {
    RegCreateKeyEx.native ??= advapi32.func('RegCreateKeyExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cSTR, cDWORD, cDWORD, koffi.pointer(cSECURITY_ATTRIBUTES), koffi.out(koffi.pointer(cHANDLE)), koffi.out(koffi.pointer(cDWORD)) ])

    const pHandle: OUT<HKEY> = [null!]
    const status = RegCreateKeyEx.native(hKey, subKey, 0, className, options, samDesired, securityAttributes, pHandle, null)
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
export function RegDeleteKeyValue(hKey: HKEY | HKEY_, subKey: string | null = null, valueName: string | null = null): LSTATUS {
    RegDeleteKeyValue.native ??= advapi32.func('RegDeleteKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR ])
    return RegDeleteKeyValue.native(hKey, subKey, valueName)
}

/**
 * Deletes the subkeys and values of the specified key recursively.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletetreew
 */
export function RegDeleteTree(hKey: HKEY | HKEY_, subKey: string | null = null): LSTATUS {
    RegDeleteTree.native ??= advapi32.func('RegDeleteTreeW', cLSTATUS, [ cHANDLE, cSTR ])
    return RegDeleteTree.native(hKey, subKey)
}

/**
 * Removes a named value from the specified registry key.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regdeletevaluew
 */
export function RegDeleteValue(hKey: HKEY | HKEY_, valueName: string | null = null): LSTATUS {
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
    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const lastWriteTime = {} as FILETIME
    const status = RegEnumKeyEx.native(hKey, index, name.buffer, name.pLength, null, className.buffer, className.pLength, lastWriteTime)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            name: name.decode(),
            className: className.decode(),
            lastWriteTime
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
 * Note: in libwin32, this function doest not return the value's data, only its type and size (in bytes).
 *       use {@link RegGetValue()} to actually read the data.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regenumvaluew
 */
export function RegEnumValue(hKey: HKEY | HKEY_, index: number): RegEnumValueResult | LSTATUS {
    RegEnumValue.native ??= advapi32.func('RegEnumValueW', cLSTATUS, [ cHANDLE, cDWORD, cPVOID, koffi.inout(koffi.pointer(cDWORD)), cPVOID, koffi.out(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const name = new StringOutputBuffer(Internals.MAX_KEY_LENGTH + 1)
    const pType: OUT<REG_> = [0]
    const pSize: OUT<number> = [0]
    const status = RegEnumValue.native(hKey, index, name.buffer, name.pLength, null, pType, null, pSize)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            name: name.decode(),
            type: pType[0],
            size: pSize[0]
        }
    }
    return status
}

export interface RegEnumValueResult {
    name: string
    type: REG_
    size: number
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
export function RegGetValue(hKey: HKEY | HKEY_, subKey: string | null, value: string | null, flags: RRF_): RegGetValueResult | LSTATUS {
    RegGetValue.native ??= advapi32.func('RegGetValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, koffi.out(koffi.pointer(cDWORD)), cPVOID, koffi.inout(koffi.pointer(cDWORD)) ])

    const pType: OUT<REG_> = [0]
    const pCount: OUT<number> = [binaryBuffer.byteLength]
    const status = RegGetValue.native(hKey, subKey, value, flags, pType, binaryBuffer, pCount)
    if (status === Internals.ERROR_SUCCESS) {
        const type = pType[0]
        const count = pCount[0]
        let value: any
        switch (type) {
            case REG_.NONE:
                value = null
                break

            case REG_.SZ:
            case REG_.EXPAND_SZ:
                value = new Uint16Array(binaryBuffer.buffer, binaryBuffer.byteOffset, (count / Uint16Array.BYTES_PER_ELEMENT) - 1)
                value = textDecoder.decode(value)
                break

            case REG_.MULTI_SZ:
                value = new Uint16Array(binaryBuffer.buffer, binaryBuffer.byteOffset, (count / Uint16Array.BYTES_PER_ELEMENT) - 2)
                value = textDecoder.decode(value).split('\0')
                break

            case REG_.BINARY:
                value = new Uint8Array(binaryBuffer.buffer, binaryBuffer.byteOffset, count)
                value = value.slice()   // Return a copy of the buffer
                break

            case REG_.DWORD:
                value = new Uint32Array(binaryBuffer.buffer, binaryBuffer.byteOffset, 1)
                value = value[0]
                break

            case REG_.DWORD_BIG_ENDIAN:
                value = new DataView(binaryBuffer.buffer, binaryBuffer.byteOffset, Uint32Array.BYTES_PER_ELEMENT)
                value = value.getUint32(0, false)
                break

            case REG_.QWORD:
                value = new BigUint64Array(binaryBuffer.buffer, binaryBuffer.byteOffset, 1)
                value = value[0]
                break

            default:
                value = null
                break
        }

        return { type, value }
    }
    return status
}

export type RegGetValueResult =
    | { type: REG_.NONE,             value: null       }
    | { type: REG_.SZ,               value: string     }
    | { type: REG_.EXPAND_SZ,        value: string     }
    | { type: REG_.MULTI_SZ,         value: string[]   }
    | { type: REG_.BINARY,           value: Uint8Array }
    | { type: REG_.DWORD,            value: number     }
    | { type: REG_.DWORD_BIG_ENDIAN, value: number     }
    | { type: REG_.QWORD,            value: BigInt     }
    | { type: REG_,                  value: unknown    }

/**
 * Loads the specified registry hive as an application hive.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regloadappkeyw
 */
export function RegLoadAppKey(file: string, samDesired: KEY_, options: number): HKEY | LSTATUS {
    RegLoadAppKey.native ??= advapi32.func('RegLoadAppKeyW', cLSTATUS, [ cSTR, koffi.out(koffi.pointer(cHANDLE)), cDWORD, cDWORD, cDWORD ])
    const pHandle: OUT<HKEY> = [null!]
    const status = RegLoadAppKey.native(file, pHandle, samDesired, options, 0)
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
export function RegOpenKeyEx(hKey: HKEY | HKEY_, subKey: string | null, options: REG_OPTION_, samDesired: KEY_): HKEY | LSTATUS {
    RegOpenKeyEx.native ??= advapi32.func('RegOpenKeyExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD, koffi.out(koffi.pointer(cHANDLE)) ])

    const pHandle: OUT<HKEY> = [null!]
    const status = RegOpenKeyEx.native(hKey, subKey, options, samDesired, pHandle)
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

    const className = new StringOutputBuffer(Internals.MAX_PATH + 1)
    const pSubKeys: OUT<number> = [0]
    const pValues: OUT<number> = [0]
    const lastWriteTime = {} as FILETIME
    const status = RegQueryInfoKey.native(hKey, className.buffer, className.pLength, null, pSubKeys, null, null, pValues, null, null, null, lastWriteTime)
    if (status === Internals.ERROR_SUCCESS) {
        return {
            className: className.decode(),
            subKeys: pSubKeys[0],
            values: pValues[0],
            lastWriteTime
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
 * Note: in libwin32, only `REG_NONE`, `REG_SZ`, `REG_EXPAND_SZ`, `REG_BINARY`, `REG_DWORD`,
 *       `REG_DWORD_BIG_ENDIAN`, `REG_MULTI_SZ` and `REG_QWORD` are supported.
 *       All other types return `ERROR_UNSUPPORTED`.
 *       If the `data` parameter if not of the expected type, `ERROR_BAD_ARGUMENTS` is returned.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetkeyvaluew
 */
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.NONE,             data?: null):           LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.SZ,               data: string):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.EXPAND_SZ,        data: string):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.BINARY,           data: BufferSource):    LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.DWORD,            data: number):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.DWORD_BIG_ENDIAN, data: number):          LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.MULTI_SZ,         data: string[]):        LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_.QWORD,            data: number | bigint): LSTATUS
export function RegSetKeyValue(hKey: HKEY | HKEY_, subKey: string | null, valueName: string | null, type: REG_, data: any): LSTATUS {
    RegSetKeyValue.native ??= advapi32.func('RegSetKeyValueW', cLSTATUS, [ cHANDLE, cSTR, cSTR, cDWORD, cPVOID, cDWORD ])

    const buffer = regKeyDataToBuffer(type, data)
    if (typeof buffer === 'number')
        return buffer
    return RegSetKeyValue.native(hKey, subKey, valueName, type, buffer, buffer.byteLength)
}

/**
 * Sets the data and type of a specified value under a registry key.
 *
 * Note: in libwin32, only `REG_NONE`, `REG_SZ`, `REG_EXPAND_SZ`, `REG_BINARY`, `REG_DWORD`,
 *       `REG_DWORD_BIG_ENDIAN`, `REG_MULTI_SZ` and `REG_QWORD` are supported.
 *       All other types return `ERROR_UNSUPPORTED`.
 *       If the `data` parameter if not of the expected type, `ERROR_BAD_ARGUMENTS` is returned.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/winreg/nf-winreg-regsetvalueexw
 */
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.NONE,             data?: null):           LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.SZ,               data: string):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.EXPAND_SZ,        data: string):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.BINARY,           data: BufferSource):    LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.DWORD,            data: number):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.DWORD_BIG_ENDIAN, data: number):          LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.MULTI_SZ,         data: string[]):        LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_.QWORD,            data: number | bigint): LSTATUS
export function RegSetValueEx(hKey: HKEY | HKEY_, valueName: string | null, type: REG_, data: any): LSTATUS {
    RegSetValueEx.native ??= advapi32.func('RegSetValueExW', cLSTATUS, [ cHANDLE, cSTR, cDWORD, cDWORD, cPVOID, cDWORD ])

    const buffer = regKeyDataToBuffer(type, data)
    if (typeof buffer === 'number')
        return buffer
    return RegSetValueEx.native(hKey, valueName, 0, type, buffer, buffer.byteLength)
}

/** Anything that has a `buffer: ArrayBuffer` property: `Buffer`, `TypedArrays`, `DataView`. */
type BufferSource = { buffer: ArrayBuffer, byteLength: number }

function regKeyDataToBuffer(type: REG_, data: any): ArrayBuffer | ERROR_ {

    switch (type) {
        case REG_.NONE:
            return new Uint8Array().buffer

        case REG_.SZ:
        case REG_.EXPAND_SZ:
            return typeof data === 'string'
                ? Uint16Array.from(data + '\0', c => c.charCodeAt(0)).buffer
                : ERROR_.BAD_ARGUMENTS

        case REG_.BINARY:
            return data && typeof data === 'object' && data.buffer instanceof ArrayBuffer
                ? data.buffer
                : ERROR_.BAD_ARGUMENTS

        case REG_.MULTI_SZ:
            return Array.isArray(data)
                ? Uint16Array.from(data.join('\0') + '\0\0', c => c.charCodeAt(0)).buffer
                : ERROR_.BAD_ARGUMENTS

        case REG_.DWORD:
        case REG_.DWORD_BIG_ENDIAN:
            return typeof data === 'number'
                ? new Uint32Array([data]).buffer
                : ERROR_.BAD_ARGUMENTS

        case REG_.QWORD:
            return typeof data === 'number' || typeof data === 'bigint'
                ? new BigUint64Array([BigInt(data)]).buffer
                : ERROR_.BAD_ARGUMENTS

        default:
            return ERROR_.NOT_SUPPORTED
    }
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
