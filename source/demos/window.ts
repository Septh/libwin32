import {
    GetModuleHandle, GetLastError,
    RegisterClassEx, LoadCursor, LoadIcon, WNDCLASSEX,
    CreateWindow, ShowWindow, UpdateWindow, DefWindowProc,
    GetMessage, TranslateMessage, DispatchMessage, PostQuitMessage,
    MessageBox,
    type HINSTANCE, type WPARAM, type LPARAM, type HWND, type MSG
} from 'libwin32'
import { CS, CW, IDC, IDI, MB, SW, WM, WS } from 'libwin32/consts'

const windowClass = "NodeApp"
const windowName  = "Window Demo !"
const appTitle    = "A NodeJS app using the Win32 API"

function wndProc(hWnd: HWND, uMmsg: WM, wParam: WPARAM, lParam: LPARAM) {

    let ret: number
    switch (uMmsg) {
        case WM.DESTROY:
            PostQuitMessage(0)
            ret = 0
            break

        default:
            ret = DefWindowProc(hWnd, uMmsg, wParam, lParam)
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
    wcex.hCursor       = LoadCursor(null, IDC.ARROW)
    wcex.hIcon         = LoadIcon(hInstance, IDI.APPLICATION)
    wcex.hIconSm       = LoadIcon(hInstance, IDI.APPLICATION)
    wcex.hbrBackground = 13 as any

    const atom = RegisterClassEx(wcex)
    if (!atom) {
        MessageBox(null, "Call to RegisterClassEx failed!", appTitle, MB.OK | MB.ICONERROR)
        return 1
    }

    const hWnd = CreateWindow(
        windowClass, windowName,
        WS.CAPTION | WS.SYSMENU,
        CW.USEDEFAULT, CW.USEDEFAULT, 600, 400,
        null, null, hInstance, 0
    )
    if (!hWnd) {
        const err = GetLastError()
        MessageBox(null, "Call to CreateWindow failed!\n" + err.toString(16), appTitle, MB.OK | MB.ICONERROR)
        return -1
    }

    ShowWindow(hWnd, nCmdShow)
    UpdateWindow(hWnd)

    // Main message loop
    const msg = {} as MSG
    while (GetMessage(msg, null, 0, 0)) {
        TranslateMessage(msg)
        DispatchMessage(msg)
    }

    return 0
}

process.exitCode = WinMain(GetModuleHandle(null), SW.NORMAL)
