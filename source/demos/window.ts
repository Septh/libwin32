import {
    GetModuleHandle, GetLastError,
    RegisterClassEx, LoadCursor, LoadIcon, WNDCLASSEX,
    CreateWindowEx, ShowWindow, UpdateWindow, DefWindowProc,
    GetMessage, TranslateMessage, DispatchMessage, PostQuitMessage,
    MessageBox,
    type HINSTANCE, type WPARAM, type LPARAM, type HWND, type MSG
} from 'libwin32'
import { CS_, CW_, IDC_, IDI_, MB_, SW_, WM_, WS_, WS_EX_ } from 'libwin32/consts'

const windowClass = "NodeApp"
const windowName  = "Window Demo!"
const appTitle    = "A NodeJS app using the Win32 API"

function wndProc(hWnd: HWND, uMmsg: WM_, wParam: WPARAM, lParam: LPARAM) {

    let ret: number
    switch (uMmsg) {
        case WM_.DESTROY:
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

function WinMain(hInstance: HINSTANCE, nCmdShow: SW_): number {

    using wcex = new WNDCLASSEX(wndProc)    // Note: cbSize is set by the WNDCLASSEX constructor
    wcex.lpszClassName = windowClass
    wcex.style         = CS_.HREDRAW | CS_.VREDRAW
    wcex.hInstance     = hInstance
    wcex.hCursor       = LoadCursor(null, IDC_.ARROW)
    wcex.hIcon         = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hIconSm       = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hbrBackground = 13 as any          // Note: brushes are not yet implemented. 13 is the standard background.

    const atom = RegisterClassEx(wcex)
    if (!atom) {
        MessageBox(null, "Call to RegisterClassEx failed!", appTitle, MB_.OK | MB_.ICONERROR)
        return 1
    }

    const hWnd = CreateWindowEx(
        WS_EX_.CLIENTEDGE,
        windowClass, windowName,
        WS_.OVERLAPPEDWINDOW | WS_.VSCROLL,
        CW_.USEDEFAULT, CW_.USEDEFAULT, CW_.USEDEFAULT, CW_.USEDEFAULT,
        null, null, hInstance, 0
    )
    if (!hWnd) {
        const err = GetLastError()
        MessageBox(null, "Call to CreateWindow failed!\n" + err.toString(16), appTitle, MB_.OK | MB_.ICONERROR)
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

process.exitCode = WinMain(GetModuleHandle(null), SW_.NORMAL)
