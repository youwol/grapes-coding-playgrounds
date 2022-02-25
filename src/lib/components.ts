import * as grapesjs from 'grapesjs'
import { editCode } from './editor'
import {
    defaultExeSrcJs,
    defaultExeSrcTs,
    defaultTestSrcJs,
    defaultTestSrcTs,
} from './default-codes'
import { renderJavaScript, renderTypeScript } from './renderers'

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
        isComponent: (el: HTMLElement) => {
            return (
                el.getAttribute &&
                el.getAttribute('componentType') == componentType
            )
        },
        model: {
            defaults: {
                script: canvasRendering,
                droppable: false,
                attributes: {
                    componentType,
                    src: defaultExeSrc,
                    'src-test': defaultTestSrc,
                },
                traits: [
                    {
                        name: 'editSrc',
                        label: 'edit source',
                        type: 'button',
                        text: 'Click me',
                        full: true, // Full width button
                        command: (editor) => {
                            const component = editor.getSelected()
                            if (!component.getAttributes().src) {
                                component.addAttributes({
                                    src: defaultExeSrc,
                                })
                            }
                            editCode('src', grapesEditor, language)
                        },
                    },
                    {
                        name: 'editTest',
                        label: 'edit test',
                        type: 'button',
                        text: 'Click me',
                        full: true, // Full width button
                        command: (editor) => {
                            const component = editor.getSelected()
                            if (!component.getAttributes()['src-test']) {
                                component.addAttributes({
                                    'src-test': defaultTestSrc,
                                })
                            }
                            editCode('src-test', grapesEditor, language)
                        },
                    },
                ],
            },
            initialize() {
                /*no op for now*/
            },
        },
    }
}
