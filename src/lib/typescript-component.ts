import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'
import { defaultExeSrcTs, defaultTestSrcTs } from './default-codes'
import { renderTypeScript } from './runner/typescript/renderer'

export function addTypescriptComponent(editor: grapesjs.Editor) {
    const componentType = 'typescript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            componentType,
            language: 'typescript',
            grapesEditor: editor,
            canvasRendering: renderTypeScript,
            defaultExeSrc: defaultExeSrcTs,
            defaultTestSrc: defaultTestSrcTs,
        }),
    )
}
