import koffi from 'koffi'
import { cDWORD, cP_VOID, cSTR } from '../../internals.js'

export const cVALENT = koffi.struct({
    ve_valuename: cSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cP_VOID,
    ve_type:      cDWORD
})
