/*
 * This config only bundles the demos and serves as an example
 * of how to bundle the lib with your code.
 *
 * The library itself is published unbundled (in the `dist` folder).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'rollup'
import nodeExternals from 'rollup-plugin-node-externals'
import rake from 'rollup-plugin-code-raker'
import libwin32 from 'libwin32/rollup'

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
export default (
    fs.readdir('./source/demos').then(sources => sources.map(source => {
        const { name: demo } = path.parse(source)
        return defineConfig({
            input: `source/demos/${demo}.ts`,
            output: {
                file: `demos/${demo}/${demo}.js`,
                format: 'esm',
                generatedCode: 'es2015',
                freeze: false,
                sourcemap: false
            },
            plugins: [
                nodeExternals(),
                nodeResolve(),
                commonJS(),
                typescript({
                    tsconfig: './tsconfig.demos.json',
                    compilerOptions: {
                        outDir: `demos/${demo}`,
                    }
                }),
                libwin32(),
                rake()
            ]
        })
    }))
)
