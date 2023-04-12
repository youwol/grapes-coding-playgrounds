import { BehaviorSubject } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'
import { HeaderView } from './editor-header.view'

import grapesjs from 'grapesjs'
import { AppState } from '../utils'

const codeMirrorBaseConfiguration = {
    lineNumbers: true,
    theme: 'blackboard',
    lineWrapping: false,
    indentUnit: 4,
}

export function editCode(
    srcAttName,
    appState: AppState,
    editor: grapesjs.Editor,
    mode: string,
    requirements,
) {
    const component = editor.getSelected()
    if (!component.getAttributes().src) {
        component.addAttributes({ src: '# Title' })
    }
    const src$ = new BehaviorSubject<string>(
        component.getAttributes()[srcAttName],
    )
    appState.editCode({
        headerView: (editorState) => {
            const headerView = new HeaderView({ state: editorState })
            headerView.run$.pipe(withLatestFrom(src$)).subscribe(([_, src]) => {
                component && component.addAttributes({ [srcAttName]: src })
            })
            return headerView
        },
        content$: src$,
        configuration: { ...codeMirrorBaseConfiguration, mode },
        requirements,
    })
}
