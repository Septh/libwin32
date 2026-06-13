import koffi from 'koffi'
import { cDWORD, cWSTR, cPVOID } from '../../internals.js'

export const cVALENT = koffi.struct({
    ve_valuename: cWSTR,
    ve_valuelen:  cDWORD,
    ve_valueptr:  cPVOID,
    ve_type:      cDWORD
})
