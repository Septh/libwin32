import { fileURLToPath } from 'node:url'
import MagicString from 'magic-string'
import type { Plugin } from 'rollup'

/**
 * A plugin that rewrites libwin32's enums into a tree-shakeable
 * form --the same as esbuid.
 *
 * TypeScript:
 * ````
 * export enum X { a, b=10, c }
 * ````
 *
 * tsc:
 * ````
 * export var X;
 * (function (X) {
 *   X[X["a"] = 0] = "a";
 *   X[X["b"] = 10] = "b";
 *   X[X["c"] = 11] = "c";
 * })(GA_ || (GA_ = {}));
 * ````
 *
 * this plugin:
 * ````
 * export var X=(X=>{       // Note: there is a #__PURE__ annotation that can't be shown here
 *   X[X["a"] = 0] = "a";
 *   X[X["b"] = 10] = "b";
 *   X[X["c"] = 11] = "c";
 *   return X;
 * })(X || {});
 * ````
 */
export function enums(): Plugin {

    const constsBase = fileURLToPath(import.meta.resolve('#consts-base'))

    // https://regex101.com/r/1nyPC3/3
    const enumRx = /\b(?<intro>export\s+var\s+(?<name>[^;\s]+);?\s*\(function\s*\(\k<name>\)\s*{).*(?<outro>}\)\(\k<name>\s*\|\|\s*\(\k<name>\s*=\s{}\)\);?)/gsmd

    return {
        name: 'libwin32-tree-skakeable-enums',

        transform(code, id) {
            if (!id.startsWith(constsBase))
                return

            let ms: MagicString | undefined
            let match: RegExpMatchArray | null
            enumRx.lastIndex = 0
            while (match = enumRx.exec(code)) {
                const varName = match.groups!.name
                const indices = match.indices!.groups

                ms ??= new MagicString(code)
                ms.update(indices!.intro[0], indices!.intro[1], `export var ${varName}=/*@__PURE__*/(${varName}=>{`)
                ms.update(indices!.outro[0], indices!.outro[1], `${ms.getIndentString()}return ${varName};\n})(${varName} || {});`)
            }

            if (ms) {
                if (match = /\/\/#\s*sourceMappingURL=(?:.*).map\s*$/d.exec(code))
                    ms.remove(match.indices![0][0], match.indices![0][1])
                return {
                    code: ms.toString(),
                    map: ms.generateMap()
                }
            }

            return null
        }
    }
}
