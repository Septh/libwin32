import { platform, arch } from 'node:process'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'rollup'

export function koffi(): Plugin {

    // The path to Koffi's .node file.
    const koffiPath = fileURLToPath(new URL(
        `./build/koffi/${platform}_${arch}/koffi.node`,
        import.meta.resolve('koffi')  // Unflagged in Node v20.6.0, v18.19.0
    ))

    // The path we'll write it to.
    const destFile = `koffi-${platform}-${arch}.node`

    const VIRTUAL = '\0:STUB'
    let asset: string | null = null

    return {
        name: 'koffi',

        async buildStart() {

            // Make sure Koffi's present and accessible.
            const access = await fs.access(koffiPath, fs.constants.R_OK).catch((err: NodeJS.ErrnoException) => err)
            if (access instanceof Error) {
                return this.error({ message: "Koffi not found!", cause: access, stack: undefined })
            }

            asset = null
        },

        resolveId(id) {
            // Replace our stub import in private.ts ("./stubs/koffi.cjs") with some custom code.
            return /stubs\/koffi\.c[jt]s$/.test(id)
                ? VIRTUAL
                : null
        },

        load(id) {
            if (id === VIRTUAL) {

                // Emit Koffi's C code as an asset. This allows us to respect the `assetFileNames` option.
                // Don't load it right now, though: the file is big (2,33Mb).
                asset = this.emitFile({
                    type: 'asset',
                    name: destFile,
                    needsCodeReference: true
                })

                return [
                    `import { createRequire } from 'node:module';`,
                    `const require = createRequire(import.meta.url);`,
                    `export default require(import.meta.ROLLUP_FILE_URL_${asset})`,
                ].join('\n')
            }
            return null
        },

        async renderStart() {
            if (asset) {
                this.setAssetSource(asset, await fs.readFile(koffiPath))
                const n = this.getFileName(asset)
                if (!n.endsWith('.node')) {
                    this.warn([
                        "Invalid extension for Koffi's native code file, your bundle will most likely crash at runtime.",
                        "Please check `assetFileNames` in rollup.config and make sure it ends with the `.[ext]` placeholder."
                    ].join('\n'))
                }
            }
        },

        resolveFileUrl({ referenceId, fileName }) {
            return referenceId === asset
                ? `"./${fileName}"`
                : null
        }
    }
}
