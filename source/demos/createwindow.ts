import {
    GetModuleHandle, GetLastError,
    RegisterClassEx, UnregisterClass, LoadCursor, LoadIcon, WNDCLASSEX,
    CreateWindowEx, ShowWindow, UpdateWindow, DefWindowProc,
    GetMessage, TranslateMessage, DispatchMessage, PostQuitMessage,
    FormatMessage, isHandle,
    type HINSTANCE, type MSG, type WPARAM, type LPARAM, type HWND, type HBRUSH
} from 'libwin32'
import { CS_, CW_USEDEFAULT, FORMAT_MESSAGE_, IDC_, IDI_, SW_, WM_, WS_, WS_EX_ } from 'libwin32/consts'

const windowClass = 'libwin32_app'
const windowName  = 'libwin32 demo: CreateWindow'

function wndProc(hWnd: HWND, uMsg: WM_, wParam: WPARAM, lParam: LPARAM) {

    let ret: number
    switch (uMsg) {
        case WM_.DESTROY:
            console.log('WM_DESTROY')
            PostQuitMessage(0)
            ret = 0
            break

        default:
            // console.log(uMsg)
<<<<<<< HEAD
            ret = DefWindowProc(hWnd, uMmsg, wParam, lParam) as number
=======
            ret = DefWindowProc(hWnd, uMsg, wParam, lParam) as number
>>>>>>> refactor
            break
    }
    return ret
}

function WinMain(hInstance: HINSTANCE, nCmdShow: SW_): number {

    // Note: cbSize is set by the WNDCLASSEX constructor
    const wcex = new WNDCLASSEX()
    wcex.hInstance     = hInstance
    wcex.lpszClassName = windowClass
<<<<<<< HEAD
    wcex.style         = CS_.HREDRAW | CS_.VREDRAW
    wcex.lpfnWndProc   = wndProc,
    wcex.hCursor       = LoadCursor(null, IDC_.ARROW)
    wcex.hIcon         = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hIconSm       = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hbrBackground = 13 as unknown as HBRUSH                  // Note: brushes are not yet implemented. 13 is the standard background.
=======
    wcex.style         = CS_.HREDRAW | CS_.VREDRAW,
    wcex.lpfnWndProc   = wndProc
    wcex.hCursor       = LoadCursor(null, IDC_.ARROW)
    wcex.hIcon         = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hIconSm       = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hbrBackground = 13 as unknown as HBRUSH    // Note: brushes are not yet implemented. 13 is the standard background.
>>>>>>> refactor

    const atom = RegisterClassEx(wcex)
    if (!atom) {
        console.error('Call to RegisterClassEx failed!:', FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
        return 1
    }

    const hWnd = CreateWindowEx(
        WS_EX_.CLIENTEDGE,
        windowClass, windowName,
        WS_.OVERLAPPEDWINDOW | WS_.VSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT,
        null, null, hInstance, 0
    )
    if (!isHandle(hWnd)) {
        console.error('Call to CreateWindowEx failed:', FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
        return 1
    }

    ShowWindow(hWnd, nCmdShow)
    UpdateWindow(hWnd)

    // Main message loop
    let msg: MSG | null
    while (msg = GetMessage(null)) {
        TranslateMessage(msg)
        DispatchMessage(msg)
    }

    UnregisterClass(atom, hInstance)
    return 0
}

const hInstance = GetModuleHandle(null)
if (isHandle(hInstance))
    process.exitCode = WinMain(hInstance, SW_.NORMAL)
else {
    console.error('GetModuleHandle() failed:', FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError()))
    process.exitCode = 1
}
