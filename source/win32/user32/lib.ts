import koffi from 'koffi-cream'
import { cWNDPROC, type WNDPROC } from '../structs.js'

export const user32 = koffi.load('user32.dll')

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
