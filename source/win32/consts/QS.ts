/**
 * QueueStatus flags
 */
export enum QS_ {
    KEY         = 0x0001,
    MOUSEMOVE   = 0x0002,
    MOUSEBUTTON = 0x0004,
    POSTMSG     = 0x0008,
    TIMER       = 0x0010,
    PAINT       = 0x0020,
    SENDMSG     = 0x0040,
    HOTKEY      = 0x0080,
    ALLPOSTMSG  = 0x0100,
    RAWINPUT    = 0x0400,
    MOUSE       = MOUSEMOVE | MOUSEBUTTON,
    INPUT       = MOUSE | KEY | RAWINPUT,
    ALLEVENTS   = INPUT | POSTMSG | TIMER | PAINT | HOTKEY,
    ALLINPUT    = INPUT | POSTMSG | TIMER | PAINT | HOTKEY | SENDMSG
}
