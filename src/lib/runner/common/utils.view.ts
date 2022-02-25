import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { Subject } from 'rxjs'
import { ObjectJs } from '@youwol/fv-tree'

export type Displayable = Record<string, unknown> | HTMLElement

export interface Log {
    title: string
    data: Displayable
}

export class LogObjectHeader {
    public readonly baseClass =
        'px-2 py-1 border-bottom fv-pointer fv-hover-text-focus mx-1'
    public readonly class: Stream$<Log, string>
    public readonly log: Log
    public readonly children: VirtualDOM[]
    public readonly style = {
        width: 'fit-content',
    }

    public readonly selectedLog$: Subject<Log>
    public readonly onclick = () => {
        this.selectedLog$.next(this.log)
    }

    constructor(params: { log: Log; selectedLog$: Subject<Log> }) {
        Object.assign(this, params)

        this.class = attr$(
            this.selectedLog$,
            (log): string =>
                log.title == this.log.title ? 'fv-text-focus ' : '',
            {
                wrapper: (d) => `${d} ${this.baseClass}`,
                untilFirst: this.baseClass,
            },
        )
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

export class DataView {
    public readonly class = 'py-2'
    public readonly innerText: string
    public readonly data: Displayable
    public readonly children: VirtualDOM[]

    constructor(params: { data: Displayable }) {
        Object.assign(this, params)
        console.log('Data view', this.data)
        const child =
            this.data instanceof HTMLElement
                ? this.data
                : objectJsView(this.data)

        this.children = [child]
    }
}
