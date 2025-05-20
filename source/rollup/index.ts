import type { Plugin } from 'rollup'
import { enums } from './plugin-enums.js'

export const libwin32: () => Plugin[] = () => [
    enums(),
]

export default libwin32
