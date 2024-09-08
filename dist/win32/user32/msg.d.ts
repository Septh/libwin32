import { koffi } from '../../private.js';
import { type HWND } from './window.js';
import { type POINT } from './point.js';
export declare const cMSG: koffi.IKoffiCType;
export declare const cLPMSG: koffi.IKoffiCType;
export declare const cPMSG: koffi.IKoffiCType;
export interface MSG {
    HWND: HWND;
    message: number;
    wParam: number;
    lParam: number;
    time: number;
    pt: POINT;
}
//# sourceMappingURL=msg.d.ts.map