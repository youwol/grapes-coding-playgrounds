import * as grapesjs from 'grapesjs'
import { AppState, componentFactoryBase } from './utils'
import { renderTypeScript } from './runner/typescript/renderer'

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

export function addTypescriptComponent(
    appState: AppState,
    editor: grapesjs.Editor,
) {
    const componentType = 'typescript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            appState,
            componentType,
            language: 'text/typescript',
            grapesEditor: editor,
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
        }),
    )
}
