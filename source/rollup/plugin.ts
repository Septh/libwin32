import { platform, arch } from 'node:process'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Plugin } from 'rollup'

export function koffi(): Plugin {

    // The path to Koffi's .node file.
    const koffiSource = fileURLToPath(new URL(
        `./build/koffi/${platform}_${arch}/koffi.node`,
        import.meta.resolve('koffi')  // Unflagged in Node v20.6.0, v18.19.0
    ))

    // The path we'll copy it to.
    const koffiDest = `koffi-${platform}-${arch}.node`

    let copy = false

    return {
        name: 'koffi-cream',

        async buildStart() {
            copy = false

            // Make sure Koffi's installed and accessible.
            const err = await fs.access(koffiSource, fs.constants.R_OK).catch((err: NodeJS.ErrnoException) => err)
            if (err instanceof Error)
                this.error({ message: `Cannot access "${koffiSource}": ${err.code}.`, stack: undefined })
        },

        buildEnd(error) {
            copy = !error
        },

        async writeBundle(options) {
            if (copy) {

                // Create all necessary directories.
                const outDir = path.join(
                    options.dir ?? path.dirname(options.file!),
                    'node_modules', 'koffi'
                )
                await fs.mkdir(outDir, { recursive: true }).catch(() => {})

                // Copy Koffi's native code.
                const destFile = path.join(outDir, koffiDest)
                let err = await fs.copyFile(koffiSource, destFile).catch((err: NodeJS.ErrnoException) => err)
                if (err instanceof Error)
                    this.error({ message: `Cannot write "${destFile}": ${err.code}.`, stack: undefined })

                // Write index.cjs
                err = await fs.writeFile(path.join(outDir, 'index.cjs'), [
                    `module.exports = require('./${koffiDest}');`
                ].join('\n')).catch((err: NodeJS.ErrnoException) => err)
                if (err instanceof Error)
                    this.error({ message: `Cannot write index.cjs: ${err.code}.`, stack: undefined })

                // Write package.json
                err = await fs.writeFile(path.join(outDir, 'package.json'), JSON.stringify({
                    name: 'koffi',
                    type: 'commonjs',
                    main: './index.cjs'
                }, undefined, 2)).catch((err: NodeJS.ErrnoException) => err)
                if (err instanceof Error)
                    this.error({ message: `Cannot write package.json: ${err.code}.`, stack: undefined })
            }
        },
    }
}
