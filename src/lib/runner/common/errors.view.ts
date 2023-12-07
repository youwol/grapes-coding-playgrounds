import { AnyVirtualDOM, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'

export class InterpretError implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly exception: unknown
    public readonly view: AnyVirtualDOM

    constructor(params: { exception: unknown; view: AnyVirtualDOM }) {
        Object.assign(this, params)
    }
}

export class ErrorsView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly class = 'flex-grow-1 overflow-auto'
    public readonly error: InterpretError
    public readonly children: ChildrenLike

    constructor(params: { error: InterpretError }) {
        Object.assign(this, params)
        this.children = [this.error.view]
    }
}
