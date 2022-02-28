import * as grapesjs from 'grapesjs'

import { editCode } from './editor'

export function editSrcTrait({
    attributeName,
    src,
    language,
    grapesEditor,
}: {
    attributeName: string
    src: string
    language: string
    grapesEditor
}) {
    return {
        name: 'editSrc',
        label: `edit ${attributeName}`,
        type: 'button',
        text: 'Click me',
        full: true, // Full width button
        command: (editor) => {
            const component = editor.getSelected()
            if (!component.getAttributes()[attributeName]) {
                component.addAttributes({
                    [attributeName]: src,
                })
            }
            editCode(attributeName, grapesEditor, language)
        },
    }
}

export function isComponent(componentType: string) {
    return (el: HTMLElement) => {
        return (
            el.getAttribute && el.getAttribute('componentType') == componentType
        )
    }
}

export function baseAttributes(componentType, defaultExeSrc, defaultTestSrc) {
    return {
        componentType,
        src: defaultExeSrc,
        'src-test': defaultTestSrc,
    }
}

export function componentFactoryBase({
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
                ] as Record<string, unknown>[],
            },
            initialize() {
                /*no op for now*/
            },
        },
    }
}
