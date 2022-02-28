import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'
import { renderTypeScript } from './runner/typescript/renderer'

const defaultExeSrc = `
return async ({debug}) => {
    
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

export function addTypescriptComponent(editor: grapesjs.Editor) {
    const componentType = 'typescript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            componentType,
            language: 'typescript',
            grapesEditor: editor,
            canvasRendering: renderTypeScript,
            defaultExeSrc: defaultExeSrc,
            defaultTestSrc: defaultTestSrc,
        }),
    )
}
