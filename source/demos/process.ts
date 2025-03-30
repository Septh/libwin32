
import { CloseHandle, OpenProcess, QueryFullProcessImageName, GetClassName, GetForegroundWindow, GetWindowText, GetWindowThreadProcessId, MessageBox } from "libwin32"

const windowHref = GetForegroundWindow()
const processId = GetWindowThreadProcessId(windowHref)
const windowText = GetWindowText(windowHref)

const PROCESS_QUERY_INFORMATION = 0x0400
const PROCESS_VM_READ = 0x0010
const openProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, processId)
const className = GetClassName(windowHref)

let executable

MessageBox(null, 'Testing2', "libwin32", 0)
if(openProcess){
    MessageBox(null, 'Testing', "libwin32", 0)
    executable = QueryFullProcessImageName(openProcess, 0)
    CloseHandle(openProcess)
}



MessageBox(
    null,
    `processId: ${processId}\n
    windowText: ${windowText}\n
    executable: ${executable}\n
    className: ${className}\n`,
    "libwin32",0
)


