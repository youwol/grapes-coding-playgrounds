import {
    JsPlaygroundBlock,
    JsPlaygroundComponent,
} from './javascript-component'
import {
    PythonPlaygroundBlock,
    PythonPlaygroundComponent,
} from './python-component'
import {
    TsPlaygroundBlock,
    TsPlaygroundComponent,
} from './typescript-component'

export function getComponents() {
    return [
        JsPlaygroundComponent,
        PythonPlaygroundComponent,
        TsPlaygroundComponent,
    ]
}

export function getBlocks() {
    return [JsPlaygroundBlock, PythonPlaygroundBlock, TsPlaygroundBlock]
}
