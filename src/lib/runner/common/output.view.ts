import { VirtualDOM } from '@youwol/flux-view'
import { DataView, Displayable, Log, LogObjectHeader } from './utils.view'
import { BehaviorSubject } from 'rxjs'

export class OutputView {
    public readonly output?: Displayable
    public readonly children: VirtualDOM[]

    constructor(params: { output: Displayable }) {
        Object.assign(this, params)
        const log = { title: 'output', data: this.output } as Log
        this.children = [
            {
                class: 'd-flex justify-content-center',
                children: [
                    this.output
                        ? new LogObjectHeader({
                              log,
                              selectedLog$: new BehaviorSubject(log),
                          })
                        : { innerText: 'no result returned' },
                ],
            },
            new DataView({ data: log.data }),
        ]
    }
}
