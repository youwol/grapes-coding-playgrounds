import { Subject } from 'rxjs'
import { HTMLElement$, VirtualDOM } from '@youwol/flux-view'
import { CodeEditorState } from './code-editor.view'

export class HeaderView {
    public readonly state: CodeEditorState
    public readonly run$ = new Subject<boolean>()
    public readonly children: VirtualDOM[]
    public readonly connectedCallback: (
        elem: HTMLElement$ & HTMLDivElement,
    ) => void

    constructor(params: { state: CodeEditorState }) {
        Object.assign(this, params)
        this.children = [
            {
                class: 'd-flex w-100 align-items-center',
                children: [
                    {
                        tag: 'i',
                        class: 'fv-pointer rounded m-1 fas fa-save fv-hover-text-focus',
                        onclick: () => this.run$.next(true),
                    },
                ],
            },
        ]
    }
}
