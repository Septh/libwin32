import { QS_ } from './QS.js';

/**
 * PeekMessage flags
 */
export enum PM_ {
    NOREMOVE   = 0x0000,
    REMOVE     = 0x0001,
    NOYIELD    = 0x0002,
    QS_INPUT   = (QS_.INPUT << 16),
    QS_POSTMSG = (QS_.POSTMSG << 16),
    QS_HOTKEY  = (QS_.HOTKEY << 16),
    QS_TIMER   = (QS_.TIMER << 16),
    QS_PAINT   = (QS_.PAINT << 16),
    QS_SENDMSG = (QS_.SENDMSG << 16)
}
