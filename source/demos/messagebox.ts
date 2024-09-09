import { MB, MessageBox } from 'libwin32'

const result = MessageBox(
    null,
    "A simple MessageBox",
    "libwin32",
    MB.ICONINFORMATION | MB.YESNOCANCEL
)
console.log(result)
