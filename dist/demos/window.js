import { __addDisposableResource, __disposeResources } from "tslib";
import { WNDCLASSEX } from 'libwin32';
import * as kernel32 from 'libwin32/kernel32';
import * as user32 from 'libwin32/user32';
const windowClass = "NodeApp";
const windowName = "Window Demo !";
const appTitle = "A NodeJS app using the Win32 API";
function wndProc(hWnd, uMmsg, wParam, lParam) {
    let ret;
    switch (uMmsg) {
        case 2 /* WM.DESTROY */:
            user32.PostQuitMessage(0);
            ret = 0;
            break;
        default:
            ret = user32.DefWindowProc(hWnd, uMmsg, wParam, lParam);
            break;
    }
    // console.log(hWnd, { uMmsg, wParam, lParam }, ret)
    return ret;
}
function WinMain(hInstance, nCmdShow) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const wcex = __addDisposableResource(env_1, new WNDCLASSEX(wndProc), false);
        wcex.lpszClassName = windowClass;
        wcex.style = 2 /* CS.HREDRAW */ | 1 /* CS.VREDRAW */;
        wcex.hInstance = hInstance;
        wcex.hCursor = user32.LoadCursor(null, 32512 /* IDC.ARROW */);
        wcex.hIcon = user32.LoadIcon(hInstance, 32512 /* IDI.APPLICATION */);
        wcex.hIconSm = user32.LoadIcon(hInstance, 32512 /* IDI.APPLICATION */);
        wcex.hbrBackground = 13;
        const atom = user32.RegisterClassEx(wcex);
        if (!atom) {
            user32.MessageBox(null, "Call to RegisterClassEx failed!", appTitle, 0 /* MB.OK */ | 16 /* MB.ICONERROR */);
            return 1;
        }
        const hWnd = user32.CreateWindow(windowClass, windowName, 12582912 /* WS.CAPTION */ | 524288 /* WS.SYSMENU */, 2147483648 /* CW.USEDEFAULT */, 2147483648 /* CW.USEDEFAULT */, 600, 400, null, null, hInstance, null);
        if (!hWnd) {
            const err = kernel32.GetLastError();
            user32.MessageBox(null, "Call to CreateWindow failed!\n" + err.toString(16), appTitle, 0 /* MB.OK */ | 16 /* MB.ICONERROR */);
            return -1;
        }
        user32.ShowWindow(hWnd, nCmdShow);
        user32.UpdateWindow(hWnd);
        // Main message loop
        const msg = {};
        while (user32.GetMessage(msg, null, 0, 0)) {
            user32.TranslateMessage(msg);
            user32.DispatchMessage(msg);
        }
        return 0;
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
}
debugger;
process.exitCode = WinMain(kernel32.GetModuleHandleW(null), 1 /* SW.NORMAL */);
//# sourceMappingURL=window.js.map