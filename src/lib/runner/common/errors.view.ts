import { VirtualDOM } from '@youwol/flux-view'

export class InterpretError {
    public readonly exception: unknown
    public readonly view: VirtualDOM

    constructor(params: { exception: unknown; view: VirtualDOM }) {
        Object.assign(this, params)
    }
}

export class ErrorsView {
    public readonly class = 'flex-grow-1 overflow-auto'
    public readonly error: InterpretError
    public readonly children: VirtualDOM[]

    constructor(params: { error: InterpretError }) {
        Object.assign(this, params)
        this.children = [this.error.view]
    }
}
