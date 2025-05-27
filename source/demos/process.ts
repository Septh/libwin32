import {
    GetForegroundWindow, GetWindowThreadProcessId, GetWindowText,
    OpenProcess, GetClassName, QueryFullProcessImageName, CloseHandle,
    MessageBox
} from 'libwin32'
import { PSAR_ } from 'libwin32/consts'

const windowHref = GetForegroundWindow()
const { processId } = GetWindowThreadProcessId(windowHref)
const windowText = GetWindowText(windowHref)

const openProcess = OpenProcess(PSAR_.PROCESS_QUERY_INFORMATION | PSAR_.PROCESS_VM_READ, false, processId)
const className = GetClassName(windowHref)

let executable

MessageBox(null, 'Testing2', 'libwin32', 0)
if (openProcess) {
    MessageBox(null, 'Testing', 'libwin32', 0)
    executable = QueryFullProcessImageName(openProcess, 0)
    CloseHandle(openProcess)
}

MessageBox(
    null,
    `processId: ${processId}\n
    windowText: ${windowText}\n
    executable: ${executable}\n
    className: ${className}\n`,
    'libwin32', 0
)
