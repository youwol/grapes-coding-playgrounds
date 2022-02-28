import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'
import { defaultExeSrcJs, defaultTestSrcJs } from './default-codes'
import { renderJavaScript } from './runner/javascript/renderer'

export function addJavascriptComponent(editor: grapesjs.Editor) {
    const componentType = 'javascript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            componentType,
            language: 'javascript',
            grapesEditor: editor,
            canvasRendering: renderJavaScript,
            defaultExeSrc: defaultExeSrcJs,
            defaultTestSrc: defaultTestSrcJs,
        }),
    )
}
