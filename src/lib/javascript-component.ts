import * as grapesjs from 'grapesjs'
import { AppState, componentFactoryBase } from './utils'
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

export function addJavascriptComponent(
    appState: AppState,
    editor: grapesjs.Editor,
) {
    const componentType = 'javascript-playground'
    editor.DomComponents.addType(
        componentType,
        componentFactoryBase({
            appState,
            componentType,
            language: 'javascript',
            grapesEditor: editor,
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
        }),
    )
}
