import { Subject } from 'rxjs'
import { ChildrenLike, RxHTMLElement } from '@youwol/rx-vdom'

export class HeaderView {
    public readonly run$ = new Subject<boolean>()
    public readonly children: ChildrenLike
    public readonly connectedCallback: (elem: RxHTMLElement<'div'>) => void

    constructor(params) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'div',
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
