import * as grapesjs from 'grapesjs'

import { editCode } from './editor'

export function editSrcTrait({
    appState,
    attributeName,
    src,
    language,
    grapesEditor,
    requirements,
}: {
    appState: AppState
    attributeName: string
    src: string
    language: string
    grapesEditor
    requirements
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
            editCode(
                attributeName,
                appState,
                grapesEditor,
                language,
                requirements,
            )
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
    appState,
    componentType,
    language,
    grapesEditor,
    canvasRendering,
    defaultExeSrc,
    defaultTestSrc,
    codeEditorRequirements,
}: {
    appState: AppState
    componentType: string
    language: string
    grapesEditor: grapesjs.Editor
    defaultExeSrc: string
    defaultTestSrc: string
    canvasRendering: () => void
    codeEditorRequirements
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
                        appState,
                        attributeName: 'src',
                        src: defaultExeSrc,
                        language,
                        grapesEditor,
                        requirements: codeEditorRequirements,
                    }),
                    editSrcTrait({
                        appState,
                        attributeName: 'src-test',
                        src: defaultTestSrc,
                        language,
                        grapesEditor,
                        requirements: codeEditorRequirements,
                    }),
                    {
                        type: 'select', // Type of the trait
                        label: 'Default mode', // The label you will see in Settings
                        name: 'default-mode', // The name of the attribute/property to use on component
                        options: [
                            { id: 'split', name: 'code & output' },
                            { id: 'code-only', name: 'code only' },
                            { id: 'output-only', name: 'output only' },
                        ],
                    },
                ] as Record<string, unknown>[],
            },
            initialize() {
                this.on(`change:attributes:default-mode`, () => {
                    this.view.render()
                })
            },
        },
    }
}

export interface AppState {
    editCode({ headerView, content$, configuration, requirements })
}
