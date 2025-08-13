import koffi from 'koffi-cream'
import { Win32Dll } from '../private.js'
import { cWNDPROC, type WNDPROC } from '../structs.js'

export const user32 = /*#__PURE__*/new Win32Dll('user32.dll')

const registeredWindows = /*#__PURE__*/new Map<string, koffi.IKoffiRegisteredCallback>()

export function registerCallback(className: string, wndProc: WNDPROC): koffi.IKoffiRegisteredCallback {
    const cb = koffi.register(wndProc, cWNDPROC)
    registeredWindows.set(className, cb)
    return cb
}

export function unregisterCallback(name: string) {
    const cb = registeredWindows.get(name)
    if (cb) {
        koffi.unregister(cb)
        registeredWindows.delete(name)
    }
}
