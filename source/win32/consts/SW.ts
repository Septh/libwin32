/**
 * SW_xxx - ShowWindow() Commands (nCmdShow) & identifiers for the WM_SHOWWINDOW message
 */
export enum SW_ {
    HIDE            = 0,
    SHOWNORMAL      = 1,
    NORMAL          = 1,
    SHOWMINIMIZED   = 2,
    SHOWMAXIMIZED   = 3,
    MAXIMIZE        = 3,
    SHOWNOACTIVATE  = 4,
    SHOW            = 5,
    MINIMIZE        = 6,
    SHOWMINNOACTIVE = 7,
    SHOWNA          = 8,
    RESTORE         = 9,
    SHOWDEFAULT     = 10,
    FORCEMINIMIZE   = 11,
    MAX             = 11,

    PARENTCLOSING   = 1,
    OTHERZOOM       = 2,
    PARENTOPENING   = 3,
    OTHERUNZOOM     = 4
}
