import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { attr$, childrenAppendOnly$, VirtualDOM } from '@youwol/flux-view'
import { DataView, Log, LogObjectHeader } from './utils.view'
import { map, take } from 'rxjs/operators'

export class JournalView {
    public readonly class = 'h-100 d-flex flex-column'
    public readonly style = {
        minHeight: '0px',
    }
    public readonly log$: Observable<Log>
    public readonly children: VirtualDOM[]
    public readonly selectedLog$: Subject<Log>

    constructor(params: { log$: Observable<Log> }) {
        Object.assign(this, params)

        this.selectedLog$ = new BehaviorSubject(undefined)
        this.log$.pipe(take(1)).subscribe((log) => this.selectedLog$.next(log))

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
            /*Below we could have used
                child$(
                        this.selectedLog$,
                        (log) => new DataView({ data: log.data }),
                    ),
              But it leads to some bug regarding python & lifetime of proxy.
              It is safer to create all views at once, and not recreating them afterward
              */

            {
                class: 'flex-grow-1 overflow-auto',
                style: {
                    minHeight: '0',
                },
                children: childrenAppendOnly$(
                    this.log$.pipe(map((d) => [d])),
                    (log: Log) => {
                        return {
                            class: attr$(this.selectedLog$, (selected) =>
                                selected && selected.title == log.title
                                    ? 'h-100'
                                    : 'd-none',
                            ),
                            children: [new DataView({ data: log.data })],
                        }
                    },
                ),
            },
        ]
    }
}
