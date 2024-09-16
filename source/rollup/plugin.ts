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
    const koffiDest = `koffi/${platform}-${arch}.node`

    const VIRTUAL = '\0:KOFFI'
    let asset: string
    let outputDir: string

    return {
        name: 'koffi',

        async buildStart() {
            outputDir = asset = ''

            // Make sure Koffi's installed and accessible.
            const err = await fs.access(koffiSource, fs.constants.R_OK).catch((err: NodeJS.ErrnoException) => err)
            if (err instanceof Error)
                this.error({ message: `Cannot access "${koffiSource}": ${err.code}.`, stack: undefined })
        },

        resolveId(id) {

            // Replace our stub import in private.ts ("./stubs/koffi.cjs") with some custom code.
            return id === './stubs/koffi.js'
                ? VIRTUAL
                : null
        },

        load(id) {
            if (id === VIRTUAL) {

                // Emit Koffi's C code as an asset. This allows us to use Rollup's FILE_URL feature.
                // Note: because the file is big (2,33Mb), we emit an empty asset for now, and overwrite it at closeBundle().
                asset = this.emitFile({
                    type: 'asset',
                    fileName: koffiDest,
                    originalFileName: koffiSource,
                    source: ''
                })

                return [
                    `import { createRequire } from 'node:module';`,
                    `const require = createRequire(import.meta.url);`,
                    `export default require(import.meta.ROLLUP_FILE_URL_${asset})`
                ].join('\n')
            }
            return null
        },

        renderStart(options) {
            outputDir = options.dir ?? path.dirname(options.file!)
        },

        resolveFileUrl({ referenceId, fileName }) {
            return referenceId === asset
                ? `"./${fileName}"`
                : null
        },

        async closeBundle() {
            if (asset) {
                const destFile = path.join(outputDir, koffiDest)
                await fs.mkdir(path.dirname(destFile), { recursive: true }).catch(() => {})
                const err = await fs.copyFile(koffiSource, destFile).catch((err: NodeJS.ErrnoException) => err)
                if (err instanceof Error)
                    this.error({ message: `Cannot write "${destFile}": ${err.code}.`, stack: undefined })
            }
        },
    }
}
