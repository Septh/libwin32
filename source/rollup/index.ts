import type { Plugin } from 'rollup'
import { enums } from './plugin-enums.js'
import { pureKoffi } from './plugin-pure-koffi.ts'

export const libwin32: () => Plugin[] = () => [
    enums(), pureKoffi
]

export default libwin32
