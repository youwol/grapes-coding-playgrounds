import {
    BehaviorSubject,
    from,
    Observable,
    of,
    ReplaySubject,
    Subject,
} from 'rxjs'
import { attr$, child$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { CodeEditorView } from './code-editor.view'
import { Displayable, Log } from './utils.view'
import { TestView } from './test.view'
import { withLatestFrom } from 'rxjs/operators'
import { ErrorsView, InterpretError } from './errors.view'
import { JournalView } from './journal.view'

export type SplitMode = 'split' | 'code-only' | 'output-only'

export class SplitModeView implements VirtualDOM {
    public readonly splitMode$ = new BehaviorSubject<SplitMode>('split')
    public readonly class =
        'd-flex flex-column align-items-center justify-content-center pr-1 border-right'
    public readonly children: VirtualDOM[]

    constructor(params: { splitMode$: BehaviorSubject<SplitMode> }) {
        Object.assign(this, params)

        const iconView = (target: SplitMode) => {
            const classes: Record<SplitMode, string> = {
                split: 'fa-columns',
                'output-only': 'fa-eye',
                'code-only': 'fa-code',
            }
            const commonClasses = 'fas fv-pointer my-1'
            return {
                class: attr$(
                    this.splitMode$,
                    (mode): string => (mode == target ? 'fv-text-focus' : ''),
                    {
                        wrapper: (d) =>
                            `${d} ${commonClasses} ${classes[target]}`,
                    },
                ),
                onclick: () => this.splitMode$.next(target),
            }
        }
        this.children = [
            iconView('split'),
            iconView('code-only'),
            iconView('output-only'),
        ]
    }
}

export class PlaygroundView {
    public readonly appId: string
    public readonly class =
        'd-flex h-100 fv-text-primary fv-bg-background w-100 p-2'
    public readonly style = {
        maxHeight: '100%',
    }
    public readonly children: VirtualDOM[]

    public readonly testSrc: string
    public readonly language: string
    public readonly executor: Executor
    public readonly run$: BehaviorSubject<boolean>
    public readonly toDisplayable?: (obj: unknown) => Displayable
    public readonly mode$: BehaviorSubject<ModeConsole>
    public readonly splitMode$: BehaviorSubject<SplitMode>
    public readonly codeEditorView: CodeEditorView
    public readonly diagnosticsView?: (editor: CodeEditorView) => VirtualDOM

    constructor(params: {
        splitMode: SplitMode
        testSrc: string
        codeEditorView: CodeEditorView
        diagnosticsView?: (editor: CodeEditorView) => VirtualDOM
        executor: Executor
        toDisplayable?: (obj: unknown) => Displayable
    }) {
        Object.assign(this, params)
        this.splitMode$ = new BehaviorSubject<SplitMode>(params.splitMode)
        this.mode$ = new BehaviorSubject('journal')
        this.run$ = new BehaviorSubject(false)
        this.codeEditorView.run$.subscribe((d) => this.run$.next(d))
        this.children = [
            new SplitModeView({ splitMode$: this.splitMode$ }),
            child$(this.splitMode$, (mode) =>
                mode != 'output-only'
                    ? {
                          class: `h-100 d-flex flex-column ${
                              mode == 'split' ? 'w-50' : 'w-100'
                          }`,
                          children: [
                              {
                                  class: 'w-100 d-flex justify-content-center',
                                  children: [
                                      {
                                          tag: 'i',
                                          class: 'fv-pointer rounded m-1 fas fa-play fv-hover-text-focus',
                                          onclick: () => this.run$.next(true),
                                      },
                                  ],
                              },
                              {
                                  class: 'flex-grow-1',
                                  style: { minHeight: '0px' },
                                  children: [this.codeEditorView],
                              },
                          ],
                      }
                    : {},
            ),
            child$(
                this.run$.pipe(withLatestFrom(this.codeEditorView.src$)),
                ([_, src]) =>
                    new ConsoleView({
                        src,
                        splitMode$: this.splitMode$,
                        mode$: this.mode$,
                        testSrc: this.testSrc,
                        executor: this.executor,
                        toDisplayable: this.toDisplayable,
                        diagnosticsView: this.diagnosticsView,
                        codeEditorView: this.codeEditorView,
                    }),
            ),
        ]
    }
}

type ModeConsole = 'journal' | 'test' | 'diagnostics'
const iconsHeader: Record<ModeConsole, string> = {
    journal: 'fa-newspaper ',
    test: 'fa-check',
    diagnostics: 'fa-heartbeat',
}

class IconHeaderConsole {
    public readonly tag = 'i'
    public readonly class: Stream$<ModeConsole, string>
    public readonly children: VirtualDOM[]
    public readonly mode$: Subject<ModeConsole>
    public readonly target: ModeConsole
    public readonly onclick = () => {
        this.mode$.next(this.target)
    }

    constructor(params: { target: ModeConsole; mode$: Subject<ModeConsole> }) {
        Object.assign(this, params)
        const baseClasses = `fv-pointer rounded m-1 fas fv-hover-text-focus mx-2 ${
            iconsHeader[this.target]
        }`
        this.class = attr$(
            this.mode$,
            (mode: ModeConsole): string => {
                return mode == this.target
                    ? 'fv-bg-background fv-text-focus'
                    : ''
            },
            {
                wrapper: (d) => `${baseClasses} ${d}`,
            },
        )
    }
}

class HeaderConsole {
    public readonly class = 'd-flex justify-content-center'
    public readonly children: VirtualDOM[]
    public readonly mode$: BehaviorSubject<ModeConsole>
    public readonly types: ModeConsole[]

    constructor(params: { mode$: Subject<ModeConsole>; types: ModeConsole[] }) {
        Object.assign(this, params)
        this.children = this.types.map(
            (type) =>
                new IconHeaderConsole({ target: type, mode$: this.mode$ }),
        )
    }
}

type Executor = (
    source: string,
    debug: (title: string, data: Displayable) => void,
) =>
    | Displayable
    | Promise<Displayable>
    | Observable<Displayable>
    | InterpretError

class ConsoleView {
    public readonly class: Stream$<SplitMode, string>
    public readonly src: string
    public readonly testSrc: string
    public readonly log$: ReplaySubject<Log>
    public readonly children: VirtualDOM[]
    public readonly mode$: Subject<ModeConsole>
    public readonly splitMode$: Observable<SplitMode>
    public readonly toDisplayable?: (obj: unknown) => Displayable
    public readonly executor: Executor
    public readonly diagnosticsView?: (editor: CodeEditorView) => VirtualDOM
    public readonly codeEditorView: CodeEditorView

    constructor(params: {
        src: string
        splitMode$: Observable<SplitMode>
        mode$: Subject<ModeConsole>
        testSrc: string
        executor: Executor
        toDisplayable?: (obj: unknown) => Displayable
        diagnosticsView?: (editor: CodeEditorView) => VirtualDOM
        codeEditorView: CodeEditorView
    }) {
        Object.assign(this, params)
        this.class = attr$(this.splitMode$, (mode) => {
            const base = 'h-100 px-2 d-flex flex-column'
            return {
                'code-only': 'd-none',
                split: `w-50 ${base}`,
                'output-only': `w-100 ${base}`,
            }[mode]
        })
        this.log$ = new ReplaySubject()

        const debug = (title: string, data: Displayable) => {
            data = this.toDisplayable ? this.toDisplayable(data) : data
            this.log$.next({ title, data })
        }

        const executed = this.executor(this.src, debug)
        let output$
        if (executed instanceof Observable) {
            console.log('Observable')
            output$ = executed
        } else {
            output$ =
                executed instanceof Promise ? from(executed) : of(executed)
        }
        const defaultModes: ModeConsole[] = ['journal', 'test']
        this.children = [
            child$(output$, (output) => {
                if (output instanceof InterpretError) {
                    return {
                        class: 'fas fa-bug fv-text-error w-100 text-center',
                    }
                }
                return new HeaderConsole({
                    mode$: this.mode$,
                    types: defaultModes.concat(
                        this.diagnosticsView ? ['diagnostics'] : [],
                    ),
                })
            }),
            child$(output$, (output: Displayable) => {
                this.log$.next({
                    title: 'output',
                    data: this.toDisplayable
                        ? this.toDisplayable(output)
                        : output,
                })

                if (output instanceof InterpretError) {
                    return new ErrorsView({ error: output })
                }
                return {
                    class: 'flex-grow-1',
                    style: { minHeight: '0' },
                    children: [
                        {
                            class: attr$(this.mode$, (mode) =>
                                mode == 'journal' ? 'h-100' : 'd-none',
                            ),
                            children: [new JournalView({ log$: this.log$ })],
                        },
                        {
                            class: attr$(this.mode$, (mode) =>
                                mode == 'test' ? 'h-100' : 'd-none',
                            ),
                            children: [
                                new TestView({
                                    testSrc: this.testSrc,
                                    output,
                                }),
                            ],
                        },
                        this.diagnosticsView
                            ? {
                                  class: attr$(this.mode$, (mode) =>
                                      mode == 'diagnostics'
                                          ? 'h-100'
                                          : 'd-none',
                                  ),
                                  children: [
                                      this.diagnosticsView(this.codeEditorView),
                                  ],
                              }
                            : undefined,
                    ],
                }
            }),
        ]
    }
}
