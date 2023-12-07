import { CodeEditorView, PlaygroundView, SplitMode } from '../common'
import { InterpretError } from '../common/errors.view'
import { BehaviorSubject } from 'rxjs'

export function renderElement({
    mode,
    src,
    srcTest,
}: {
    mode?: SplitMode
    src: string
    srcTest: string
}) {
    return new PlaygroundView({
        splitMode: mode || 'split',
        testSrc: srcTest,
        codeEditorView: new CodeEditorView({
            src$: new BehaviorSubject(src),
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
}
