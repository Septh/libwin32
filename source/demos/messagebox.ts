import { MessageBox } from 'libwin32'
import { MB_ } from 'libwin32/consts/MB'

const result = MessageBox(
    null,
    "A simple MessageBox",
    "libwin32",
    MB_.ICONINFORMATION | MB_.YESNOCANCEL
)
console.log(result)
