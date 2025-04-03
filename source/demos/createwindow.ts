import {
    GetModuleHandle, GetLastError,
    RegisterClassEx, LoadCursor, LoadIcon, WNDCLASSEX,
    CreateWindowEx, ShowWindow, UpdateWindow, DefWindowProc,
    GetMessage, TranslateMessage, DispatchMessage, PostQuitMessage,
    FormatMessage, MessageBox,
    type HINSTANCE, type WPARAM, type LPARAM, type HWND, type MSG
} from 'libwin32'
import { CS_, CW_, FORMAT_MESSAGE_, IDC_, IDI_, MB_, SW_, WM_, WS_, WS_EX_ } from 'libwin32/consts'

const windowClass = 'libwin32_app'
const windowName  = 'libwin32 demo: CreateWindow'

function wndProc(hWnd: HWND, uMmsg: WM_, wParam: WPARAM, lParam: LPARAM) {

    let ret: number
    switch (uMmsg) {
        case WM_.DESTROY:
            console.log('WM_DESTROY')
            PostQuitMessage(0)
            ret = 0
            break

        default:
            // console.log(uMmsg)
            ret = DefWindowProc(hWnd, uMmsg, wParam, lParam) as number
            break
    }
    return ret
}

function WinMain(hInstance: HINSTANCE, nCmdShow: SW_): number {

    const wcex = new WNDCLASSEX()   // Note: cbSize is set by the WNDCLASSEX constructor
    wcex.lpszClassName = windowClass
    wcex.style         = CS_.HREDRAW | CS_.VREDRAW
    wcex.hInstance     = hInstance
    wcex.lpfnWndProc   = wndProc
    wcex.hCursor       = LoadCursor(null, IDC_.ARROW)
    wcex.hIcon         = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hIconSm       = LoadIcon(hInstance, IDI_.APPLICATION)
    wcex.hbrBackground = 13 as any  // Note: brushes are not yet implemented. 13 is the standard background.

    const atom = RegisterClassEx(wcex)
    if (!atom) {
        MessageBox(null, 'Call to RegisterClassEx failed!', 'libwin32', MB_.OK | MB_.ICONERROR)
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
        const msg = FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, err, 0)
        MessageBox(null, 'Call to CreateWindowEx failed!\n' + msg, 'libwin32', MB_.OK | MB_.ICONERROR)
        return err
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

const hInstance = GetModuleHandle(null)
if (!hInstance) {
    throw new Error('GetModuleHandle() failed.')
}

process.exitCode = WinMain(hInstance, SW_.NORMAL)
