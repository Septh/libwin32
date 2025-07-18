import { KoffiFunction } from 'koffi-cream'

declare global {
    interface Function {
        native?: KoffiFunction
    }
}

declare module 'koffi-cream' {

    // Add missing overload with member_name parameter
    export function offsetof(type: TypeSpec, member_name: string): number;

    // Add missing function
    export function view(ptr: any, len: number): ArrayBuffer

    // TypeScript doest not allow redeclaring a variable,
    // so we'll have to cast koffi.types to this type.
    type PrimitiveTypes = Record<
        | 'bool'
        | 'char'
        | 'char16_t'
        | 'char16'
        | 'char32_t'
        | 'char32'
        | 'double'
        | 'float'
        | 'float32'
        | 'float64'
        | 'int'
        | 'int8_t'
        | 'int8'
        | 'int16_be_t'
        | 'int16_be'
        | 'int16_le_t'
        | 'int16_le'
        | 'int16_t'
        | 'int16'
        | 'int32_be_t'
        | 'int32_be'
        | 'int32_le_t'
        | 'int32_le'
        | 'int32_t'
        | 'int32'
        | 'int64_be_t'
        | 'int64_be'
        | 'int64_le_t'
        | 'int64_le'
        | 'int64_t'
        | 'int64'
        | 'intptr_t'
        | 'intptr'
        | 'long long'
        | 'long'
        | 'longlong'
        | 'short'
        | 'size_t'
        | 'str'
        | 'str16'
        | 'str32'
        | 'string'
        | 'string16'
        | 'string32'
        | 'uchar'
        | 'uint'
        | 'uint8_t'
        | 'uint8'
        | 'uint16_be_t'
        | 'uint16_be'
        | 'uint16_le_t'
        | 'uint16_le'
        | 'uint16_t'
        | 'uint16'
        | 'uint32_be_t'
        | 'uint32_be'
        | 'uint32_le_t'
        | 'uint32_le'
        | 'uint32_t'
        | 'uint32'
        | 'uint64_be_t'
        | 'uint64_be'
        | 'uint64_le_t'
        | 'uint64_le'
        | 'uint64_t'
        | 'uint64'
        | 'uintptr_t'
        | 'uintptr'
        | 'ulong'
        | 'ulonglong'
        | 'unsigned char'
        | 'unsigned int'
        | 'unsigned long long'
        | 'unsigned long'
        | 'unsigned short'
        | 'ushort'
        | 'void'
        | 'wchar'
        | 'wchar_t',
    IKoffiCType>
}
