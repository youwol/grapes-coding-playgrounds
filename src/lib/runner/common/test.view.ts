import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'

export class TestView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly testSrc: string
    public readonly output: unknown
    public readonly children: ChildrenLike
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
                tag: 'div',
                children: {
                    policy: 'append',
                    source$: this.expect$.pipe(map((d) => [d])),
                    vdomMap: ({
                        title,
                        validated,
                    }: {
                        title: string
                        validated: boolean
                    }) => {
                        return new TestItemView({ title, validated })
                    },
                },
            },
        ]
    }
}

class TestItemView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'd-flex align-items-center'
    public readonly children: ChildrenLike
    public readonly title: string
    public readonly validated: boolean

    constructor(params: { title: string; validated: boolean }) {
        Object.assign(this, params)
        this.children = [
            {
                tag: 'div',
                class: this.validated
                    ? 'fas fa-check fv-text-success'
                    : 'fas fa-times fv-text-error',
            },
            { tag: 'div', class: 'px-2', innerText: this.title },
        ]
    }
}
