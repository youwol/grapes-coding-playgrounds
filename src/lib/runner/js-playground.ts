import { render } from '@youwol/flux-view'
import { PlaygroundView } from './common'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        startingSrc: element.getAttribute('src'),
        testSrc: element.getAttribute('src-test'),
        language: 'javascript',
        transpiler: (src: string) => src,
    })
    element.appendChild(render(vDOM))
}
