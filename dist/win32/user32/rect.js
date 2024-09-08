import { koffi } from '../../private.js';
import { cLONG } from '../../ctypes.js';
export const cRECT = koffi.struct('RECT', {
    left: cLONG,
    top: cLONG,
    right: cLONG,
    bottom: cLONG
});
export const cLPRECT = koffi.pointer('LPRECT', cRECT);
export const cPRECT = koffi.pointer('PRECT', cRECT);
//# sourceMappingURL=rect.js.map