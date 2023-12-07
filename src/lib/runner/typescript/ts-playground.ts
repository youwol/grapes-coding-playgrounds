/**
 * https://www.npmjs.com/package/@typescript/vfs
 * https://www.typescriptlang.org/dev/sandbox/
 */
import { render } from '@youwol/rx-vdom'
import { Displayable, PlaygroundView, SplitMode } from '../common'
import { runJavascriptCode } from '../utils'
import * as ts from 'typescript'
import { TsCodeEditorView } from './ts-code-editor.view'

export function renderElement(element: HTMLElement) {
    const vDOM = new PlaygroundView({
        splitMode:
            (element.getAttribute('default-mode') as SplitMode) || 'split',
        testSrc: element.getAttribute('src-test'),
        codeEditorView: new TsCodeEditorView({
            src: element.getAttribute('src'),
        }),
        executor: (
            source: string,
            debug: (title: string, data: Displayable) => void,
        ) => {
            const compilerOpts = {
                module: ts.ModuleKind.CommonJS,
                reportDiagnostics: true,
            }
            const result = ts.transpileModule(source, compilerOpts)
            return runJavascriptCode(result.outputText, debug)
        },
    })
    element.appendChild(render(vDOM))
}
