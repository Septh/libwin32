import { koffi } from './private.js';
/**
 * Koffi's builtin primitive C types (minus those with a space in their name, like `unsigned int` or `long long`).
 */
export const ctypes = koffi.types;
/*
 * C `typedef`s used in the Windows API.
 * https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types
 */
// Primitives.
export const cVOID = ctypes.void;
export const cBOOL = ctypes.int;
export const cBOOLEAN = ctypes.int8;
export const cCHAR = ctypes.char;
export const cUCHAR = ctypes.uchar;
export const cCCHAR = ctypes.char;
export const cWCHAR = ctypes.wchar;
export const cBYTE = ctypes.uint8;
export const cWORD = ctypes.uint16;
export const cDWORD = ctypes.uint32;
export const cDWORD32 = ctypes.uint32;
export const cDWORD64 = ctypes.uint64;
export const cDWORDLONG = ctypes.uint64;
export const cQWORD = ctypes.uint64;
export const cINT = ctypes.int;
export const cUINT = ctypes.uint;
export const cINT8 = ctypes.int8;
export const cUINT8 = ctypes.uint8;
export const cINT16 = ctypes.int16;
export const cUINT16 = ctypes.uint16;
export const cINT32 = ctypes.int32;
export const cUINT32 = ctypes.uint32;
export const cINT64 = ctypes.int64;
export const cUINT64 = ctypes.uint64;
export const cINT_PTR = ctypes.int64;
export const cUINT_PTR = ctypes.uint64;
export const cSHORT = ctypes.int16;
export const cUSHORT = ctypes.uint16;
export const cLONG = ctypes.int32;
export const cULONG = ctypes.uint32;
export const cLONG32 = ctypes.int32;
export const cULONG32 = ctypes.uint32;
export const cLONG64 = ctypes.int64;
export const cULONG64 = ctypes.uint64;
export const cLONGLONG = ctypes.int64;
export const cULONGLONG = ctypes.uint64;
export const cLONG_PTR = ctypes.int64;
export const cULONG_PTR = ctypes.uint64;
export const cDWORD_PTR = ctypes.int64;
export const cPOINTER_32 = ctypes.int32;
export const cPOINTER_64 = ctypes.int64;
export const cFLOAT = ctypes.float;
export const cDOUBLE = ctypes.double;
export const cPSTR = ctypes.str;
export const cPWSTR = ctypes.str16;
export const cPTSTR = ctypes.str16; // Always Unicode
export const cLPSTR = ctypes.str;
export const cLPWSTR = ctypes.str16;
export const cLPTSTR = ctypes.str16; // Always Unicode
export const cPCSTR = ctypes.str;
export const cPCWSTR = ctypes.str16;
export const cPCTSTR = ctypes.str16; // Always Unicode
export const cLPCSTR = ctypes.str;
export const cLPCWSTR = ctypes.str16;
export const cLPCTSTR = ctypes.str16; // Always Unicode
// Pointers.
// Note: for better tree-shakeability, we define pointers to Koffi's primitives, not ours.
export const cPVOID = koffi.pointer('PVOID', ctypes.void);
export const cLPVOID = koffi.pointer('LPVOID', ctypes.void);
export const cLPCVOID = koffi.pointer('LPCVOID', ctypes.void);
export const cPBOOL = koffi.pointer('PBOOL', ctypes.int);
export const cLPBOOL = koffi.pointer('LPBOOL', ctypes.int);
export const cPBOOLEAN = koffi.pointer('PBOOLEAN', ctypes.int8);
export const cLPBOOLEAN = koffi.pointer('LPBOOLEAN', ctypes.int8);
export const cPCHAR = koffi.pointer('PCHAR', ctypes.char);
export const cPUCHAR = koffi.pointer('PUCHAR', ctypes.uchar);
export const cPBYTE = koffi.pointer('PBYTE', ctypes.uint8);
export const cLPBYTE = koffi.pointer('LPBYTE', ctypes.uint8);
export const cPWORD = koffi.pointer('PWORD', ctypes.uint16);
export const cLPWORD = koffi.pointer('LPWORD', ctypes.uint16);
export const cPDWORD = koffi.pointer('PDWORD', ctypes.uint32);
export const cLPDWORD = koffi.pointer('LPDWORD', ctypes.uint32);
export const cPDWORD32 = koffi.pointer('PDWORD32', ctypes.uint32);
export const cPDWORD64 = koffi.pointer('PDWORD64', ctypes.uint64);
export const cPDWORDLONG = koffi.pointer('PDWORDLONG', ctypes.uint64);
export const cPQWORD = koffi.pointer('PQWORD', ctypes.uint64);
export const cPINT = koffi.pointer('PINT', ctypes.int);
export const cLPINT = koffi.pointer('LPINT', ctypes.int);
export const cPUINT = koffi.pointer('PUINT', ctypes.uint);
export const cPINT8 = koffi.pointer('PINT8', ctypes.int8);
export const cPUINT8 = koffi.pointer('PUINT8', ctypes.uint8);
export const cPINT16 = koffi.pointer('PINT16', ctypes.int16);
export const cPUINT16 = koffi.pointer('PUINT16', ctypes.uint16);
export const cPINT32 = koffi.pointer('PINT32', ctypes.int32);
export const cPUINT32 = koffi.pointer('PUINT32', ctypes.uint32);
export const cPINT64 = koffi.pointer('PINT64', ctypes.int64);
export const cPUINT64 = koffi.pointer('PUINT64', ctypes.uint64);
export const cPINT_PTR = koffi.pointer('PINT_PTR', ctypes.int64);
export const cPUINT_PTR = koffi.pointer('PUINT_PTR', ctypes.uint64);
export const cPSHORT = koffi.pointer('PSHORT', ctypes.int16);
export const cPUSHORT = koffi.pointer('PUSHORT', ctypes.uint16);
export const cPLONG = koffi.pointer('PLONG', ctypes.int32);
export const cLPLONG = koffi.pointer('LPLONG', ctypes.int32);
export const cPULONG = koffi.pointer('PULONG', ctypes.uint32);
export const cLPULONG = koffi.pointer('LPULONG', ctypes.uint32);
export const cPLONG32 = koffi.pointer('PLONG32', ctypes.int32);
export const cPULONG32 = koffi.pointer('PULONG32', ctypes.uint32);
export const cPLONG64 = koffi.pointer('PLONG64', ctypes.int64);
export const cPULONG64 = koffi.pointer('PULONG64', ctypes.uint64);
export const cPLONGLONG = koffi.pointer('PLONGLONG', ctypes.int64);
export const cPULONGLONG = koffi.pointer('PULONGLONG', ctypes.uint64);
export const cPLONG_PTR = koffi.pointer('PLONG_PTR', ctypes.int64);
export const cPULONG_PTR = koffi.pointer('PULONG_PTR', ctypes.uint64);
export const cPFLOAT = koffi.pointer('PFLOAT', ctypes.float);
export const cPDOUBLE = koffi.pointer('PDOUBLE', ctypes.double);
// Apis.
export const cHANDLE = koffi.pointer('HANDLE', koffi.opaque('__handle__'));
export const cPHANDLE = koffi.pointer('PHANDLE', cHANDLE);
export const cLPHANDLE = koffi.pointer('LPHANDLE', cHANDLE);
export const cHINSTANCE = koffi.alias('HINSTANCE', cHANDLE);
export const cWPARAM = ctypes.uint64; // = UINT_PTR
export const cLPARAM = ctypes.int64; // = LONG_PTR
export const cHRESULT = ctypes.long; // = LONG
export const cLRESULT = ctypes.int64; // = LONG_PTR
export const cATOM = ctypes.uint16; // = WORD
// export const cCOLORREF   = koffi.alias('COLORREF',      ctypes.uint32)
// export const cLPCOLORREF = koffi.pointer('LPCOLORREF',  cCOLORREF)
// export type HACCEL      = HANDLE<'HACCEL'>
// export type HBITMAP     = HANDLE<'HBITMAP'>
// export type HCOLORSPACE = HANDLE<'HCOLORSPACE'>
// export type HDC         = HANDLE<'HDC'>
// export type HDESK       = HANDLE<'HDESK'>
// export type HDWP        = HANDLE<'HDWP'>
// export type HFILE       = HANDLE<'HFILE'>
// export type HFONT       = HANDLE<'HFONT'>
// export type HGDIOBJ     = HANDLE<'HGDIOBJ'>
// export type HGLOBAL     = HANDLE<'HGLOBAL'>
// export type HHOOK       = HANDLE<'HHOOK'>
// export type HKEY        = HANDLE<'HKEY'>
// export type HKL         = HANDLE<'HKL'>
// export type HLOCAL      = HANDLE<'HLOCAL'>
// export type HMETAFILE   = HANDLE<'HMETAFILE'>
// export type HMONITOR    = HANDLE<'HMONITOR'>
// export type HPALETTE    = HANDLE<'HPALETTE'>
// export type HPEN        = HANDLE<'HPEN'>
// export type HRGN        = HANDLE<'HRGN'>
// export type HRSRC       = HANDLE<'HRSRC'>
// export type HWINSTA     = HANDLE<'HWINSTA'>
//# sourceMappingURL=ctypes.js.map