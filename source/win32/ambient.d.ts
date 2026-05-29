import { KoffiFunc } from 'koffi'

declare global {
    interface Function {
        native?: KoffiFunc<(...args: any) => any>
    }
}
