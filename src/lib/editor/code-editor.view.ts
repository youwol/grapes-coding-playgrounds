import { BehaviorSubject, merge, ReplaySubject, Subject } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'
import { HTMLElement$, render, VirtualDOM } from '@youwol/flux-view'
import { Modal } from '@youwol/fv-group'
import CodeMirror from 'codemirror'
import { HeaderView } from './editor-header.view'

import * as grapesjs from 'grapesjs'

const codeMirrorBaseConfiguration = {
    lineNumbers: true,
    theme: 'blackboard',
    lineWrapping: false,
    indentUnit: 4,
}

export class CodeEditorState {
    public readonly codeMirrorConfiguration: { [k: string]: unknown }
    public readonly codeMirrorEditor$ = new ReplaySubject<CodeMirror.Editor>()

    public readonly htmlElementContainer$ = new Subject<HTMLDivElement>()

    public readonly content$: BehaviorSubject<string>

    constructor(params: {
        codeMirrorConfiguration: { [k: string]: unknown }
        content$: BehaviorSubject<string>
    }) {
        Object.assign(this, params)
        this.htmlElementContainer$
            .pipe(
                map((elem) => {
                    const config = {
                        ...this.codeMirrorConfiguration,
                        value: this.content$.getValue(),
                    }
                    const editor: CodeMirror.Editor = window['CodeMirror'](
                        elem,
                        config,
                    )
                    return editor
                }),
            )
            .subscribe((editor) => {
                editor.on('changes', (_, changeObj) => {
                    if (
                        changeObj.length == 1 &&
                        changeObj[0].origin == 'setValue'
                    ) {
                        return
                    }
                    this.content$.next(editor.getValue())
                })

                this.codeMirrorEditor$.next(editor)
            })
    }
}

/**
 * Editor view
 */
export class CodeEditorView implements VirtualDOM {
    public readonly state: CodeEditorState
    public readonly class = 'd-flex flex-column fv-text-primary'
    public readonly headerView: VirtualDOM
    public readonly children: Array<VirtualDOM>
    public readonly style = {
        'font-size': 'initial',
    }
    public readonly configurationCodeMirror = {
        value: '',
        mode: 'markdown',
        lineNumbers: true,
        theme: 'blackboard',
        lineWrapping: true,
        indentUnit: 4,
    }

    constructor(params: {
        state: CodeEditorState
        headerView?: VirtualDOM
        content$: BehaviorSubject<string>
    }) {
        Object.assign(this, params)

        this.children = [
            this.headerView,
            {
                class: 'w-100',
                style: {
                    height: '50vh',
                },
                children: [
                    {
                        id: 'code-mirror-editor',
                        class: 'w-100 h-100',
                        connectedCallback: (
                            elem: HTMLElement$ & HTMLDivElement,
                        ) => {
                            this.state.htmlElementContainer$.next(elem)
                        },
                    },
                ],
            },
        ]
    }
}

export function popupModal({ editorView }: { editorView: VirtualDOM }) {
    const modalState = new Modal.State()
    const view = new Modal.View({
        state: modalState,
        contentView: () => {
            return {
                class: 'p-3 rounded fv-color-primary fv-bg-background w-75 h-75 overflow-auto',
                children: [editorView],
            }
        },
        connectedCallback: (elem: HTMLDivElement & HTMLElement$) => {
            elem.children[0].classList.add('w-100')
            const sub = merge(modalState.cancel$, modalState.ok$).subscribe(
                () => {
                    modalDiv.remove()
                },
            )
            elem.ownSubscriptions(sub)
        },
    } as any)
    const modalDiv = render(view)
    document.querySelector('body').appendChild(modalDiv)
}

export function editCode(srcAttName, editor: grapesjs.Editor, mode: string) {
    const component = editor.getSelected()

    const src$ = new BehaviorSubject<string>(
        component.getAttributes()[srcAttName],
    )
    const state = new CodeEditorState({
        codeMirrorConfiguration: { ...codeMirrorBaseConfiguration, mode },
        content$: src$,
    })

    const headerView = new HeaderView({ state })
    const editorView = new CodeEditorView({
        state,
        content$: src$,
        headerView,
    })
    popupModal({ editorView })
    headerView.run$.pipe(withLatestFrom(src$)).subscribe(([_, src]) => {
        component && component.addAttributes({ [srcAttName]: src })
        console.log('Save attr', component)
        component.view.render()
    })
}
