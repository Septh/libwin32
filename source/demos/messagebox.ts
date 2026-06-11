import { MessageBox } from 'libwin32'
import {
    MB_,
    IDYES, IDNO, IDCANCEL
} from 'libwin32/consts'

const results: Record<number, string> = {
    [IDYES]:    'YES',
    [IDNO]:     'NO',
    [IDCANCEL]: 'CANCEL'
}

const button = MessageBox(
    null,
    'Hello, world!',
    'libwin32',
    MB_.ICONINFORMATION | MB_.YESNOCANCEL
)
console.log(results[button])
