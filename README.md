# libwin32 (work in progress)
> Node bindings to native Win32 DLLs through [Koffi](https://koffi.dev).

### In a nutshell:
* Very simple and intuitive API (see [demos](./source//demos/)), with TypeScript definitions included.
* Bundler friendly, designed with tree-shakeability in mind.
* Opinionated:
    * Only targets **64-bit** platforms (*Intel/AMD for now, ARM may be added later, no warranty though*).
    * Only exposes **Unicode** functions and data structures (those whose name ends in `W` in the Win32 API).
* Very easy to extend with additional functions, data structures and constants. I will add some myself time permitting; any help would be *mucho* appreciated.


### How to...

#### > Use the lib in your code
1. Install the lib in your project: `npm install libwin32`
1. Import the functions and types you need. You may either import from `libwin32` or from `libwin32/<dllname>` (without the `.dll` extension) if you know which dll a function belongs to. For example, `import { MessageBox } from 'libwin32'` and `import { MessageBox } from 'libwin32/user2'` will both work.
1. (optional) Import some complementary constants. They greatly simplify calls to the Win32 API.
    * All constants are available via the `libwin32/consts` import.
    * Logically grouped constants are exported as `enum`s, where the prefix is the name of the enum. For instance, `WM_DESTROY` and `WM_KEYDOWN` are exported as `WM_.DESTROY` and `WM_.KEYDOWN`, respectively.
1. Call the functions as instructed by the [Win32 API documentation](https://learn.microsoft.com/en-us/windows/win32/api/). All functions, constants and types are named accordingly.

````js
import { MessageBox } from 'libwin32'
import { MB_ } from 'libwin32/consts'

const result = MessageBox(
    null,
    "Hello, world!",
    "libwin32",
    MB_.ICONINFORMATION | MB_.YESNO
)
console.dir(result)
````

![alt text](docs/snapshot.png)

#### > Build the lib

````shell
$ git clone https://github.com/Septh/libwin32.git
$ cd libwin32
$ npm install
$ npm run build
````

The output goes to `/dist`.

#### > Run the demos
Build the lib, then:

* Without bundling:
````shell
$ node dist/demos/messagebox.js
$ node dist/demos/enumdesktopwindows.js
$ node dist/demos/window.js
````

* With bundling:
````shell
$ npm run build:demos
$ node demos/messagebox/messagebox.js
$ node demos/enumdesktopwindows/enumdesktopwindows.js
$ node demos/window/window.js
````

### Changelog
See [releases](https://github.com/Septh/libwin32/releases) on Github.

### Bindings so far
*All functions come with their associated types and constants.*

#### Added in 0.3.0
* user32.dll
    * AdjustWindowRect
    * AdjustWindowRectEx
    * AnimateWindow
    * BringWindowToTop
    * BroadcastSystemMessage
    * BroadcastSystemMessageEx
    * CallWindowProc
    * EnumWindows
    * EnumDesktopWindows
    * FindWindow
    * FindWindowEx
    * GetAncestor
    * GetClassInfo
    * GetClassInfoEx
    * GetClassName
    * GetWindowText

#### Added in 0.2.0
None.

#### Since 0.1.0
* kernel32.dll
    * GetLastError
    * GetModuleHandle
* user32.dll
    * CreateWindow
    * CreateWindowEx
    * DefWindowProc
    * DestroyCursor
    * DestroyIcon
    * DispatchMessage
    * GetMessage
    * LoadCursor
    * LoadIcon
    * LoadImage
    * MessageBox
    * PostQuitMessage
    * RegisterClass
    * RegisterClassEx
    * ShowWindow
    * ShowWindowAsync
    * TranslateMessageEx
    * UnregisterClass
    * UpdateWindow

### Repository structure
* `./source/win32`:
    * The main bindings source files.
* `./source/demos`:
    * Some usage examples.
* `./source/rollup`:
    * Two [Rollup](https://rollup.org) plugins to ease the process of bundling this library with your own code and to boost its tree-shakeability. See [rollup.demos.js](./rollup.demos.js) for an example of usage.
