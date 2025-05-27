/*
 * This demo is adapted from MS's sample code "Searching for a SID in an Access Token"
 * https://learn.microsoft.com/en-us/windows/win32/secauthz/searching-for-a-sid-in-an-access-token-in-c--
 */

import {
    GetCurrentProcess,
    OpenProcessToken, GetTokenInformation,
    AllocateAndInitializeSid, FreeSid, EqualSid, LookupAccountSid,
    GetLastError, FormatMessage
} from 'libwin32'
import {
    TOKEN_, TOKEN_INFORMATION_CLASS,
    SECURITY_, DOMAIN_ALIAS_, SECURITY_NT_AUTHORITY, SE_GROUP_,
    FORMAT_MESSAGE_
} from 'libwin32/consts'

function SearchTokenGroupsForSID() {

    // Open a handle to the access token for the calling process.
    const hToken = OpenProcessToken(GetCurrentProcess(), TOKEN_.QUERY)
    if (!hToken) {
        console.error("OpenProcessToken Error:", FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError(), 0))
        return
    }

    // Call GetTokenInformation to get the group information.
    const groupInfo = GetTokenInformation(hToken, TOKEN_INFORMATION_CLASS.TokenGroups)
    if (!groupInfo) {
        console.error("GetTokenInformation Error:", FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError(), 0))
        return
    }

    // Create a SID for the BUILTIN\Administrators group.
    const adminsSid = AllocateAndInitializeSid(SECURITY_NT_AUTHORITY, 2, SECURITY_.BUILTIN_DOMAIN_RID, DOMAIN_ALIAS_.RID_ADMINS, 0, 0, 0, 0, 0, 0)
    if (!adminsSid) {
        console.error("AllocateAndInitializeSid Error:", FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError(), 0))
        return
    }

    // Loop through the group SIDs looking for the administrator SID.
    for (let i = 0; i < groupInfo.GroupCount; i++) {
        if (EqualSid(adminsSid, groupInfo.Groups[i].Sid)) {
            const names = LookupAccountSid(null, groupInfo.Groups[i].Sid)
            if (!names) {
                console.error("LookupAccountSid Error:", FormatMessage(FORMAT_MESSAGE_.FROM_SYSTEM, null, GetLastError(), 0))
                continue
            }
            console.log(`Current user is a member of ${names.ReferencedDomainName}\\${names.Name} group`)

            // Find out whether the SID is enabled in the token.
            if (groupInfo.Groups[i].Attributes & SE_GROUP_.ENABLED)
                console.log("The group SID is enabled.")
            else if (groupInfo.Groups[i].Attributes & SE_GROUP_.USE_FOR_DENY_ONLY)
                console.log("The group SID is a deny-only SID.")
            else
                console.log("The group SID is not enabled.")
        }
    }

    // Release the memory we allocated.
    if (adminsSid)
        FreeSid(adminsSid)
}

SearchTokenGroupsForSID()
