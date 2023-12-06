import { childrenAppendOnly$, VirtualDOM } from '@youwol/flux-view'
import { ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'

export class TestView {
    public readonly testSrc: string
    public readonly output: unknown
    public readonly children: VirtualDOM[]
    public readonly expect$: ReplaySubject<{
        title: string
        validated: boolean
    }>

    constructor(params: { testSrc: string; output: unknown }) {
        Object.assign(this, params)
        this.expect$ = new ReplaySubject()
        const expect = (title, validated) => {
            this.expect$.next({ title, validated })
        }
        try {
            const result = new Function(this.testSrc)()(this.output, {
                ...window,
                expect,
            })
            if (result instanceof Promise) {
                result.then(() => {
                    /*no op*/
                })
            }
        } catch (e) {
            console.log('error', e)
        }
        this.children = [
            {
                children: childrenAppendOnly$(
                    this.expect$.pipe(map((d) => [d])),
                    ({ title, validated }) => {
                        return new TestItemView({ title, validated })
                    },
                ),
            },
        ]
    }
}

class TestItemView {
    public readonly class = 'd-flex align-items-center'
    public readonly children: VirtualDOM[]
    public readonly title: string
    public readonly validated: boolean

    constructor(params: { title: string; validated: boolean }) {
        Object.assign(this, params)
        this.children = [
            {
                class: this.validated
                    ? 'fas fa-check fv-text-success'
                    : 'fas fa-times fv-text-error',
            },
            { class: 'px-2', innerText: this.title },
        ]
    }
}
