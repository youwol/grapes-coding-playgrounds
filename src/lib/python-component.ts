import * as grapesjs from 'grapesjs'
import { AppState, Component } from './utils'

import { renderPython } from './runner/python/renderer'
import {
    PythonPlaygroundBlockName,
    PythonPlaygroundComponentName,
} from './constants'

const defaultExeSrc = `
import sys

class PythonObject:
    def __init__(self, title, value):
        self.title = title
        self.value = value
    
def processing(debug):    

    obj = PythonObject("hello", 5)
    print(obj)
    debug("pythonObject", obj.__dict__)
    return True
    
processing
`

const defaultTestSrc = `
def test(result, expect) => {
    expect("A dummy passing test", true)
    return true
}
test
`

export class PythonPlaygroundComponent extends Component {
    constructor(params: {
        appState: AppState
        grapesEditor: grapesjs.Editor
        idFactory: (string) => string
    }) {
        super({
            appState: params.appState,
            componentType: PythonPlaygroundComponentName,
            language: 'python',
            grapesEditor: params.grapesEditor,
            canvasRendering: renderPython,
            defaultExeSrc: defaultExeSrc,
            defaultTestSrc: defaultTestSrc,
            codeEditorRequirements: {
                scripts: ['codemirror#5.52.0~mode/python.min.js'],
                css: [],
            },
            idFactory: params.idFactory,
        })
        const packages = ['numpy', 'pandas', 'scikit-learn']
        packages.forEach((name) => {
            this.model.defaults.traits.push({
                type: 'checkbox',
                name,
                label: name,
                value: false,
            })
        })
        this.model.initialize = function () {
            packages.forEach((name) => {
                this.on(`change:attributes:${name}`, () => {
                    this.view.render()
                })
            })
            this.on(`change:attributes:default-mode`, () => {
                this.view.render()
            })
        }
    }
}

export class PythonPlaygroundBlock {
    public readonly blockType: string
    public readonly label = 'Python Playground'
    public readonly content
    public readonly appState: AppState
    public readonly grapesEditor: grapesjs.Editor
    public readonly idFactory: (name: string) => string
    public readonly render = ({ el }: { el: HTMLElement }) => {
        el.classList.add('gjs-fonts', 'gjs-f-b2')
    }

    constructor(params: {
        appState: AppState
        grapesEditor: grapesjs.Editor
        idFactory: (name: string) => string
    }) {
        Object.assign(this, params)
        this.blockType = this.idFactory(PythonPlaygroundBlockName)
        this.content = {
            type: this.idFactory(PythonPlaygroundComponentName),
        }
    }
}
