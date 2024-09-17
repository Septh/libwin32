/** Special HWND values. */
export enum HWND_ {
    // PostMessage() and SendMessage()
    BROADCAST = 0xffff,
    MESSAGE   = -3,
    // CreateWindow(), et al.
    DESKTOP   = 0,
    TOP       = 0,
    BOTTOM    = 1,
    TOPMOST   = -1,
    NOTOPMOST = -2
}
