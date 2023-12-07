import { InterpretError } from './common/errors.view'
import { ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { Displayable } from './common'

class ErrorView implements VirtualDOM<'div'> {
    public readonly tag = 'div'
    public readonly innerText: string
    public readonly title: string
    public readonly exception: unknown
    public readonly children: ChildrenLike

    constructor(params: { title: string; exception: unknown }) {
        Object.assign(this, params)
        this.innerText = this.title
        this.children = [{ tag: 'div', innerText: this.exception.toString() }]
    }
}

export function runJavascriptCode(
    src: string,
    debug: (title: string, data: Displayable) => void,
) {
    const error = (title, exception) => {
        return new InterpretError({
            exception,
            view: new ErrorView({
                title,
                exception,
            }),
        })
    }

    try {
        const r = new Function(src)()({
            ...window,
            debug,
        })
        if (r instanceof Promise) {
            return r
                .then((okResult) => okResult)
                .catch((e) => {
                    return error('interpret error', e)
                })
        }
        return r
    } catch (e) {
        return error('interpret error', e)
    }
}
