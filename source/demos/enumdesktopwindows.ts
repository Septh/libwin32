import {
    EnumDesktopWindows, GetWindowText
} from 'libwin32'

const filters = [
    'MSCTFIME UI', 'Default IME'
]

EnumDesktopWindows((hwnd, lParam) => {
    const title = GetWindowText(hwnd)
    if (title.length && !filters.includes(title))
        console.log(title)
    return 1
}, 0)
