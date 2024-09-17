/*
 * This config only bundles the demos. The library itself is published unbundled.
 */
// @ts-check
import { defineConfig } from 'rollup'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { koffi } from './dist/rollup/plugin.js'

// Use distinct configs to prevent Rollup from code-splitting the library.
export default [
    makeConfig('messagebox'),
    makeConfig('enumdesktopwindows'),
    makeConfig('window'),
]

/** @param { string } which */
function makeConfig(which) {
    return defineConfig({
        input: `source/demos/${which}.ts`,
        output: {
            file: `demos/${which}/${which}.js`,
            format: 'esm',
            assetFileNames: 'assets/[name].[ext]',
            generatedCode: {
                preset: 'es2015',
                symbols: false
            },
            freeze: false,
            sourcemap: true
        },
        plugins: [
            nodeExternals(),
            nodeResolve(),
            commonjs(),
            typescript({
                rootDir: `source/demos`,
                outDir: `demos/${which}`,
                declaration: false,
                declarationMap: false
            }),
            koffi()
        ]
    })
}
