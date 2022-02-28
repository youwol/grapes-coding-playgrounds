import * as grapesjs from 'grapesjs'

import {
    defaultExeSrcJs,
    defaultExeSrcTs,
    defaultTestSrcJs,
    defaultTestSrcTs,
} from './default-codes'
import { renderJavaScript, renderTypeScript } from './renderers'
import { editSrcTrait, isComponent } from './utils'
import { addPythonComponent } from './python-component'

export function addComponents(editor: grapesjs.Editor) {
    editor.DomComponents.addType(
        'javascript-playground',
        componentFactory({
            componentType: 'javascript-playground',
            language: 'javascript',
            grapesEditor: editor,
            canvasRendering: renderJavaScript,
            defaultExeSrc: defaultExeSrcJs,
            defaultTestSrc: defaultTestSrcJs,
        }),
    )

    editor.DomComponents.addType(
        'typescript-playground',
        componentFactory({
            componentType: 'typescript-playground',
            language: 'typescript',
            grapesEditor: editor,
            canvasRendering: renderTypeScript,
            defaultExeSrc: defaultExeSrcTs,
            defaultTestSrc: defaultTestSrcTs,
        }),
    )

    addPythonComponent(editor)
}

export function componentFactory({
    componentType,
    language,
    grapesEditor,
    canvasRendering,
    defaultExeSrc,
    defaultTestSrc,
}: {
    componentType: string
    language: string
    grapesEditor: grapesjs.Editor
    defaultExeSrc: string
    defaultTestSrc: string
    canvasRendering: () => void
}) {
    return {
        extendFn: ['initialize'],
        isComponent: isComponent(componentType),
        model: {
            defaults: {
                script: canvasRendering,
                style: {
                    'max-height': '100%',
                    height: '500px',
                },
                styles: '.CodeMirror {height: 100% !important;}',
                droppable: false,
                attributes: {
                    componentType,
                    src: defaultExeSrc,
                    'src-test': defaultTestSrc,
                },
                traits: [
                    editSrcTrait({
                        attributeName: 'src',
                        src: defaultExeSrc,
                        language,
                        grapesEditor,
                    }),
                    editSrcTrait({
                        attributeName: 'src-test',
                        src: defaultTestSrc,
                        language,
                        grapesEditor,
                    }),
                ],
            },
            initialize() {
                /*no op for now*/
            },
        },
    }
}
