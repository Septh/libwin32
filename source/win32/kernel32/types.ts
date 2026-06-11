/**
 * Contains a 64-bit value representing the number of 100-nanosecond intervals since January 1, 1601 (UTC).
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-filetime
 */
export interface FILETIME {
    dwLowDateTime: number
    dwHighDateTime: number
}

/**
 * Specifies a date and time, using individual members for the month, day, year, weekday, hour, minute, second, and millisecond.
 *
 * https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-systemtime
 */
export interface SYSTEMTIME {
    wYear:         number
    wMonth:        number
    wDayOfWeek:    number
    wDay:          number
    wHour:         number
    wMinute:       number
    wSecond:       number
    wMilliseconds: number
}
