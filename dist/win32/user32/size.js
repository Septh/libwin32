import { koffi } from '../../private.js';
import { cLONG } from '../../ctypes.js';
export const cSIZE = koffi.struct('SIZE', {
    cx: cLONG,
    yy: cLONG
});
export const cPSIZE = koffi.pointer('PSIZE', cSIZE);
export const cLPSIZE = koffi.alias('LPSIZE', cPSIZE);
//# sourceMappingURL=size.js.map