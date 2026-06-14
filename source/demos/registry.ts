/*
 * This demo is adapted from MS's sample code "Enumerating Registry Subkeys"
 * https://learn.microsoft.com/en-us/windows/win32/sysinfo/enumerating-registry-subkeys
 *
 */
import {
    RegOpenKeyEx, RegQueryInfoKey, RegEnumKeyEx, RegEnumValue, RegCloseKey,
    isHandle, isErrorStatus, FormatMessage, GetLastError,
    type HKEY,
} from 'libwin32'
import { FORMAT_MESSAGE_, HKEY_, KEY_ } from 'libwin32/consts'

function QueryKey(hKey: HKEY) {

    // Get the class name and the value count.
    const info = RegQueryInfoKey(hKey)
    if (isErrorStatus(info)) {
        console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
        return
    }

    // Enumerate the subkeys.
    console.log('Number of subkeys: %d', info.subKeys)
    for (let i = 0; i < info.subKeys; i++) {
        const key = RegEnumKeyEx(hKey, i)
        if (isErrorStatus(key)) {
            console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
            break
        }
        console.log('(%d) %s', i + 1, key.name)
    }

    // Enumerate the key values.
    console.log('Number of values: %d', info.values)
    for (let i = 0; i < info.values; i++) {
        const value = RegEnumValue(hKey, i)
        if (isErrorStatus(value)) {
            console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
            break
        }
        console.log('(%d) %s', i + 1, value.name)
    }
}

const hTestKey = RegOpenKeyEx(HKEY_.CURRENT_USER, "SOFTWARE\\Microsoft", 0, KEY_.READ)
if (isHandle(hTestKey)) {
    QueryKey(hTestKey)
    RegCloseKey(hTestKey)
}
