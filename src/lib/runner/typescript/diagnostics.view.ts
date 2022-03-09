import { attr$, child$, children$, VirtualDOM } from '@youwol/flux-view'
import * as ts from 'typescript'
import {
    createSystem,
    createVirtualTypeScriptEnvironment,
    VirtualTypeScriptEnvironment,
} from '@typescript/vfs'
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs'
import { debounceTime, map, shareReplay } from 'rxjs/operators'
import CodeMirror from 'codemirror'
import { createDefaultMapFromCDN } from './cdn_utils'

export interface SrcPosition {
    line: number
    ch: number
}

export class SrcHighlight {
    public readonly messageText: string
    public readonly from: SrcPosition
    public readonly to: SrcPosition

    constructor(diagnostic: ts.Diagnostic) {
        this.messageText = diagnostic.messageText as string
        const from_location = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start,
        )
        this.from = { line: from_location.line, ch: from_location.character }
        const to_location = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start + diagnostic.length,
        )
        this.to = { line: to_location.line, ch: to_location.character }
    }
}

export function getHighlights(fsMap, src) {
    fsMap.set('index.ts', `async () => {${src}}`)
    const system = createSystem(fsMap)
    const env = createVirtualTypeScriptEnvironment(system, ['index.ts'], ts, {
        target: ts.ScriptTarget.ES2020,
    })
    return [
        ...env.languageService.getSyntacticDiagnostics('index.ts'),
        ...env.languageService.getSemanticDiagnostics('index.ts'),
    ].map((d) => new SrcHighlight(d))
}

export class DiagnosticsState {
    public readonly src$: Observable<string>
    public readonly cursor$: Observable<CodeMirror.Position>
    public readonly fileSystem$ = from(
        createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2015 }, '4.6.2'),
    ).pipe(shareReplay(1))

    public readonly env$: Observable<VirtualTypeScriptEnvironment>

    public readonly semantics$: Observable<ts.Diagnostic[]>
    public readonly all$: Observable<{
        semantics: ts.Diagnostic[]
        syntactics: ts.DiagnosticWithLocation[]
    }>
    public readonly syntactics$: Observable<ts.DiagnosticWithLocation[]>
    public readonly compiler$: Observable<ts.Diagnostic[]>

    public readonly highlights$: Observable<SrcHighlight[]>
    public readonly completions$: Observable<ts.CompletionEntry[]>

    constructor(params: {
        src$: Observable<string>
        cursor$: Observable<CodeMirror.Position>
    }) {
        Object.assign(this, params)

        this.env$ = combineLatest([
            this.src$.pipe(debounceTime(1000)),
            this.fileSystem$,
        ]).pipe(
            map(([src, fsMap]) => {
                fsMap.set('index.ts', `async () => {${src}}`)
                const system = createSystem(fsMap)
                return createVirtualTypeScriptEnvironment(
                    system,
                    ['index.ts'],
                    ts,
                    {
                        target: ts.ScriptTarget.ES2015,
                    },
                )
            }),
            shareReplay(1),
        )

        this.all$ = this.env$.pipe(
            map((env) => ({
                syntactics:
                    env.languageService.getSyntacticDiagnostics('index.ts'),
                semantics:
                    env.languageService.getSemanticDiagnostics('index.ts'),
            })),
        )

        this.semantics$ = this.all$.pipe(map(({ semantics }) => semantics))
        this.syntactics$ = this.all$.pipe(map(({ syntactics }) => syntactics))
        this.compiler$ = this.env$.pipe(
            map((env) => env.languageService.getCompilerOptionsDiagnostics()),
        )
        this.highlights$ = this.all$.pipe(
            map(({ semantics, syntactics }) => {
                return [...semantics, ...syntactics].map(
                    (d) => new SrcHighlight(d),
                )
            }),
        )
        this.completions$ = combineLatest([this.env$, this.cursor$]).pipe(
            map(([env, position]) => {
                const file = env.getSourceFile('index.ts')

                try {
                    const charPosition = file.getPositionOfLineAndCharacter(
                        position.line,
                        position.ch,
                    )
                    const completions =
                        env.languageService.getCompletionsAtPosition(
                            'index.ts',
                            charPosition,
                            undefined,
                        )
                    if (completions.isMemberCompletion) {
                        return completions.entries
                    }
                    return []
                } catch (e) {
                    console.info(e)
                    return []
                }
            }),
        )
    }
}

type DiagnosticType = 'semantic' | 'syntactic' | 'compiler'

export class DiagnosticsHeaderView implements VirtualDOM {
    public readonly class = 'd-flex align-items-center justify-content-center'
    public readonly types: DiagnosticType[]
    public readonly selectedType$: BehaviorSubject<DiagnosticType>
    public readonly children: VirtualDOM[]
    public readonly diagnostics$: Record<
        DiagnosticType,
        Observable<ts.Diagnostic[]>
    >

    constructor(params: {
        types: DiagnosticType[]
        selectedType$: BehaviorSubject<DiagnosticType>
        diagnostics$: Record<DiagnosticType, Observable<ts.Diagnostic[]>>
    }) {
        Object.assign(this, params)
        this.children = this.types.map((type) => {
            return {
                class: attr$(
                    this.selectedType$,
                    (selected): string =>
                        selected == type ? 'fv-text-focus' : '',
                    {
                        wrapper: (d) =>
                            `${d} p-2 fv-pointer my-1 mx-1 border-bottom d-flex align-items-center`,
                    },
                ),
                children: [
                    {
                        innerText: type,
                    },
                    {
                        innerText: attr$(
                            this.diagnostics$[type],
                            (diagnostics) => `(${diagnostics.length})`,
                        ),
                    },
                ],
                onclick: () => this.selectedType$.next(type),
            }
        })
    }
}

export class DiagnosticContentView implements VirtualDOM {
    public readonly class = 'flex-grow-1 w-100 overflow-auto'
    public readonly style = {
        minHeight: '0',
    }
    public readonly diagnostics$: Observable<ts.Diagnostic[]>
    public readonly children: any

    constructor(params: { diagnostics$: Observable<ts.Diagnostic[]> }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'h-100 w-100',
                children: children$(this.diagnostics$, (diagnostics) => {
                    return diagnostics.map(
                        (diagnostic) => new DiagnosticView({ diagnostic }),
                    )
                }),
            },
        ]
    }
}

export class DiagnosticView implements VirtualDOM {
    public readonly diagnostic: ts.Diagnostic
    public readonly children: VirtualDOM[]

    constructor(params: { diagnostic: ts.Diagnostic }) {
        Object.assign(this, params)
        this.children = [
            {
                innerText: this.diagnostic.messageText,
            },
        ]
    }
}

export class DiagnosticsView implements VirtualDOM {
    public readonly class = 'd-flex flex-column'
    public readonly state: DiagnosticsState
    public readonly children: VirtualDOM[]
    public readonly selectedType$ = new BehaviorSubject<DiagnosticType>(
        'semantic',
    )

    constructor(params: { state: DiagnosticsState }) {
        Object.assign(this, params)
        const diagnostics$: Record<
            DiagnosticType,
            Observable<ts.Diagnostic[]>
        > = {
            semantic: this.state.semantics$,
            syntactic: this.state.syntactics$,
            compiler: this.state.compiler$,
        }
        this.children = [
            new DiagnosticsHeaderView({
                selectedType$: this.selectedType$,
                types: ['semantic', 'syntactic', 'compiler'],
                diagnostics$,
            }),
            child$(
                this.selectedType$,
                (type) =>
                    new DiagnosticContentView({
                        diagnostics$: diagnostics$[type],
                    }),
            ),
        ]
    }
}
