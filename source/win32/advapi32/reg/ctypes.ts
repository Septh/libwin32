import koffi from 'koffi'
import { cDWORD, cPVOID, cSTR } from '../../internals.js'

export const cVALENT = koffi.struct({
    ve_valuename: cSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cPVOID,
    ve_type:      cDWORD
})
