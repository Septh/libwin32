import { regex } from 'regex'
import MagicString from 'magic-string'
import type { Plugin } from 'rollup'

/**
 * A plugin that rewrites TypeScript's emitted enums into a tree-shakeable
 * form -- the same as esbuid.
 *
 * For example, consider this TypeScript code:
 * ````ts
 * export enum X { a, b=10, c }
 * ````
 *
 * This is what tsc emits:
 * ````ts
 * export var X;
 * (function (X) {
 *   X[X["a"] = 0] = "a";
 *   X[X["b"] = 10] = "b";
 *   X[X["c"] = 11] = "c";
 * })(X || (X = {}));
 * ````
 *
 * And this is how this plugin transforms the above:
 * ````ts
 * export var X = ((X) => {
 *   X[X["a"] = 0] = "a";
 *   X[X["b"] = 10] = "b";
 *   X[X["c"] = 11] = "c";
 *   return X;
 * })(X || {});
 * ````
 */
export function enums(): Plugin {

    // https://regex101.com/r/1nyPC3/5
    const enumRx = regex('gsd')`
      (?<intro>
        \b(?<export>export\s+)?var\s+(?<name>[^;\s]+);?\s*  # export var XX;
        \(function\s*\(\k<name>\)\s*\{                      # (function (XX) {
      )
      (?<body>.*)
      (?<outro>
        \}\)\(\k<name>\s*\|\|\s*\(\k<name>\s*=\s\{\}\)\);?  # })(XX || XX={});
      )
    `
    let match: RegExpMatchArray | null

    return {
        name: 'libwin32-tree-shakeable-enums',

        transform(code, id) {
            const ms = new MagicString(code)
            const indent = ms.getIndentString()

            enumRx.lastIndex = 0
            while (match = enumRx.exec(code)) {
                const export_ = match.groups!.export ?? ''
                const varName = match.groups!.name
                const indices = match.indices!.groups!

                ms.update(indices.intro[0], indices.intro[1], `${export_}var ${varName} = /*#__PURE__*/ ((${varName}) => {`)
                ms.update(indices.outro[0], indices.outro[1], `${indent}return ${varName};\n})(${varName} || {});`)
            }

            return ms.hasChanged()
                ? { code: ms.toString(), map: ms.generateMap() }
                : null
        }
    }
}
