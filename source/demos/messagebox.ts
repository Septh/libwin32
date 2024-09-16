import { MessageBox } from 'libwin32'
import { MB } from 'libwin32/consts/MB'

const result = MessageBox(
    null,
    "A simple MessageBox",
    "libwin32",
    MB.ICONINFORMATION | MB.YESNOCANCEL
)
console.log(result)
