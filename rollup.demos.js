/*
 * This config only bundles the demos and serves as an example
 * of how to bundle the lib with your code.
 *
 * The library itself is published unbundled (in the `dist` folder).
 */
import { defineConfig } from 'rollup'
import nodeExternals from 'rollup-plugin-node-externals'
import libwin32 from './dist/rollup/index.js'

/**
 * Workaround for the wrong typings in all rollup plugins.
 * @template T
 * @param {{ default: { default: T } }} module
 * @returns {T}
 * @see {@link https://github.com/rollup/plugins/issues/1541#issuecomment-1837153165}
 */
const rollupPlugin = ({ default: plugin }) => /** @type {T} */(plugin)
const commonJS = rollupPlugin(await import('@rollup/plugin-commonjs'))
const nodeResolve = rollupPlugin(await import('@rollup/plugin-node-resolve'))
const typescript = rollupPlugin(await import('@rollup/plugin-typescript'))

// Use distinct configs (one per demo) to prevent Rollup from code-splitting the library.
export default [
    makeConfig('messagebox'),
    makeConfig('enumdesktopwindows'),
    makeConfig('window'),
]

/** @param { string } demo */
function makeConfig(demo) {
    return defineConfig({
        input: `source/demos/${demo}.ts`,
        output: {
            file: `demos/${demo}/${demo}.js`,
            format: 'esm',
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
            commonJS(),
            typescript({
                tsconfig: './tsconfig.build.json',
                compilerOptions: {
                    outDir: `demos/${demo}`,
                    declaration: false,
                    declarationMap: false,
                    paths: {
                        libwin32: [ './source/index.ts' ],
                        'libwin32/kernel32': [ './source/win32/kernel32.ts' ],
                        'libwin32/user32': [ './source/win32/user32.ts' ],
                        'libwin32/consts': [ './source/win32/consts.ts' ],
                    }
                }
            }),
            libwin32()
        ]
    })
}
