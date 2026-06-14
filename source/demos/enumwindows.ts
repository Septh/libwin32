import {
    EnumWindows, GetWindowText
} from 'libwin32/user32'

const filters = [
    // cSpell:disable-next-line
    'MSCTFIME UI', 'Default IME'
]

EnumWindows((hwnd, lParam) => {
    const title = GetWindowText(hwnd)
    if (title.length && !filters.includes(title))
        console.log(title)
    return 1
}, 0)
