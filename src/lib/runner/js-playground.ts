import { render } from '@youwol/flux-view'
import { PlaygroundView } from './common'
import { InterpretError } from './common/errors.view'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        startingSrc: element.getAttribute('src'),
        testSrc: element.getAttribute('src-test'),
        language: 'javascript',
        executor: (src: string, debug) => {
            try {
                return new Function(src)()({ ...window, debug })
            } catch (e) {
                return new InterpretError({
                    exception: e,
                    view: {
                        innerText: e,
                    },
                })
            }
        },
    })
    element.appendChild(render(vDOM))
}
