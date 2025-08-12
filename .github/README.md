# libwin32 (work in progress)
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

![screenshot](../docs/snapshot.png)


### In a nutshell:
* Very simple and intuitive API (see [demos](../source/demos/)), with TypeScript definitions included.
* Opinionated:
    * Only targets **64-bit** platforms (*Intel/AMD for now, ARM may be added later, no warranty though*).
    * Only exposes **Unicode** functions and data structures (those whose name ends in `W` in the Win32 API).
* Bundler friendly, designed with tree-shakeability in mind.
* Very easy to extend with additional functions, data structures and constants. I will add some myself time permitting; any help would be *mucho* appreciated. **If you can't or won't submit a PR yourself, just head to [#8](https://github.com/Septh/libwin32/issues/8) and kindly ask :)**.


### How to...

#### > Use the lib in your code
1. Install the lib in your project: `npm install libwin32`
1. Import the functions and types you need. You may either import from `libwin32` or from `libwin32/<dllname>` (without the `.dll` extension) if you know which dll a function belongs to. For example, `import { MessageBox } from 'libwin32'` and `import { MessageBox } from 'libwin32/user32'` would both work.
1. (optional) Import some complementary constants: they greatly simplify calls to the Win32 API.
    * All constants are available via the `libwin32/consts` import.
    * Logically grouped constants are exported as `enum`s, where the prefix is the name of the enum. For instance, `WM_DESTROY` and `WM_KEYDOWN` are members of the `WM_` enum and can be accessed as `WM_.DESTROY` and `WM_.KEYDOWN`, respectively.
1. Call the functions as instructed by the [Win32 API documentation](https://learn.microsoft.com/en-us/windows/win32/api/).
    * All functions, constants and types are named accordingly and the lib is fully typed so you may rely on code hints from your editor.
        * There are cases though where it made sense to adapt the C prototype to something more JS-friendly. For instance, in C, `GetWindowText()` fills in a buffer whose address is passed as the second parameter to the function; in JS/TS, the function takes only one parameter and returns a string.
    * Many Win32 C structures have a size member (often named `cbSize`) that must be set before they are used as a parameter. For these, the lib provide a JS class that automatically sets that field when instantiated. See `WNDCLASSEX` for an example.


#### > Bundle the lib with your code
The Win32 API has thousands of functions, structures and constants. While providing bindings for all of them is *not* a goal, the lib may eventually grow to something very, very big.

To accommodate this, `libwin32` is "tree-shakeable by design": when bundled, only the functions, constants and structures you use end up in the bundle. This feature relies on [Rollup's awesome tree-shaking capabilities](https://rollupjs.org/introduction/#tree-shaking).

See [rollup.demos.js](../rollup.demos.js) to see how it's done, and build the demos (see below) to see the resulting code in the `/demos` directory.


#### > Build the lib

````shell
$ git clone https://github.com/Septh/libwin32.git
$ cd libwin32
$ npm install
$ npm run build
````

The output goes to `/lib`.


#### > Run the demos
Build the lib, then:

* Without bundling:
````shell
$ node lib/demos/<demoname>.js
````

* With bundling:
````shell
$ npm run build:demos
$ node demos/<demoname>.js
````


### Changelog
See [releases](https://github.com/Septh/libwin32/releases) on Github.


### Bindings so far
*All functions come with their associated types and constants.*

| Function name             | Win32 DLL | Since |
|---------------------------|-----------|-------|
| AdjustTokenPrivileges     | advapi32  | 0.8.3 |
| AdjustWindowRect          | user32    | 0.3.0 |
| AdjustWindowRectEx        | user32    | 0.3.0 |
| AdjustWindowRectExForDpi  | user32    | 0.7.0 |
| AllocateAndInitializeSid  | advapi32  | 0.7.0 |
| AnimateWindow             | user32    | 0.3.0 |
| AppendMenu                | user32    | 0.4.0 |
| Beep                      | kernel32  | 0.6.0 |
| BringWindowToTop          | user32    | 0.3.0 |
| BroadcastSystemMessage    | user32    | 0.3.0 |
| BroadcastSystemMessageEx  | user32    | 0.3.0 |
| CallWindowProc            | user32    | 0.3.0 |
| CheckMenuItem             | user32    | 0.4.0 |
| CheckTokenMembership      | advapi32  | 0.9.0 |
| CloseHandle               | kernel32  | 0.5.0 |
| CoInitializeEx            | ole32     | 0.9.0 |
| ConvertSidToStringSid     | advapi32  | 0.8.0 |
| ConvertStringSidToSid     | advapi32  | 0.8.0 |
| CreatePopupMenu           | user32    | 0.4.0 |
| CreateWindow              | user32    | 0.1.0 |
| CreateWindowEx            | user32    | 0.1.0 |
| DefWindowProc             | user32    | 0.1.0 |
| DestroyCursor             | user32    | 0.1.0 |
| DestroyIcon               | user32    | 0.1.0 |
| DestroyMenu               | user32    | 0.4.0 |
| DispatchMessage           | user32    | 0.1.0 |
| EnumWindows               | user32    | 0.3.0 |
| EnumDesktopWindows        | user32    | 0.8.2 |
| EqualSid                  | advapi32  | 0.7.0 |
| ExpandEnvironmentStrings  | kernel32  | 0.8.0 |
| FileTimeToSystemTime      | kernel32  | 0.8.0 |
| FindWindow                | user32    | 0.3.0 |
| FindWindowEx              | user32    | 0.3.0 |
| FormatMessage             | kernel32  | 0.5.0 |
| FreeSid                   | advapi32  | 0.7.0 |
| GetAncestor               | user32    | 0.3.0 |
| GetClassInfo              | user32    | 0.3.0 |
| GetClassInfoEx            | user32    | 0.3.0 |
| GetClassName              | user32    | 0.3.0 |
| GetComputerName           | kernel32  | 0.6.0 |
| GetCurrentProcess         | kernel32  | 0.5.0 |
| GetCurrentProcessId       | kernel32  | 0.8.3 |
| GetCursorPos              | user32    | 0.4.0 |
| GetDesktopWindow          | user32    | 0.7.0 |
| GetExitCodeProcess        | kernel32  | 0.9.0 |
| GetHandleInformation      | kernel32  | 0.8.3 |
| GetLastError              | kernel32  | 0.1.0 |
| GetMessage                | user32    | 0.1.0 |
| GetModuleFileName         | kernel32  | 0.6.0 |
| GetModuleHandle           | kernel32  | 0.1.0 |
| GetModuleHandleEx         | kernel32  | 0.5.0 |
| GetProcessMemoryInfo      | kernel32  | 0.8.3 |
| GetSystemRegistryQuota    | kernel32  | 0.8.0 |
| GetTokenInformation       | advapi32  | 0.6.0 |
| GetUserName               | advapi32  | 0.6.0 |
| GetUserNameEx             | secur32   | 0.6.0 |
| GetWindowText             | user32    | 0.3.0 |
| GetWindowThreadProcessId  | kernel32  | 0.5.0 |
| LoadCursor                | user32    | 0.1.0 |
| LoadIcon                  | user32    | 0.1.0 |
| LoadImage                 | user32    | 0.1.0 |
| LookupAccountSid          | advapi32  | 0.6.0 |
| LookupAccountSidLocal     | advapi32  | 0.8.1 |
| LookupAccountName         | advapi32  | 0.8.1 |
| LookupPrivilegeName       | advapi32  | 0.8.1 |
| LookupPrivilegeValue      | advapi32  | 0.8.1 |
| LsaClose                  | advapi32  | 0.6.0 |
| LsaNtStatusToWinError     | advapi32  | 0.6.0 |
| LsaOpenPolicy             | advapi32  | 0.6.0 |
| MessageBox                | user32    | 0.1.0 |
| MessageBoxEx              | user32    | 0.7.0 |
| OpenProcess               | kernel32  | 0.5.0 |
| OpenProcessToken          | advapi32  | 0.6.0 |
| PostQuitMessage           | user32    | 0.1.0 |
| PrivilegeCheck            | advapi32  | 0.8.3 |
| QueryFullProcessImageName | kernel32  | 0.5.0 |
| RegCloseKey               | advapi32  | 0.8.0 |
| RegConnectRegistry        | advapi32  | 0.8.0 |
| RegCopyTree               | advapi32  | 0.8.1 |
| RegCreateKeyEx            | advapi32  | 0.8.0 |
| RegDeleteKeyEx            | advapi32  | 0.8.0 |
| RegDeleteKeyValue         | advapi32  | 0.8.0 |
| RegDeleteTree             | advapi32  | 0.8.0 |
| RegDeleteValue            | advapi32  | 0.8.0 |
| RegEnumKeyEx              | advapi32  | 0.8.0 |
| RegFlushKey               | advapi32  | 0.8.0 |
| RegGetValue               | advapi32  | 0.8.0 |
| RegisterClass             | user32    | 0.1.0 |
| RegisterClassEx           | user32    | 0.1.0 |
| RegLoadAppKey             | advapi32  | 0.8.0 |
| RegLoadKey                | advapi32  | 0.8.0 |
| RegOpenKeyEx              | advapi32  | 0.8.0 |
| RegSaveKey                | advapi32  | 0.8.0 |
| RegSaveKeyEx              | advapi32  | 0.8.0 |
| RegSetKeyValue            | advapi32  | 0.8.0 |
| RegSetValueEx             | advapi32  | 0.8.0 |
| RegUnLoadKey              | advapi32  | 0.8.0 |
| SendMessage               | user32    | 0.4.0 |
| SetForegroundWindow       | user32    | 0.4.0 |
| SetLastError              | kernel32  | 0.5.0 |
| Shell_NotifyIcon          | shell32   | 0.4.0 |
| ShellExecuteEx            | shell32   | 0.9.0 |
| ShowWindow                | user32    | 0.1.0 |
| ShowWindowAsync           | user32    | 0.1.0 |
| TrackPopupMenu            | user32    | 0.4.0 |
| TranslateMessageEx        | user32    | 0.1.0 |
| UnregisterClass           | user32    | 0.1.0 |
| UpdateWindow              | user32    | 0.1.0 |
| WaitForSingleObject       | user32    | 0.9.0 |

Many thanks to [@MomoRazor](https://github.com/MomoRazor) for the impressive work on [53e99ef](https://github.com/Septh/libwin32/commit/53e99ef3ef63298e3b84ec1835acdbf61810296e)!

Many thanks to [@shrirajh](https://github.com/shrirajh) for the impressive work on [b2bf65b](https://github.com/Septh/libwin32/commit/b2bf65b6d20dbe7dae4e48341176a8407c135c46)!


### Repository structure
* `./source/win32`:
    * The main bindings source files.
* `./source/demos`:
    * Some usage examples.
* `./source/rollup`:
    * [Rollup](https://rollup.org) plugins to ease the process of bundling this library with your own code and to boost its tree-shakeability. See [rollup.demos.js](../rollup.demos.js) to see how to use.


### Related
* [koffi-cream](https://github.com/Septh/koffi-cream), a lighter repackaging of Koffi.


### License
MIT.
