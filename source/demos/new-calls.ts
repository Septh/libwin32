
import { CloseHandle, OpenProcess, QueryFullProcessImageName } from "../win32/kernel32.js"
import { GetClassName, GetForegroundWindow, GetWindowText, GetWindowThreadProcessId, MessageBox } from "../win32/user32.js"

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


