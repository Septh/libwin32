import { KoffiFunction } from 'koffi-cream'

declare global {
    interface Function {
        native?: KoffiFunction
    }
}
