import { MessageBox } from 'libwin32'
import { MB_ } from 'libwin32/consts'

// https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messageboxw#return-value
const results: Record<number, string> = {
    3:  'ABORT',
    2:  'CANCEL',
    11: 'CONTINUE',
    5:  'IGNORE',
    7:  'NO',
    1:  'OK',
    4:  'RETRY',
    10: 'TRYAGAIN',
    6:  'YES'
}

const result = MessageBox(
    null,
    "A simple MessageBox",
    "libwin32",
    MB_.ICONINFORMATION | MB_.YESNOCANCEL
)
console.log(results[result])
