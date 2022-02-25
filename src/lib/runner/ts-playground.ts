/**
 * https://discuss.codemirror.net/t/codemirror-6-and-typescript-lsp/3398/2
 * https://www.npmjs.com/package/@typescript/vfs
 */
import { render } from '@youwol/flux-view'
import { Displayable, PlaygroundView } from './common'
import { ModuleKind, transpileModule } from 'typescript'
import { runJavascriptCode } from './utils'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        startingSrc: element.getAttribute('src'),
        testSrc: element.getAttribute('src-test'),
        language: 'text/typescript',
        executor: (
            source: string,
            debug: (title: string, data: Displayable) => void,
        ) => {
            let result = transpileModule(source, {
                compilerOptions: { module: ModuleKind.CommonJS },
            })
            return runJavascriptCode(result.outputText, debug)
        },
    })

    element.appendChild(render(vDOM))
}
