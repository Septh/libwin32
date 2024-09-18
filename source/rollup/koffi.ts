import { platform, arch } from 'node:process'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { Plugin } from 'rollup'

/**
 * A plugin that simplifies bundling Koffi with user apps.
 */
export function koffi(): Plugin {

    // The path to the orginal `koffi.node` binary.
    const koffiSource = fileURLToPath(new URL(
        `./build/koffi/${platform}_${arch}/koffi.node`,
        import.meta.resolve('koffi')
    ))

    // The name under which we'll copy it to.
    const koffi_win32_x64 = `koffi-${platform}-${arch}.node`

    // Won't do if this is still false at writeBundle() time.
    let copy = false

    return {
        name: 'libwin32-koffi-cream',

        async buildStart() {
            copy = false

            // Make sure Koffi's installed and accessible.
            const err = await fs.access(koffiSource, fs.constants.R_OK).catch((err: NodeJS.ErrnoException) => err)
            if (err instanceof Error)
                this.error({ message: `Cannot access "${koffiSource}": ${err.code}. Did you install koffi as a dependency?`, stack: undefined })
        },

        buildEnd(error) {
            copy = !error
        },

        async writeBundle(options) {
            if (copy) {

                // Create all the necessary directories.
                const outDir = path.join(
                    options.dir ?? path.dirname(options.file!),
                    'node_modules', 'koffi'
                )
                await fs.mkdir(outDir, { recursive: true }).catch(() => {})

                // Copy Koffi's binary.
                const outFile = path.join(outDir, koffi_win32_x64)
                let err = await fs.copyFile(koffiSource, outFile).catch((err: NodeJS.ErrnoException) => err)
                if (err)
                    this.error({ message: `Cannot write "${outFile}": ${err.code}.`, stack: undefined })

                // Write index.cjs
                err = await fs.writeFile(
                    path.join(outDir, 'index.cjs'),
                    `module.exports = require('./${koffi_win32_x64}');`
                ).catch((err: NodeJS.ErrnoException) => err)
                if (err)
                    this.error({ message: `Cannot write index.cjs: ${err.code}.`, stack: undefined })

                // Write package.json
                err = await fs.writeFile(path.join(outDir, 'package.json'), JSON.stringify({
                    name: 'koffi',
                    description: `koffi binary for ${platform} ${arch} systems`,
                    type: 'commonjs',
                    main: './index.cjs'
                }, undefined, 2)).catch((err: NodeJS.ErrnoException) => err)
                if (err)
                    this.error({ message: `Cannot write package.json: ${err.code}.`, stack: undefined })
            }
        }
    }
}
