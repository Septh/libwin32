# libwin32
> Node bindings to native Win32 DLLs through [Koffi](https://koffi.dev).

````js
import { MessageBox } from 'libwin32'
import { MB_ } from 'libwin32/consts'

const result = MessageBox(
    null,
    "Hello, world!",
    "libwin32",
    MB_.ICONINFORMATION | MB_.YESNO
)
````

![screenshot](docs/snapshot.png)


### In a nutshell:
* Very simple and intuitive API (see [demos](./source/demos/)), with TypeScript definitions included.
* Bundler friendly, designed with tree-shakeability in mind.
* Opinionated:
    * Only targets **64-bit** platforms (*Intel/AMD for now, ARM may be added later, no warranty though*).
    * Only exposes **Unicode** functions and data structures (those whose name ends in `W` in the Win32 API).
* Very easy to extend with additional functions, data structures and constants. I will add some myself time permitting; any help would be *mucho* appreciated.

See [the repo on Github](https://github.com/Septh/libwin32#readme) for full documentation.

### License
MIT.
