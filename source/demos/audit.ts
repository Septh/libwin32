import {
    LsaOpenPolicy, LsaQueryAuditEventsInformationPolicy, LsaClose, LsaFreeMemory, LsaNtStatusToWinError,
    FormatMessage, isHandle,
    type LSA_HANDLE
} from 'libwin32'
import {
    POLICY_, POLICY_AUDIT_EVENT_, POLICY_AUDIT_EVENT_TYPE,
    NTSTATUS_, FORMAT_MESSAGE_,
} from 'libwin32/consts'

function displayAudit(policy: LSA_HANDLE) {
    const events = LsaQueryAuditEventsInformationPolicy(policy)
    if (typeof events === 'object') {
        if (events.AuditingMode)
            console.log('Auditing enabled.')
        else
            console.log('Auditing disabled.')

        for (let i = 0; i < events.MaximumAuditEventCount; i++) {
            const eventOption = events.EventAuditingOptions[i]
            switch (i) {
                case POLICY_AUDIT_EVENT_TYPE.AuditCategorySystem: console.log('System'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryLogon: console.log('Logon'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryObjectAccess: console.log('ObjectAccess'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryPrivilegeUse: console.log('PrivilegeUse'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryDetailedTracking: console.log('DetailedTracking'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryPolicyChange: console.log('PolicyChange'); break
                case POLICY_AUDIT_EVENT_TYPE.AuditCategoryAccountManagement: console.log('AccountManagement'); break
                default: console.log('Unknown')
            }

            if (eventOption & POLICY_AUDIT_EVENT_.SUCCESS)
                console.log('  AUDIT_EVENT_SUCCESS')
            if (eventOption & POLICY_AUDIT_EVENT_.FAILURE)
                console.log('  AUDIT_EVENT_FAILURE')
        }

        LsaFreeMemory(events)
    }
}

const computerName = process.argv[2] || null
const policy = LsaOpenPolicy(computerName, POLICY_.VIEW_AUDIT_INFORMATION)
if (isHandle(policy)) {
    displayAudit(policy)
    LsaClose(policy)
}
else {
    console.log('LsaOpenPolicy() returned NTSTATUS 0x%s (%s)', policy.toString(16), NTSTATUS_[policy])
    console.log(FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, LsaNtStatusToWinError(policy)))
}
