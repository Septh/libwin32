/*
 * This config only bundles the demos (see the source/demos directory) and serves as an example
 * of how to bundle the lib with your code with maximum tree-shaking efficiency.
 *
 * The library itself is always published unbundled (in the `lib` folder).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'rollup'
import nodeExternals from 'rollup-plugin-node-externals'
import nodeResolve_ from '@rollup/plugin-node-resolve'
import commonJS_ from '@rollup/plugin-commonjs'
import codeRaker from 'rollup-plugin-code-raker'
import libwin32 from 'libwin32/rollup'

/**
 * Workaround for the wrong typings in all rollup plugins
 * (see https://github.com/rollup/plugins/issues/1541#issuecomment-1837153165)
 * @template T
 * @param {{ default: T }} plugin
 */
const fixRollupTypings = (plugin) => /** @type {T} */ (plugin)
const nodeResolve = fixRollupTypings(nodeResolve_)
const commonJS = fixRollupTypings(commonJS_)

/**
 * Builds a RollupOptions object for a single demo source file.
 * @param {string} demo
 */
function makeSingleConfig(demo) {
    const { name } = path.parse(demo)
    return defineConfig({
        input: `lib/demos/${name}.js`,
        output: {
            file: `demos/${name}/${name}.js`,
            format: 'esm',
            sourcemap: false
        },
        plugins: [
            // Standard Rollup plugins for Node.
            nodeExternals(),
            nodeResolve(),
            commonJS(),

            // This repo provides a plugin for a better tree-shakeability of the lib.
            // See `source/rollup` for info.
            libwin32(),

            // Optional:
            // rollup-plugin-code-raker removes all comments left into the final code
            // *after* tree-shaking took place (ie., it does not interfere with __PURE__
            // and __NO_SIDE_EFFECTS__ annotations).
            // See https://github.com/Septh/rollup-plugin-code-raker
            codeRaker({ comments: true, console: false, debugger: false })
        ]
    })
}

// Use distinct configs (one per demo) to prevent Rollup from code-splitting the library.
export default fs.readdir('./source/demos').then(demos => demos.map(makeSingleConfig))
