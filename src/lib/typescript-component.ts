import * as grapesjs from 'grapesjs'
import { AppState, Component } from './utils'
import { renderTypeScript } from './runner/typescript/renderer'
import { TsPlaygroundBlockName, TsPlaygroundComponentName } from './constants'

const defaultExeSrc = `
return async ({debug}: {debug:(title:string,obj:unknown)=>void}) => {
    
    class TsObject{
    
        public readonly title: string
        public readonly value: number
        constructor(title: string, value: number){
            this.title = title
            this.value = value
        }
    }
    const obj = new TsObject("hello", 5)
    debug('tsObject', obj)
       
    return true
}
`
const defaultTestSrc = `
return async (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}`

export class TsPlaygroundComponent extends Component {
    constructor(params: {
        appState: AppState
        grapesEditor: grapesjs.Editor
        idFactory: (string) => string
    }) {
        super({
            appState: params.appState,
            componentType: TsPlaygroundComponentName,
            language: 'text/typescript',
            grapesEditor: params.grapesEditor,
            canvasRendering: renderTypeScript,
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

export class TsPlaygroundBlock {
    public readonly blockType: string
    public readonly label = 'Typescript Playground'
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
        this.blockType = this.idFactory(TsPlaygroundBlockName)
        this.content = {
            type: this.idFactory(TsPlaygroundComponentName),
        }
    }
}
