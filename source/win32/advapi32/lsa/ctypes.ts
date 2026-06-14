import koffi from 'koffi'
import { cBOOL, cHANDLE, cINT, cLONG, cLONGLONG, cP_VOID, cSTR, cULONG, cUSHORT } from '../../internals.js'
import { cGUID } from '../../chore/ctypes.js'
import { cPSID } from '../sid/ctypes.js'

export const cLSA_UNICODE_STRING = koffi.struct({
    Length:        cUSHORT,
    MaximumLength: cUSHORT,
    Buffer:        cSTR
})

export const cLSA_OBJECT_ATTRIBUTES = koffi.struct({
    Length:                   cULONG,
    RootDirectory:            cHANDLE,
    ObjectName:               koffi.pointer(cLSA_UNICODE_STRING),
    Attributes:               cULONG,
    SecurityDescriptor:       cP_VOID,
    SecurityQualityOfService: cP_VOID
})

export const cLSA_TRANSLATED_SID2 = koffi.struct({
    Use: cINT,
    Sid: cPSID,
    DomainIndex: cLONG,
    Flags: cULONG
})

export const cLSA_TRUST_INFORMATION = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})

export const cLSA_REFERENCED_DOMAIN_LIST = koffi.struct({
    Entries: cULONG,
    Domains: koffi.pointer(null, cLSA_TRUST_INFORMATION, 'Entries')
})

export const cPOLICY_ACCOUNT_DOMAIN_INFO = koffi.struct({
    DomainName: cLSA_UNICODE_STRING,
    DomainSid: cPSID
})

export const cPOLICY_AUDIT_EVENTS_INFO = koffi.struct({
    AuditingMode: cBOOL,
    EventAuditingOptions: koffi.pointer(null, cULONG, 'MaximumAuditEventCount'),
    MaximumAuditEventCount: cULONG
})

export const cPOLICY_DNS_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    DnsDomainName: cLSA_UNICODE_STRING,
    DnsForestName: cLSA_UNICODE_STRING,
    DomainGuid: cGUID,
    Sid: cPSID
})

export const cPOLICY_LSA_SERVER_ROLE_INFO = koffi.struct({
    LsaServerRole: cINT
})

export const cPOLICY_MODIFICATION_INFO = koffi.struct({
    ModifiedId: cLONGLONG,
    DatabaseCreationTime: cLONGLONG
})

export const cPOLICY_PRIMARY_DOMAIN_INFO = koffi.struct({
    Name: cLSA_UNICODE_STRING,
    Sid: cPSID
})
