/**
 * Broadcast Special Message Flags
 */
export enum BSF_ {
    QUERY              = 0x00000001,
    IGNORECURRENTTASK  = 0x00000002,
    FLUSHDISK          = 0x00000004,
    NOHANG             = 0x00000008,
    POSTMESSAGE        = 0x00000010,
    FORCEIFHUNG        = 0x00000020,
    NOTIMEOUTIFNOTHUNG = 0x00000040,
    ALLOWSFW           = 0x00000080,
    SENDNOTIFYMESSAGE  = 0x00000100,
    RETURNHDESK        = 0x00000200,
    LUID               = 0x00000400
}

/** Return this value to deny a query. */
export const BROADCAST_QUERY_DENY = 0x424D5144
