import * as grapesjs from 'grapesjs'
import { addPythonComponent } from './python-component'
import { addTypescriptComponent } from './typescript-component'
import { addJavascriptComponent } from './javascript-component'

export function addComponents(editor: grapesjs.Editor) {
    addJavascriptComponent(editor)
    addTypescriptComponent(editor)
    addPythonComponent(editor)
}
