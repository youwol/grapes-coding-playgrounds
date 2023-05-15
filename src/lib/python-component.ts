import grapesjs from 'grapesjs'
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
return (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}
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
            withCodeTraits: [
                {
                    attributeName: 'requirements',
                    // at some point activate 'jsModules' & 'jsAliases' to import javascript modules in python
                    src: 'return () => ({ pyModules: [] })',
                    language: 'javascript',
                },
            ],
            language: 'python',
            grapesEditor: params.grapesEditor,
            canvasRendering: renderPython,
            defaultExeSrc: defaultExeSrc,
            defaultTestSrc: defaultTestSrc,
            codeEditorRequirements: {
                scripts: [
                    'codemirror#5.52.0~mode/javascript.min.js',
                    'codemirror#5.52.0~mode/python.min.js',
                ],
                css: [],
            },
            idFactory: params.idFactory,
        })
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
