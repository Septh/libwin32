import { koffi } from '../../private.js';
import { cPOINT } from './point.js';
export const cMINMAXINFO = koffi.struct('MINMAXINFO', {
    ptReserved: cPOINT,
    ptMaxSize: cPOINT,
    ptMaxPosition: cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
});
export const cLPMINMAXINFO = koffi.pointer('LPMINMAXINFO', cMINMAXINFO);
export const cPMINMAXINFO = koffi.pointer('PMINMAXINFO', cMINMAXINFO);
//# sourceMappingURL=minmaxinfo.js.map