import {
    BehaviorSubject,
    combineLatest,
    from,
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

export class PlaygroundView {
    public readonly appId: string
    public readonly class =
        'd-flex h-100 fv-text-primary fv-bg-background w-100 p-2'
    public readonly style = {
        maxHeight: '100%',
    }
    public readonly children: VirtualDOM[]
    public readonly src$: BehaviorSubject<string>

    public readonly startingSrc: string
    public readonly testSrc: string
    public readonly language: string
    public readonly transpiler: (source: string) => string
    public readonly run$: Subject<boolean>

    public readonly mode$: BehaviorSubject<ModeConsole>

    constructor(params: {
        startingSrc: string
        testSrc: string
        language: string
        transpiler: (source: string) => string
    }) {
        Object.assign(this, params)

        this.mode$ = new BehaviorSubject('journal')
        this.src$ = new BehaviorSubject(this.startingSrc)
        this.run$ = new Subject()

        this.children = [
            new CodeEditorView({
                src$: this.src$,
                run$: this.run$,
                language: this.language,
            }),
            child$(
                this.run$.pipe(withLatestFrom(this.src$)),
                ([_, src]) =>
                    new ConsoleView({
                        src,
                        mode$: this.mode$,
                        testSrc: this.testSrc,
                        transpiler: this.transpiler,
                    }),
            ),
        ]
    }
}

type ModeConsole = 'journal' | 'test'
const iconsHeader: Record<ModeConsole, string> = {
    journal: 'fa-newspaper ',
    test: 'fa-check',
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

    constructor(params: { mode$: Subject<ModeConsole> }) {
        Object.assign(this, params)
        this.children = [
            new IconHeaderConsole({ target: 'journal', mode$: this.mode$ }),
            new IconHeaderConsole({ target: 'test', mode$: this.mode$ }),
        ]
    }
}

class ConsoleView {
    public readonly class = 'w-50 h-100 px-2 d-flex flex-column'
    public readonly src: string
    public readonly testSrc: string
    public readonly log$: ReplaySubject<Log>
    public readonly children: VirtualDOM[]
    public readonly mode$: Subject<ModeConsole>
    public readonly transpiler: (source: string) => string

    constructor(params: {
        src: string
        mode$: Subject<ModeConsole>
        testSrc: string
        transpiler: (source: string) => string
    }) {
        Object.assign(this, params)

        this.log$ = new ReplaySubject()

        const debug = (message: { title: string; data: Displayable }) => {
            console.log('Debug!!', message)
            this.log$.next(message)
        }
        let transpiled = this.transpiler(this.src)
        console.log({ src: this.src, transpiled })

        const output$ = from(new Function(transpiled)()({ ...window, debug }))

        this.children = [
            child$(output$, (output) => {
                if (output instanceof InterpretError)
                    return {
                        class: 'fas fa-bug fv-text-error w-100 text-center',
                    }
                return new HeaderConsole({ mode$: this.mode$ })
            }),
            child$(
                combineLatest([this.mode$, output$]),
                ([mode, output]: [mode: ModeConsole, output: Displayable]) => {
                    if (output instanceof InterpretError) {
                        return new ErrorsView({ error: output })
                    }
                    if (mode == 'journal') {
                        this.log$.next({
                            title: 'output',
                            data: this.toDisplayable
                                ? this.toDisplayable(output)
                                : output,
                        })
                        return new JournalView({ log$: this.log$ })
                    }
                    if (mode == 'test') {
                        return new TestView({
                            testSrc: this.testSrc,
                            output,
                        })
                    }
                },
            ),
        ]
    }
}
