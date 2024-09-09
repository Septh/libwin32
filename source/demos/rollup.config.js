// @ts-check
import path from 'node:path'
import { defineConfig } from 'rollup'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { koffi } from 'libwin32/rollup-plugin'

export default [
    config('window'),
    config('messagebox')
]

/** @param {string} which */
function config(which) {
    const outDir = path.join('demos', which)
    return defineConfig({
        input: path.join('source', 'demos', `${which}.ts`),
        output: {
            dir: outDir,
            format: 'esm',
            generatedCode: {
                preset: 'es2015',
                symbols: false
            },
            assetFileNames: 'assets/[name].[ext]',
            sourcemap: true,
            manualChunks: {}
        },
        treeshake: {
            preset: 'smallest',
            manualPureFunctions: [
                'koffi.alias', 'koffi.pointer'
            ]
        },
        plugins: [
            nodeExternals(),
            nodeResolve(),
            commonjs(),
            typescript({
                compilerOptions: {
                    outDir,
                    declaration: false,
                    declarationMap: false,
                    preserveConstEnums: false
                }
            }),
            koffi(),
        ]
    })
}
