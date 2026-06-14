import koffi from 'koffi'
import { cBOOL, cDWORD, cHANDLE, cINT, cLONG, cSHORT, cSTR, cUINT } from '../internals.js'
import { cLPARAM, cLRESULT, cLUID, cWPARAM } from '../chore/ctypes.js'

export const cPOINT = koffi.struct({
    x: cLONG,
    y: cLONG
})

export const cPOINTS = koffi.struct({
    x: cSHORT,
    y: cSHORT
})

export const cRECT = koffi.struct({
    left:   cLONG,
    top:    cLONG,
    right:  cLONG,
    bottom: cLONG
})

export const cSIZE = koffi.struct({
    cx: cLONG,
    yy: cLONG
})

export const cMINMAXINFO = koffi.struct({
    ptReserved:     cPOINT,
    ptMaxSize:      cPOINT,
    ptMaxPosition:  cPOINT,
    ptMinTrackSize: cPOINT,
    ptMaxTrackSize: cPOINT
})

export const cBSMINFO = koffi.struct({
    cbSize: cUINT,
    hdesk:  cHANDLE,
    hwnd:   cHANDLE,
    luid:   cLUID
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

export const cWNDPROC     = koffi.pointer(koffi.proto('WND', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))
export const cWNDENUMPROC = koffi.pointer(koffi.proto('WNDENUM', cBOOL, [ cHANDLE, cLPARAM ]))
export const cDLGPROC     = koffi.pointer(koffi.proto('DLG', cLRESULT, [ cHANDLE, cUINT, cWPARAM, cLPARAM ]))

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
