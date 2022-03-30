import * as grapesjs from 'grapesjs'
import { AppState, Component } from './utils'
import { renderJavaScript } from './runner/javascript/renderer'
import { JsPlaygroundBlockName, JsPlaygroundComponentName } from './constants'

const defaultExeSrc = `
return async ({debug}) => {
    
    const jsObject = { 
        title: 'hello js playground!'
    }
    debug('jsObject', jsObject)
    
    const div = document.createElement('div')
    div.innerText = "I'm an html div"
    div.classList.add('fv-text-focus', 'text-center', 'p-1', 'border', 'rounded')
    debug('htmlElement', div)
    
    return true
}
`
const defaultTestSrc = `
return async (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}`
export class JsPlaygroundComponent extends Component {
    constructor(params: {
        appState: AppState
        grapesEditor: grapesjs.Editor
        idFactory: (string) => string
    }) {
        super({
            appState: params.appState,
            componentType: JsPlaygroundComponentName,
            language: 'javascript',
            grapesEditor: params.grapesEditor,
            canvasRendering: renderJavaScript,
            defaultExeSrc: defaultExeSrc,
            defaultTestSrc: defaultTestSrc,
            codeEditorRequirements: {
                scripts: [
                    'codemirror#5.52.0~mode/javascript.min.js',
                    'codemirror#5.52.0~mode/css.min.js',
                    'codemirror#5.52.0~mode/xml.min.js',
                    'codemirror#5.52.0~mode/htmlmixed.min.js',
                ],
                css: [],
            },
            idFactory: params.idFactory,
        })
    }
}

export class JsPlaygroundBlock {
    public readonly blockType: string
    public readonly label = 'Javascript Playground'
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
        this.blockType = this.idFactory(JsPlaygroundBlockName)
        this.content = {
            type: this.idFactory(JsPlaygroundComponentName),
        }
    }
}
