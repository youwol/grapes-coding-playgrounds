import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs'
import { HTMLElement$, VirtualDOM } from '@youwol/flux-view'

import CodeMirror from 'codemirror'
import { take } from 'rxjs/operators'

export class CodeEditorView {
    public readonly config = {
        value: '',
        lineNumbers: true,
        theme: 'blackboard',
        lineWrapping: false,
        indentUnit: 4,
    }
    public readonly language: string
    public readonly class = 'w-100 h-100 d-flex flex-column overflow-auto'
    public readonly style = {
        'font-size': 'initial',
    }
    public readonly src$: BehaviorSubject<string>
    public readonly run$ = new Subject<boolean>()
    public readonly change$ = new ReplaySubject<CodeMirror.EditorChange[]>(1)
    public readonly cursor$ = new ReplaySubject<CodeMirror.Position>(1)
    public readonly children: VirtualDOM[]

    public readonly nativeEditor$ = new ReplaySubject<CodeMirror.Editor>(1)
    public readonly connectedCallback: (
        elem: HTMLDivElement & HTMLElement$,
    ) => void
    constructor(params: {
        src$: BehaviorSubject<string>
        language: string
        config?: unknown
    }) {
        Object.assign(this, params)
        const config = {
            ...this.config,
            mode: this.language,
            value: this.src$.getValue(),
            extraKeys: {
                'Ctrl-Enter': () => {
                    this.run$.next(true)
                },
            },
        }
        this.children = [
            {
                id: 'code-mirror-editor',
                class: 'w-100 h-100',
                connectedCallback: (elem: HTMLElement$ & HTMLDivElement) => {
                    const editor = CodeMirror(elem, config)
                    this.nativeEditor$.next(editor)
                    editor.on('changes', (_, changeObj) => {
                        this.change$.next(changeObj)
                        if (
                            changeObj.length == 1 &&
                            changeObj[0].origin == 'setValue'
                        ) {
                            return
                        }
                        this.src$.next(editor.getValue())
                    })
                    elem.querySelector('.CodeMirror').classList.add('h-100')
                    editor.on('cursorActivity', () => {
                        this.cursor$.next(editor.getCursor())
                    })
                },
            },
        ]
        this.connectedCallback = (elem: HTMLDivElement) => {
            // Code mirror editors has problem when being first rendered in a div that is not visible
            // Following is to intersect the view port and get notified when intersection changes
            const getDisplayNoneElement = (currentElem: HTMLElement) => {
                if (getComputedStyle(currentElem).display == 'none') {
                    return currentElem
                }
                const parent = currentElem.parentElement
                if (!parent) {
                    return
                }
                return getDisplayNoneElement(parent)
            }
            const parentInvisible = getDisplayNoneElement(elem)

            const observer = new IntersectionObserver(
                (entries, _observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.nativeEditor$
                                .pipe(take(1))
                                .subscribe((editor) => {
                                    editor.refresh()
                                })
                            _observer.disconnect()
                        }
                    })
                },
                { root: parentInvisible },
            )
            observer.observe(elem)
        }
    }
}
