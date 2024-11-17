
/**
 * PeekMessage flags
 */
export enum PM_ {
    NOREMOVE      = 0x0000,
    REMOVE        = 0x0001,
    NOYIELD       = 0x0002,
    QS_INPUT      = 0x000000E0,
    QS_POSTMSG    = 0x00000008,
    QS_HOTKEY     = 0x00000080,
    QS_TIMER      = 0x00000010,
    QS_PAINT      = 0x00000020,
    QS_SENDMSG    = 0x00000040
}