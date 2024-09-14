import {
    WNDCLASSEX, IDC, IDI, CS, WS, CW, WM, SW, MB,
    type HINSTANCE, type WPARAM, type LPARAM, type HWND, type MSG
} from 'libwin32'
import * as kernel32 from 'libwin32/kernel32'
import * as user32 from 'libwin32/user32'

const windowClass = "NodeApp"
const windowName  = "Window Demo !"
const appTitle    = "A NodeJS app using the Win32 API"

function wndProc(hWnd: HWND, uMmsg: WM, wParam: WPARAM, lParam: LPARAM) {

    let ret: number
    switch (uMmsg) {
        case WM.DESTROY:
            user32.PostQuitMessage(0)
            ret = 0
            break

        default:
            ret = user32.DefWindowProc(hWnd, uMmsg, wParam, lParam)
            break
    }
    // console.log(hWnd, { uMmsg, wParam, lParam }, ret)
    return ret
}

function WinMain(hInstance: HINSTANCE, nCmdShow: SW): number {

    using wcex = new WNDCLASSEX(wndProc)
    wcex.lpszClassName = windowClass
    wcex.style         = CS.HREDRAW | CS.VREDRAW
    wcex.hInstance     = hInstance
    wcex.hCursor       = user32.LoadCursor(null, IDC.ARROW)
    wcex.hIcon         = user32.LoadIcon(hInstance, IDI.APPLICATION)
    wcex.hIconSm       = user32.LoadIcon(hInstance, IDI.APPLICATION)
    wcex.hbrBackground = 13 as any

    const atom = user32.RegisterClassEx(wcex)
    if (!atom) {
        user32.MessageBox(null, "Call to RegisterClassEx failed!", appTitle, MB.OK | MB.ICONERROR)
        return 1
    }

    const hWnd = user32.CreateWindow(
        windowClass, windowName,
        WS.CAPTION | WS.SYSMENU,
        CW.USEDEFAULT, CW.USEDEFAULT, 600, 400,
        null, null, hInstance, null
    )
    if (!hWnd) {
        const err = kernel32.GetLastError()
        user32.MessageBox(null, "Call to CreateWindow failed!\n" + err.toString(16), appTitle, MB.OK | MB.ICONERROR)
        return -1
    }

    user32.ShowWindow(hWnd, nCmdShow)
    user32.UpdateWindow(hWnd)

    // Main message loop
    const msg = {} as MSG
    while (user32.GetMessage(msg, null, 0, 0)) {
        user32.TranslateMessage(msg)
        user32.DispatchMessage(msg)
    }

    return 0
}

debugger
process.exitCode = WinMain(kernel32.GetModuleHandle(null), SW.NORMAL)
