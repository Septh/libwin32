import koffi from 'koffi'
import { cDWORD, cHANDLE, cINT, cP_VOID, cSTR, cUINT, cULONG } from '../internals.js'
import { cGUID } from '../chore/ctypes.js'

export const cNOTIFYICONDATA = koffi.struct({
    cbSize:           cDWORD,
    hWnd:             cHANDLE,
    uID:              cUINT,
    uFlags:           cUINT,
    uCallbackMessage: cUINT,
    hIcon:            cHANDLE,
    szTip:            koffi.array(koffi.types.char16, 128, 'String'),
    dwState:          cDWORD,
    dwStateMask:      cDWORD,
    szInfo:           koffi.array(koffi.types.char16, 256, 'String'),
    DUMMYUNIONNAME:   koffi.union('NOTIFYICONDATA_DUMMYUNIONNAME', {
        uTimeout: cUINT,
        uVersion: cUINT
    }),
    szInfoTitle:      koffi.array(koffi.types.char16, 64, 'String'),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,
    hBalloonIcon:     cHANDLE
})

export const cSHELLEXECUTEINFO = koffi.struct({
    cbSize:       cDWORD,
    fMask:        cULONG,
    hwnd:         cHANDLE,
    lpVerb:       cSTR,
    lpFile:       cSTR,
    lpParameters: cSTR,
    lpDirectory:  cSTR,
    nShow:        cINT,
    hInstApp:     cINT,
    lpIDList:     cP_VOID,
    lpClass:      cSTR,
    hkeyClass:    cHANDLE,
    dwHotKey:     cDWORD,
    hMonitor:     cHANDLE,  // Should be a union, but the other member hIcon is unused since Windows Vista.
    hProcess:     cHANDLE
})
