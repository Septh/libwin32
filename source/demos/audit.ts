/*
 * This demo is based on MS's sample code "Managing the Audit Status"
 * https://github.com/microsoft/Windows-classic-samples/tree/main/Samples/Win7Samples/security/authorization/audit
 *
 * This demo only queries the current audit status; it does not change it.
 */
import {
    LsaOpenPolicy, LsaQueryInformationPolicy, LsaClose, LsaFreeMemory, LsaNtStatusToWinError,
    FormatMessage, isHandle, isErrorStatus,
    type POLICY_AUDIT_EVENT_OPTIONS, type LSA_HANDLE
} from 'libwin32'
import {
    POLICY_, POLICY_AUDIT_EVENT_, POLICY_AUDIT_EVENT_TYPE,
    NTSTATUS_, FORMAT_MESSAGE_,
    POLICY_INFORMATION_CLASS,
} from 'libwin32/consts'

function displayAuditEventOption(eventTypeIndex: number, eventOption: POLICY_AUDIT_EVENT_OPTIONS) {
    let output = 'AuditCategory: '

    switch (eventTypeIndex) {
        case POLICY_AUDIT_EVENT_TYPE.AuditCategorySystem: output += 'System'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryLogon: output += 'Logon'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryObjectAccess: output += 'ObjectAccess'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryPrivilegeUse: output += 'PrivilegeUse'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryDetailedTracking: output += 'DetailedTracking'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryPolicyChange: output += 'PolicyChange'; break
        case POLICY_AUDIT_EVENT_TYPE.AuditCategoryAccountManagement: output += 'AccountManagement'; break
        default: output += 'Unknown'
    }

    if (eventOption & POLICY_AUDIT_EVENT_.SUCCESS)
        output += ' (AUDIT_EVENT_SUCCESS)'
    if (eventOption & POLICY_AUDIT_EVENT_.FAILURE)
        output += ' (AUDIT_EVENT_FAILURE)'

    console.log(output)
}

function displayAudit(policy: LSA_HANDLE) {
    const auditEvents = LsaQueryInformationPolicy(policy, POLICY_INFORMATION_CLASS.PolicyAuditEventsInformation)
    if (isErrorStatus(auditEvents))
        console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, LsaNtStatusToWinError(auditEvents)))
    else {
        if (auditEvents.AuditingMode)
            console.log('Auditing enabled.')
        else
            console.log('Auditing disabled.')

        for (let i = 0; i < auditEvents.MaximumAuditEventCount; i++)
            displayAuditEventOption(i, auditEvents.EventAuditingOptions[i])

        LsaFreeMemory(auditEvents)
    }
}

const computerName = process.argv[2] || null
const policy = LsaOpenPolicy(computerName, POLICY_.VIEW_AUDIT_INFORMATION)
if (isHandle(policy)) {
    displayAudit(policy)
    LsaClose(policy)
}
else {
    console.error('LsaOpenPolicy() returned NTSTATUS 0x%s (%s)', policy.toString(16), NTSTATUS_[policy])
    console.error(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, LsaNtStatusToWinError(policy)))
}
