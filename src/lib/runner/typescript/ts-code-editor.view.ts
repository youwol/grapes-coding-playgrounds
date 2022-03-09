import { CodeEditorView } from '../common'
import * as ts from 'typescript'
import { BehaviorSubject } from 'rxjs'
import { createDefaultMapFromCDN } from './cdn_utils'
import CodeMirror from 'codemirror'
import { getHighlights } from './diagnostics.view'
import { filter, take, withLatestFrom } from 'rxjs/operators'

export const compilerOptions = {
    target: ts.ScriptTarget.ES2020,
}

export class TsCodeEditorView extends CodeEditorView {
    public readonly fsMap$ = new BehaviorSubject(undefined)

    constructor(params: { src: string }) {
        super({
            src$: new BehaviorSubject<string>(params.src),
            language: 'text/typescript',
            config: {
                lineNumbers: true,
                theme: 'blackboard',
                lineWrapping: false,
                gutters: ['CodeMirror-lint-markers'],
                indentUnit: 4,
                lint: {
                    options: {
                        editorKind: 'TsCodeEditorView',
                        esversion: 2021,
                    },
                },
            },
        })
        createDefaultMapFromCDN(
            { target: ts.ScriptTarget.ES2020 },
            '4.6.2',
        ).then((fsMap) => {
            this.fsMap$.next(fsMap)
        })
        this.fsMap$
            .pipe(
                filter((d) => d),
                withLatestFrom(this.nativeEditor$),
                take(1),
            )
            .subscribe(([_, native]) => {
                native.setValue(native.getValue())
            })

        CodeMirror.registerHelper('lint', 'javascript', (text, options) => {
            if (options.editorKind != 'TsCodeEditorView') {
                return []
            }
            let fsMapBase = this.fsMap$.getValue()
            if (!fsMapBase) return
            const highlights = getHighlights(fsMapBase, text)
            return highlights.map((highlight) => ({
                ...highlight,
                message: highlight.messageText,
            }))
        })
    }
}
