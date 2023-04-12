import grapesjs from 'grapesjs'

import { editCode } from './editor'
import { setup } from '../auto-generated'

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

export class Component {
    public readonly appState: AppState
    public readonly grapesEditor: grapesjs.Editor
    public readonly language: string
    public readonly defaultExeSrc: string
    public readonly defaultTestSrc: string
    public readonly canvasRendering: () => void
    public readonly codeEditorRequirements
    public readonly idFactory: (name: string) => string

    public readonly componentType: string

    public readonly extendFn = ['initialize']
    public readonly isComponent = (el: HTMLElement) => {
        return (
            el.getAttribute &&
            el.getAttribute('componentType') == this.componentType
        )
    }
    public readonly model
    public readonly view

    constructor(params: {
        appState: AppState
        componentType: string
        language: string
        grapesEditor: grapesjs.Editor
        defaultExeSrc: string
        defaultTestSrc: string
        canvasRendering: () => void
        codeEditorRequirements
        idFactory: (name: string) => string
    }) {
        Object.assign(this, params)
        this.componentType = this.idFactory(this.componentType)

        this.model = this.getModel()
    }

    getModel() {
        return {
            defaults: {
                script: this.canvasRendering,
                style: {
                    'max-height': '100%',
                    height: '500px',
                },
                styles: '.CodeMirror {height: 100% !important;}',
                droppable: false,
                attributes: {
                    componentType: this.componentType,
                    src: this.defaultExeSrc,
                    'src-test': this.defaultTestSrc,
                    apiVersion: setup.apiVersion,
                },
                traits: [
                    editSrcTrait({
                        appState: this.appState,
                        attributeName: 'src',
                        src: this.defaultExeSrc,
                        language: this.language,
                        grapesEditor: this.grapesEditor,
                        requirements: this.codeEditorRequirements,
                    }),
                    editSrcTrait({
                        appState: this.appState,
                        attributeName: 'src-test',
                        src: this.defaultTestSrc,
                        language: this.language,
                        grapesEditor: this.grapesEditor,
                        requirements: this.codeEditorRequirements,
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
                this.on(`change:attributes:src`, () => {
                    this.view.render()
                })
                this.on(`change:attributes:src-test`, () => {
                    this.view.render()
                })
                this.on(`change:attributes:default-mode`, () => {
                    this.view.render()
                })
            },
        }
    }
}

export interface AppState {
    editCode({ headerView, content$, configuration, requirements })
}
