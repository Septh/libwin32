import { koffi } from '../../private.js';
import { cDWORD, cLPARAM, cUINT, cWPARAM } from '../../ctypes.js';
import { cHWND } from './window.js';
import { cPOINT } from './point.js';
export const cMSG = koffi.struct('MSG', {
    HWND: cHWND,
    message: cUINT,
    wParam: cWPARAM,
    lParam: cLPARAM,
    time: cDWORD,
    pt: cPOINT,
    lPrivate: cDWORD
});
export const cLPMSG = koffi.pointer('LPMSG', cMSG);
export const cPMSG = koffi.pointer('PMSG', cMSG);
//# sourceMappingURL=msg.js.map