import { childrenAppendOnly$, VirtualDOM } from '@youwol/flux-view'
import { from, ReplaySubject } from 'rxjs'
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
            console.log('Expect', { title, validated })
            this.expect$.next({ title, validated })
        }
        console.log('testSrc', this.testSrc)
        from(
            new Function(this.testSrc)()(this.output, {
                ...window,
                expect,
            }),
        ).subscribe(() => {
            /* only side effects of pushing 'expect'*/
        })
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
