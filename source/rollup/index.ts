import type { Plugin } from 'rollup'
import { enums } from './plugin-enums.js'
import { uncomment } from './plugin-uncomment.js'
import { koffi } from './plugin-koffi.js'

export const libwin32: () => Plugin[] = () => [
    enums(),
    uncomment(),
    koffi(),
]

export default libwin32
