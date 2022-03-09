import * as grapesjs from 'grapesjs'
import { addPythonComponent } from './python-component'
import { addTypescriptComponent } from './typescript-component'
import { addJavascriptComponent } from './javascript-component'
import { AppState } from './utils'

export function addComponents(state: AppState, editor: grapesjs.Editor) {
    addJavascriptComponent(state, editor)
    addTypescriptComponent(state, editor)
    addPythonComponent(state, editor)
}
