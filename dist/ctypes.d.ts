import { koffi } from './private.js';
/**
 * Koffi's builtin primitive C types (minus those with a space in their name, like `unsigned int` or `long long`).
 */
export declare const ctypes: Record<"bool" | "char" | "char16" | "char16_t" | "char32" | "char32_t" | "double" | "float" | "float32" | "float64" | "int" | "int16" | "int16_be" | "int16_be_t" | "int16_le" | "int16_le_t" | "int16_t" | "int32" | "int32_be" | "int32_be_t" | "int32_le" | "int32_le_t" | "int32_t" | "int64" | "int64_be" | "int64_be_t" | "int64_le" | "int64_le_t" | "int64_t" | "int8" | "int8_t" | "intptr" | "intptr_t" | "short" | "long" | "longlong" | "size_t" | "str" | "str16" | "str32" | "string" | "string16" | "string32" | "uchar" | "uint" | "uint16" | "uint16_be" | "uint16_be_t" | "uint16_le" | "uint16_le_t" | "uint16_t" | "uint32" | "uint32_be" | "uint32_be_t" | "uint32_le" | "uint32_le_t" | "uint32_t" | "uint64" | "uint64_be" | "uint64_be_t" | "uint64_le" | "uint64_le_t" | "uint64_t" | "uint8" | "uint8_t" | "uintptr" | "uintptr_t" | "ulong" | "ulonglong" | "ushort" | "void" | "wchar" | "wchar_t", koffi.IKoffiCType>;
export declare const cVOID: koffi.IKoffiCType;
export declare const cBOOL: koffi.IKoffiCType;
export declare const cBOOLEAN: koffi.IKoffiCType;
export declare const cCHAR: koffi.IKoffiCType;
export declare const cUCHAR: koffi.IKoffiCType;
export declare const cCCHAR: koffi.IKoffiCType;
export declare const cWCHAR: koffi.IKoffiCType;
export declare const cBYTE: koffi.IKoffiCType;
export declare const cWORD: koffi.IKoffiCType;
export declare const cDWORD: koffi.IKoffiCType;
export declare const cDWORD32: koffi.IKoffiCType;
export declare const cDWORD64: koffi.IKoffiCType;
export declare const cDWORDLONG: koffi.IKoffiCType;
export declare const cQWORD: koffi.IKoffiCType;
export declare const cINT: koffi.IKoffiCType;
export declare const cUINT: koffi.IKoffiCType;
export declare const cINT8: koffi.IKoffiCType;
export declare const cUINT8: koffi.IKoffiCType;
export declare const cINT16: koffi.IKoffiCType;
export declare const cUINT16: koffi.IKoffiCType;
export declare const cINT32: koffi.IKoffiCType;
export declare const cUINT32: koffi.IKoffiCType;
export declare const cINT64: koffi.IKoffiCType;
export declare const cUINT64: koffi.IKoffiCType;
export declare const cINT_PTR: koffi.IKoffiCType;
export declare const cUINT_PTR: koffi.IKoffiCType;
export declare const cSHORT: koffi.IKoffiCType;
export declare const cUSHORT: koffi.IKoffiCType;
export declare const cLONG: koffi.IKoffiCType;
export declare const cULONG: koffi.IKoffiCType;
export declare const cLONG32: koffi.IKoffiCType;
export declare const cULONG32: koffi.IKoffiCType;
export declare const cLONG64: koffi.IKoffiCType;
export declare const cULONG64: koffi.IKoffiCType;
export declare const cLONGLONG: koffi.IKoffiCType;
export declare const cULONGLONG: koffi.IKoffiCType;
export declare const cLONG_PTR: koffi.IKoffiCType;
export declare const cULONG_PTR: koffi.IKoffiCType;
export declare const cDWORD_PTR: koffi.IKoffiCType;
export declare const cPOINTER_32: koffi.IKoffiCType;
export declare const cPOINTER_64: koffi.IKoffiCType;
export declare const cFLOAT: koffi.IKoffiCType;
export declare const cDOUBLE: koffi.IKoffiCType;
export declare const cPSTR: koffi.IKoffiCType;
export declare const cPWSTR: koffi.IKoffiCType;
export declare const cPTSTR: koffi.IKoffiCType;
export declare const cLPSTR: koffi.IKoffiCType;
export declare const cLPWSTR: koffi.IKoffiCType;
export declare const cLPTSTR: koffi.IKoffiCType;
export declare const cPCSTR: koffi.IKoffiCType;
export declare const cPCWSTR: koffi.IKoffiCType;
export declare const cPCTSTR: koffi.IKoffiCType;
export declare const cLPCSTR: koffi.IKoffiCType;
export declare const cLPCWSTR: koffi.IKoffiCType;
export declare const cLPCTSTR: koffi.IKoffiCType;
export declare const cPVOID: koffi.IKoffiCType;
export declare const cLPVOID: koffi.IKoffiCType;
export declare const cLPCVOID: koffi.IKoffiCType;
export declare const cPBOOL: koffi.IKoffiCType;
export declare const cLPBOOL: koffi.IKoffiCType;
export declare const cPBOOLEAN: koffi.IKoffiCType;
export declare const cLPBOOLEAN: koffi.IKoffiCType;
export declare const cPCHAR: koffi.IKoffiCType;
export declare const cPUCHAR: koffi.IKoffiCType;
export declare const cPBYTE: koffi.IKoffiCType;
export declare const cLPBYTE: koffi.IKoffiCType;
export declare const cPWORD: koffi.IKoffiCType;
export declare const cLPWORD: koffi.IKoffiCType;
export declare const cPDWORD: koffi.IKoffiCType;
export declare const cLPDWORD: koffi.IKoffiCType;
export declare const cPDWORD32: koffi.IKoffiCType;
export declare const cPDWORD64: koffi.IKoffiCType;
export declare const cPDWORDLONG: koffi.IKoffiCType;
export declare const cPQWORD: koffi.IKoffiCType;
export declare const cPINT: koffi.IKoffiCType;
export declare const cLPINT: koffi.IKoffiCType;
export declare const cPUINT: koffi.IKoffiCType;
export declare const cPINT8: koffi.IKoffiCType;
export declare const cPUINT8: koffi.IKoffiCType;
export declare const cPINT16: koffi.IKoffiCType;
export declare const cPUINT16: koffi.IKoffiCType;
export declare const cPINT32: koffi.IKoffiCType;
export declare const cPUINT32: koffi.IKoffiCType;
export declare const cPINT64: koffi.IKoffiCType;
export declare const cPUINT64: koffi.IKoffiCType;
export declare const cPINT_PTR: koffi.IKoffiCType;
export declare const cPUINT_PTR: koffi.IKoffiCType;
export declare const cPSHORT: koffi.IKoffiCType;
export declare const cPUSHORT: koffi.IKoffiCType;
export declare const cPLONG: koffi.IKoffiCType;
export declare const cLPLONG: koffi.IKoffiCType;
export declare const cPULONG: koffi.IKoffiCType;
export declare const cLPULONG: koffi.IKoffiCType;
export declare const cPLONG32: koffi.IKoffiCType;
export declare const cPULONG32: koffi.IKoffiCType;
export declare const cPLONG64: koffi.IKoffiCType;
export declare const cPULONG64: koffi.IKoffiCType;
export declare const cPLONGLONG: koffi.IKoffiCType;
export declare const cPULONGLONG: koffi.IKoffiCType;
export declare const cPLONG_PTR: koffi.IKoffiCType;
export declare const cPULONG_PTR: koffi.IKoffiCType;
export declare const cPFLOAT: koffi.IKoffiCType;
export declare const cPDOUBLE: koffi.IKoffiCType;
export declare const cHANDLE: koffi.IKoffiCType;
export declare const cPHANDLE: koffi.IKoffiCType;
export declare const cLPHANDLE: koffi.IKoffiCType;
export declare const cHINSTANCE: koffi.IKoffiCType;
export declare const cWPARAM: koffi.IKoffiCType;
export declare const cLPARAM: koffi.IKoffiCType;
export declare const cHRESULT: koffi.IKoffiCType;
export declare const cLRESULT: koffi.IKoffiCType;
export declare const cATOM: koffi.IKoffiCType;
export type HANDLE<Kind extends string> = koffi.IKoffiCType & {
    __kind: Kind;
};
export type HINSTANCE = HANDLE<'HINSTANCE'>;
export type WPARAM = number | HANDLE<any>;
export type LPARAM = number | BigInt | HANDLE<any>;
export type HRESULT = number | HANDLE<any>;
export type LRESULT = number | BigInt | HANDLE<any>;
//# sourceMappingURL=ctypes.d.ts.map