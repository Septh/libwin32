import koffi from 'koffi'
import { cDWORD, cINT, cPVOID, cWSTR, cUINT, cULONG, cHANDLE } from '../internals.js'
import { cGUID } from '../misc/ctypes.js'

export const cNOTIFYICONDATA_DUMMYUNIONNAME = koffi.union({
    uTimeout: cUINT,
    uVersion: cUINT
})

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
    DUMMYUNIONNAME:   cNOTIFYICONDATA_DUMMYUNIONNAME,
    szInfoTitle:      koffi.array(koffi.types.char16, 64, 'String'),
    dwInfoFlags:      cDWORD,
    guidItem:         cGUID,
    hBalloonIcon:     cHANDLE
})

export const cSHELLEXECUTEINFO = koffi.struct({
    cbSize:       cDWORD,
    fMask:        cULONG,
    hwnd:         cHANDLE,
    lpVerb:       cWSTR,
    lpFile:       cWSTR,
    lpParameters: cWSTR,
    lpDirectory:  cWSTR,
    nShow:        cINT,
    hInstApp:     cINT,
    lpIDList:     cPVOID,
    lpClass:      cWSTR,
    hkeyClass:    cHANDLE,
    dwHotKey:     cDWORD,
    hMonitor:     cHANDLE,
    hProcess:     cHANDLE
})
