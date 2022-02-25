import { BehaviorSubject, Subject } from 'rxjs'
import { HTMLElement$, VirtualDOM } from '@youwol/flux-view'

export class CodeEditorView {
    public readonly config = {
        value: '',
        mode: 'javascript',
        lineNumbers: true,
        theme: 'blackboard',
        lineWrapping: true,
        indentUnit: 4,
    }
    public readonly language: string
    public readonly class = 'w-50 h-100 d-flex flex-column'
    public readonly style = {
        'font-size': 'initial',
    }
    public readonly src$: BehaviorSubject<string>
    public readonly run$: Subject<boolean>
    public readonly children: VirtualDOM[]

    constructor(params: {
        src$: BehaviorSubject<string>
        run$: Subject<boolean>
        language: string
    }) {
        Object.assign(this, params)
        const CodeMirror = window['CodeMirror']
        this.children = [
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
                class: 'w-100 flex-grow-1 overflow-auto',
                children: [
                    {
                        id: 'code-mirror-editor',
                        class: 'w-100 h-100',
                        connectedCallback: (
                            elem: HTMLElement$ & HTMLDivElement,
                        ) => {
                            const editor = CodeMirror(elem, {
                                ...this.config,
                                mode: this.language,
                                value: this.src$.getValue(),
                            })
                            editor.on('changes', (_, changeObj) => {
                                if (
                                    changeObj.length == 1 &&
                                    changeObj[0].origin == 'setValue'
                                ) {
                                    return
                                }
                                this.src$.next(editor.getValue())
                            })
                            document
                                .querySelector('.CodeMirror-wrap')
                                .classList.add('h-100')
                        },
                    },
                ],
            },
        ]
    }
}
