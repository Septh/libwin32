/*
 * This config only bundles the demos. The library itself is published unbundled.
 */
// @ts-check
import path from 'node:path'
import { defineConfig } from 'rollup'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { koffi } from 'libwin32/rollup-plugin'

// Use distinct configs to prevent Rollup from code-splitting the library.
export default [
    makeConfig('window'),
    makeConfig('messagebox'),
    makeConfig('enumdesktopwindows'),
]

/** @param { string } which */
function makeConfig(which) {
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
            sourcemap: true
        },
        plugins: [
            nodeExternals({ include: 'tslib' }),
            nodeResolve(),
            commonjs(),
            typescript({
                outDir,
                importHelpers: true,
                declaration: false,
                declarationMap: false,
                preserveConstEnums: false,
                target: 'es2023'
            }),
            koffi()
        ]
    })
}
