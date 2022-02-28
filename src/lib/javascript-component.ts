import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'
import { renderJavaScript } from './runner/javascript/renderer'

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

export function addJavascriptComponent(editor: grapesjs.Editor) {
    const componentType = 'javascript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            componentType,
            language: 'javascript',
            grapesEditor: editor,
            canvasRendering: renderJavaScript,
            defaultExeSrc: defaultExeSrc,
            defaultTestSrc: defaultTestSrc,
        }),
    )
}
