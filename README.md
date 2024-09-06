# libwin32 (work in progress)
> Node bindings to native Win32 DLLs through [Koffi](https://koffi.dev).

### In a nutshell:
* Very simple and intuitive API (see [demo](./source//demos/window.ts)).
* Bundler friendly, designed with tree-shakeability in mind.
* Opinionated:
    * Only targets **win32-x64** platforms (*ARM-64 may be added later, no warranty though*).
    * Only exposes **Unicode** functions and data structures (those whose name ends in `W` in the Win32 API).
* Very easy to extend with additional functions, data structures and constants. I will add some myself time permitting; any help would be *mucho* appreciated.
* Not yet published to the npm registry. Will do when the library is large enough. Meanwhile, either clone this repo or run `nmp install septh/libwin32`.


### Directories
* `./source/demos`:
    * Some usage examples. (*only one at the time, more to come later*)
* `./source/rollup`:
    * A [Rollup](https://rollup.org) plugin to ease the process of building this library with your code. This targets the *consumers* of the library, not the library itself. (*more info to come*).
* `./source/stubs`:
    * Koffi loading & bundling stub.
* `./source/win32`:
    * The main bindings source files.


### How to...
* Build:
    * Use TypeScript (version 5.2+ required).
    * Run `npm run build` at the repo's root.
    * The output goes to `/dist`.
* See the demo:
    * Build, then run `node dist/demos/window.js`.
