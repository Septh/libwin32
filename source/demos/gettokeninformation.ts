import {
    GetCurrentProcess, OpenProcessToken, CloseHandle,
    GetTokenInformation,
    GetLastError, FormatMessage,
    type TOKEN_LINKED_TOKEN
} from 'libwin32'
import { TOKEN_INFORMATION_CLASS, TOKEN_, FORMAT_MESSAGE_ } from 'libwin32/consts'

const hToken = OpenProcessToken(GetCurrentProcess(), TOKEN_.ALL_ACCESS)
if (hToken) {
    for (let i: number = TOKEN_INFORMATION_CLASS.TokenUser; i <= TOKEN_INFORMATION_CLASS.TokenIntegrityLevel; i++) {
        console.group('\n****', TOKEN_INFORMATION_CLASS[i])
        const info = GetTokenInformation(hToken, i)
        if (info === null)
            console.log(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
        else {
            console.dir(info, { depth: 5 })
            if (i === TOKEN_INFORMATION_CLASS.TokenLinkedToken) {
                // "When you have finished using the handle, close it by calling the CloseHandle function."
                // https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-token_linked_token#members
                CloseHandle((info as TOKEN_LINKED_TOKEN).LinkedToken)
            }
        }
        console.groupEnd()
    }
    CloseHandle(hToken)
}
else console.log(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
