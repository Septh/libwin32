/**
 * WS_xxx - Window styles.
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/window-styles
 */
export enum WS {
    BORDER           = 0x00800000,
    CAPTION          = 0x00c00000, /* WS_BORDER | WS_DLGFRAME  */
    CHILD            = 0x40000000,
    CLIPCHILDREN     = 0x02000000,
    CLIPSIBLINGS     = 0x04000000,
    DISABLED         = 0x08000000,
    DLGFRAME         = 0x00400000,
    GROUP            = 0x00020000,
    HSCROLL          = 0x00100000,
    MAXIMIZE         = 0x01000000,
    MAXIMIZEBOX      = 0x00010000,
    MINIMIZE         = 0x20000000,
    MINIMIZEBOX      = 0x00020000,
    OVERLAPPED       = 0x00000000,
    POPUP            = 0x80000000,
    SYSMENU          = 0x00080000,
    TABSTOP          = 0x00010000,
    THICKFRAME       = 0x00040000,
    VISIBLE          = 0x10000000,
    VSCROLL          = 0x00200000,
    CHILDWINDOW      = CHILD,
    ICONIC           = MINIMIZE,
    OVERLAPPEDWINDOW = OVERLAPPED | CAPTION | SYSMENU | THICKFRAME | MINIMIZEBOX | MAXIMIZEBOX,
    POPUPWINDOW      = POPUP | BORDER | SYSMENU,
    SIZEBOX          = THICKFRAME,
    TILED            = OVERLAPPED,
    TILEDWINDOW      = OVERLAPPEDWINDOW
}

/**
 * WS_EX_xxx - Extended Window styles
 *
 * https://learn.microsoft.com/en-us/windows/win32/winmsg/extended-window-styles
 */
export enum WS_EX {
    ACCEPTFILES         = 0x00000010,
    APPWINDOW           = 0x00040000,
    CLIENTEDGE          = 0x00000200,
    COMPOSITED          = 0x02000000,
    CONTEXTHELP         = 0x00000400,
    CONTROLPARENT       = 0x00010000,
    DLGMODALFRAME       = 0x00000001,
    EX_LAYOUTRTL        = 0x00400000,
    LAYERED             = 0x00080000,
    LEFT                = 0x00000000,
    LEFTSCROLLBAR       = 0x00004000,
    LTRREADING          = 0x00000000,
    MDICHILD            = 0x00000040,
    NOACTIVATE          = 0x08000000,
    NOINHERITLAYOUT     = 0x00100000,
    NOPARENTNOTIFY      = 0x00000004,
    NOREDIRECTIONBITMAP = 0x00200000,
    RIGHT               = 0x00001000,
    RIGHTSCROLLBAR      = 0x00000000,
    RTLREADING          = 0x00002000,
    STATICEDGE          = 0x00020000,
    TOOLWINDOW          = 0x00000080,
    TOPMOST             = 0x00000008,
    TRANSPARENT         = 0x00000020,
    WINDOWEDGE          = 0x00000100,
    OVERLAPPEDWINDOW    = WINDOWEDGE | CLIENTEDGE,
    PALETTEWINDOW       = WINDOWEDGE | TOOLWINDOW | TOPMOST
}
