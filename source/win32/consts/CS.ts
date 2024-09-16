// #endregion
// #region Constants
/**
 * CS_xxx - Window Class styles
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-class-styles
 */

export enum CS {
    NULL,
    BYTEALIGNCLIENT = 0x00001000,
    BYTEALIGNWINDOW = 0x00002000,
    CLASSDC = 0x00000040,
    DBLCLKS = 0x00000008,
    DROPSHADOW = 0x00020000,
    GLOBALCLASS = 0x00004000,
    HREDRAW = 0x00000002,
    // IME             = 0x00010000,
    NOCLOSE = 0x00000200,
    OWNDC = 0x00000020,
    PARENTDC = 0x00000080,
    SAVEBITS = 0x00000800,
    VREDRAW = 0x00000001
}
