/**
 * https://www.npmjs.com/package/@typescript/vfs
 * https://www.typescriptlang.org/dev/sandbox/
 */
import { Displayable, PlaygroundView, SplitMode } from '../common'
import { runJavascriptCode } from '../utils'
import * as ts from 'typescript'
import { TsCodeEditorView } from './ts-code-editor.view'

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
        codeEditorView: new TsCodeEditorView({ src }),
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
}
