import koffi from 'koffi'
import { cUINT, cDWORD, cBOOL, cINT, cSTR, cHANDLE } from '../internals.js'
import { cWPARAM, cLPARAM, cLRESULT, cPOINT } from '../misc/ctypes.js'
import { cLUID } from '../advapi32/ctypes.js'

export const cMINMAXINFO = koffi.struct({
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export const cMSG = koffi.struct({
    HWND:     cHANDLE,
    message:  cUINT,
    wParam:   cWPARAM,
    lParam:   cLPARAM,
    time:     cDWORD,
    pt:       cPOINT,
    lPrivate: cDWORD
})

export const cWNDPROC = koffi.pointer(koffi.proto(null, cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))
export const cWNDENUMPROC = koffi.pointer(koffi.proto(null, cBOOL, [ cHANDLE, cLPARAM ]))
export const cDLGPROC = koffi.pointer(koffi.proto(null, cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

export const cWNDCLASS = koffi.struct({
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cSTR,
    lpszClassName: cSTR
})

export const cWNDCLASSEX = koffi.struct({
    cbSize:        cUINT,
    style:         cUINT,
    lpfnWndProc:   cWNDPROC,
    cbClsExtra:    cINT,
    cbWndExtra:    cINT,
    hInstance:     cHANDLE,
    hIcon:         cHANDLE,
    hCursor:       cHANDLE,
    hbrBackground: cHANDLE,
    lpszMenuName:  cSTR,
    lpszClassName: cSTR,
    hIconSm:       cHANDLE
})

export const cBSMINFO = koffi.struct({
    cbSize: cUINT,
    hdesk:  cHANDLE,
    hwnd:   cHANDLE,
    luid:   cLUID
})
