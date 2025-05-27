import { KoffiFunction } from 'koffi-cream'

declare global {
    interface Function {
        native?: KoffiFunction
    }
}

declare module 'koffi-cream' {

    // Add missing member_name parameter
    export function offsetof(type: TypeSpec, member_name: string): number;

    // Add missing function
    export function view(ptr: any, len: number): ArrayBuffer
}
