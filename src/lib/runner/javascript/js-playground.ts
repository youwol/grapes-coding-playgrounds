import { render } from '@youwol/rx-vdom'
import { CodeEditorView, PlaygroundView, SplitMode } from '../common'
import { InterpretError } from '../common/errors.view'
import { BehaviorSubject } from 'rxjs'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        splitMode:
            (element.getAttribute('default-mode') as SplitMode) || 'split',
        testSrc: element.getAttribute('src-test'),
        codeEditorView: new CodeEditorView({
            src$: new BehaviorSubject(element.getAttribute('src')),
            language: 'javascript',
        }),
        executor: (src: string, debug) => {
            try {
                return new Function(src)()({ ...window, debug })
            } catch (e) {
                return new InterpretError({
                    exception: e,
                    view: {
                        tag: 'div',
                        innerText: e,
                    },
                })
            }
        },
    })
    element.appendChild(render(vDOM))
}
