import koffi from './stubs/koffi.cjs';
export { koffi };
export interface WinDll extends Disposable {
    name: string;
    lib: koffi.IKoffiLib;
    x64: boolean;
    Unicode: boolean;
}
export declare function load(name: string): WinDll;
//# sourceMappingURL=private.d.ts.map