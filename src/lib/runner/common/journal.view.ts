import { Observable, Subject } from 'rxjs'
import { child$, childrenAppendOnly$, VirtualDOM } from '@youwol/flux-view'
import { DataView, Log, LogObjectHeader } from './utils.view'
import { map } from 'rxjs/operators'

export class JournalView {
    public readonly class = 'flex-grow-1 d-flex flex-column'
    public readonly style = {
        minHeight: '0px',
    }
    public readonly log$: Observable<Log>
    public readonly children: VirtualDOM[]
    public readonly selectedLog$: Subject<Log>

    constructor(params: { log$: Observable<Log> }) {
        Object.assign(this, params)

        this.selectedLog$ = new Subject()

        this.children = [
            {
                class: 'd-flex flex-wrap justify-content-center',
                children: childrenAppendOnly$(
                    this.log$.pipe(map((d) => [d])),
                    (log: Log) => {
                        return new LogObjectHeader({
                            log,
                            selectedLog$: this.selectedLog$,
                        })
                    },
                ),
            },
            {
                class: 'flex-grow-1 overflow-auto',
                children: [
                    child$(
                        this.selectedLog$,
                        (log) => new DataView({ data: log.data }),
                    ),
                ],
            },
        ]
    }
}
