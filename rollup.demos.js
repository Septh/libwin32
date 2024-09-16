/*
 * This config only bundles the demos. The library itself is published unbundled.
 */
// @ts-check
import path from 'node:path'
import { defineConfig } from 'rollup'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { koffi } from './dist/rollup/plugin.js'

// Use distinct configs to prevent Rollup from code-splitting the library.
export default [
    makeConfig('messagebox'),
    makeConfig('enumdesktopwindows'),
    makeConfig('window'),
]

/** @param { string } which */
function makeConfig(which) {
    const outDir = path.join('demos', which)
    return defineConfig({
        input: path.join('dist', 'demos', `${which}.js`),
        output: {
            dir: outDir,
            format: 'esm',
            generatedCode: {
                preset: 'es2015',
                symbols: false
            },
            assetFileNames: 'assets/[name].[ext]',
            sourcemap: true
        },
        plugins: [
            nodeExternals({ include: 'tslib' }),
            nodeResolve(),
            commonjs(),
            koffi()
        ]
    })
}
