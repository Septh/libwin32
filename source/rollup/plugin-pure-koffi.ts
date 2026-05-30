import type { Plugin } from 'rollup'

/**
 * Because Koffi has to stay external, since it's native code, Rollup cannot
 * determine whether its code is side-effect-free or not and hence decides not to
 * tree-shake any Koffi call. And since we use Koffi about everywhere in libwin2,
 * this severely limits the lib's tree-shakeability.
 *
 * So this plugin simply declares everything Koffi as pure for maximum tree-shakeability.
 */
export const pureKoffi: Plugin = {
    name: 'libwin32-pure-koffi',
    options: {
        order: 'post',
        handler(options) {
            let { treeshake = {} } = options
            if (!treeshake)
                return
            if (treeshake === true)
                treeshake = {}
            else if (typeof treeshake === 'string')
                treeshake = { preset: treeshake }

            // Exclude `koffi.encode()` and `koffi.decode()` until https://github.com/rollup/rollup/issues/6399 is fixed.
            treeshake.manualPureFunctions = [
                'koffi.types',
                'koffi.load', 'koffi.unload',
                'koffi.pointer', 'koffi.opaque', 'koffi.array', 'koffi.struct', 'koffi.union', 'koffi.proto',
                'koffi.disposable', 'koffi.alias',
                'koffi.sizeof', 'koffi.alignof',
                'koffi.out', 'koffi.inout',
                ...(treeshake.manualPureFunctions ?? [])
            ]

            options.treeshake = treeshake
            return options
        }
    }
}
