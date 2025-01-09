import type { Plugin } from 'rollup'
import { enums } from './plugin-enums.js'
import { koffi } from './plugin-koffi.js'

export const libwin32: () => Plugin[] = () => [
    enums(),
    koffi(),
]

export default libwin32
