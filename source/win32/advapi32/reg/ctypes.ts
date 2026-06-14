import koffi from 'koffi'
import { cDWORD, cP_VOID, cWSTR } from '../../internals.js'

export const cVALENT = koffi.struct({
    ve_valuename: cWSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cP_VOID,
    ve_type:      cDWORD
})
