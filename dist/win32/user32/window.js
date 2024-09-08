import { koffi } from '../../private.js';
import { ctypes, cHANDLE, cUINT, cHINSTANCE, cLPCWSTR, cINT_PTR, cWPARAM, cLPARAM, cLRESULT } from '../../ctypes.js';
import { cHICON } from './icon.js';
import { cHCURSOR } from './cursor.js';
import { cHBRUSH } from './brush.js';
export const cHWND = cHANDLE;
export const cWNDPROC = koffi.pointer('WNDPROC', koffi.proto('__wndproc', cLRESULT, [cHWND, cUINT, cWPARAM, cLPARAM]));
export const cDLGPROC = koffi.pointer('DLGPROC', koffi.proto('__dlgproc', cINT_PTR, [cHWND, cUINT, cWPARAM, cLPARAM]));
export const cWNDCLASS = koffi.struct('WNDCLASS', {
    style: cUINT,
    lpfnWndProc: cWNDPROC,
    cbClsExtra: ctypes.int,
    cbWndExtra: ctypes.int,
    hInstance: cHINSTANCE,
    hIcon: cHICON,
    hCursor: cHCURSOR,
    hbrBackground: cHBRUSH,
    lpszMenuName: cLPCWSTR,
    lpszClassName: cLPCWSTR
});
export const cLPWNDCLASS = koffi.pointer('LPWNDCLASS', cWNDCLASS);
export const cPWNDCLASS = koffi.pointer('PWNDCLASS', cWNDCLASS);
/**
 * Contains the window class attributes that are registered by the RegisterClass function.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassw
 */
export class WNDCLASS {
    style;
    lpfnWndProc;
    cbClsExtra;
    cbWndExtra;
    hInstance;
    hIcon;
    hCursor;
    hbrBackground;
    lpszMenuName;
    lpszClassName;
    constructor(wndProc) {
        if (typeof wndProc === 'function')
            this.lpfnWndProc = koffi.register(wndProc, cWNDPROC);
    }
    // For use with `using` (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        if (this.lpfnWndProc) {
            koffi.unregister(this.lpfnWndProc);
        }
    }
}
export const cWNDCLASSEX = koffi.struct('WNDCLASSEX', {
    cbSize: cUINT,
    style: cUINT,
    lpfnWndProc: cWNDPROC,
    cbClsExtra: ctypes.int,
    cbWndExtra: ctypes.int,
    hInstance: cHINSTANCE,
    hIcon: cHICON,
    hCursor: cHCURSOR,
    hbrBackground: cHBRUSH,
    lpszMenuName: cLPCWSTR,
    lpszClassName: cLPCWSTR,
    hIconSm: cHICON
});
export const cLPWNDCLASSEX = koffi.pointer('LPWNDCLASSEX', cWNDCLASSEX);
export const cPWNDCLASSEX = koffi.pointer('PWNDCLASSEX', cWNDCLASSEX);
/**
 * Contains window class information. It is used with the RegisterClassEx and GetClassInfoEx functions.
 *
 * @disposable true
 * @link https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-wndclassexw
 */
export class WNDCLASSEX {
    cbSize = koffi.sizeof(cWNDCLASSEX);
    constructor(wndProc) {
        if (typeof wndProc === 'function')
            this.lpfnWndProc = koffi.register(wndProc, cWNDPROC);
    }
    // For use with `using` (requires TypeScript 5.2+)
    [Symbol.dispose]() {
        if (this.lpfnWndProc) {
            koffi.unregister(this.lpfnWndProc);
        }
    }
}
//# sourceMappingURL=window.js.map