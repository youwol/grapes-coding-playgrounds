/**
 * https://discuss.codemirror.net/t/codemirror-6-and-typescript-lsp/3398/2
 */
import { render } from '@youwol/flux-view'
import { PlaygroundView } from './common'
import { ModuleKind, transpileModule } from 'typescript'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        startingSrc: element.getAttribute('src'),
        testSrc: element.getAttribute('src-test'),
        language: 'text/typescript',
        transpiler: (source: string) => {
            let result = transpileModule(source, {
                compilerOptions: { module: ModuleKind.CommonJS },
            })
            console.log(result)
            return result.outputText
        },
    })

    element.appendChild(render(vDOM))
}
