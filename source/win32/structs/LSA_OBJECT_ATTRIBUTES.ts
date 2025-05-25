import { koffi } from '../private.js'
import { cULONG, cHANDLE, cPVOID, type HANDLE } from '../ctypes.js'
import { cLSA_UNICODE_STRING, type LSA_UNICODE_STRING } from './LSA_UNICODE_STRING.js'

/**
 * Used with the LsaOpenPolicy function to specify the attributes of the connection to the Policy object.
 */
export class LSA_OBJECT_ATTRIBUTES {
    Length = koffi.sizeof(cLSA_OBJECT_ATTRIBUTES)
    RootDirectory:            HANDLE = null!
    ObjectName:               LSA_UNICODE_STRING = null!
    Attributes:               number = 0
    SecurityDescriptor:       unknown = null       // Points to type SECURITY_DESCRIPTOR
    SecurityQualityOfService: unknown = null       // Points to type SECURITY_QUALITY_OF_SERVICE
}

export const cLSA_OBJECT_ATTRIBUTES = koffi.struct('LSA_OBJECT_ATTRIBUTES', {
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cPVOID,
    SecurityQualityOfService: cPVOID
})
