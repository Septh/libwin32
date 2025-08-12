import {
    GetForegroundWindow, GetWindowThreadProcessId, GetWindowText,
    OpenProcess, QueryFullProcessImageName, CloseHandle
} from 'libwin32'
import { PSAR_ } from 'libwin32/consts'

const hWnd = GetForegroundWindow()
const windowText = GetWindowText(hWnd)

const { processId, threadId } = GetWindowThreadProcessId(hWnd)
const hProc = OpenProcess(PSAR_.PROCESS_QUERY_INFORMATION | PSAR_.PROCESS_VM_READ, false, processId)

let executable
if (hProc) {
    executable = QueryFullProcessImageName(hProc, 0)
    CloseHandle(hProc)
}

console.log(`Foreground window is "${windowText}"
    processId: ${processId}
    threadId: ${threadId}
    executable: ${executable}`
)
