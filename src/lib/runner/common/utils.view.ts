import { ChildrenLike, RxAttribute, VirtualDOM } from '@youwol/rx-vdom'
import { Subject } from 'rxjs'
import { ObjectJs } from '@youwol/rx-tree-views'

export type Displayable = Record<string, unknown> | HTMLElement

export interface Log {
    title: string
    data: Displayable
}

export class LogObjectHeader implements VirtualDOM<'div'> {
    public readonly baseClass =
        'px-2 py-1 border-bottom fv-pointer fv-hover-text-focus mx-1'
    public readonly tag = 'div'
    public readonly class: RxAttribute<Log, string>
    public readonly log: Log
    public readonly children: ChildrenLike
    public readonly style = {
        width: 'fit-content',
    }

    public readonly selectedLog$: Subject<Log | undefined>
    public readonly onclick = () => {
        this.selectedLog$.next(this.log)
    }

    constructor(params: { log: Log; selectedLog$: Subject<Log> }) {
        Object.assign(this, params)

        this.class = {
            source$: this.selectedLog$,
            vdomMap: (log): string =>
                log && log.title == this.log.title ? 'fv-text-focus ' : '',
            wrapper: (d) => `${d} ${this.baseClass}`,
            untilFirst: this.baseClass,
        }
        this.children = [
            {
                tag: 'i',
                class:
                    this.log.data instanceof HTMLElement
                        ? 'fas fa-code mx-2'
                        : 'fas fa-sitemap mx-2',
            },
            {
                tag: 'i',
                innerText: this.log.title,
            },
        ]
    }
}

export function objectJsView(object) {
    const state = new ObjectJs.State({
        title: 'data',
        data: object,
        expandedNodes: ['data_0'],
    })
    return new ObjectJs.View({ state })
}

export class DataView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'py-2'
    public readonly innerText: string
    public readonly data: Displayable
    public readonly children: ChildrenLike

    constructor(params: { data: Displayable }) {
        Object.assign(this, params)
        const child =
            this.data instanceof HTMLElement
                ? this.data
                : objectJsView(this.data)

        this.children = [child]
    }
}
