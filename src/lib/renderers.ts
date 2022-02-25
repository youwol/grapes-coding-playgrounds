type CdnClient = { install: (p) => Promise<Window> }
type Lib = { renderElement: (elem: HTMLElement) => void }

export function renderJavaScript() {
    /* This script will be copied in a <script> element in the canvas document
    No reference to external symbols is allowed.
    Implicit argument: 'this' variable is bound to the HTMLElement being rendered
     */
    const cdnClient: CdnClient = window['@youwol/cdn-client']

    let promise = cdnClient
        .install({
            modules: ['@youwol/fv-tree', 'codemirror'],
            scripts: ['codemirror#5.52.0~mode/javascript.min.js'],
            css: [
                'codemirror#5.52.0~codemirror.min.css',
                'codemirror#5.52.0~theme/blackboard.min.css',
            ],
        })
        .then((_) => {
            return cdnClient.install({
                scripts: [
                    '@youwol/grapes-coding-playgrounds#latest~dist/js-playground.js',
                ],
                aliases: {
                    lib: '@youwol/grapes-coding-playgrounds',
                },
            })
        }) as unknown as Promise<{ lib: Lib }>

    promise.then(({ lib }) => {
        lib.renderElement(this)
    })
}

export function renderTypeScript() {
    /* This script will be copied in a <script> element in the canvas document
    No reference to external symbols is allowed.
    Implicit argument: 'this' variable is bound to the HTMLElement being rendered
     */
    const cdnClient: CdnClient = window['@youwol/cdn-client']

    let promise = cdnClient
        .install({
            modules: ['@youwol/fv-tree', 'codemirror'],
            scripts: ['codemirror#5.52.0~mode/javascript.min.js'],
            css: [
                'codemirror#5.52.0~codemirror.min.css',
                'codemirror#5.52.0~theme/blackboard.min.css',
            ],
        })
        .then((_) => {
            return cdnClient.install({
                scripts: [
                    '@youwol/grapes-coding-playgrounds#latest~dist/ts-playground.js',
                ],
                aliases: {
                    lib: '@youwol/grapes-coding-playgrounds',
                },
            })
        }) as unknown as Promise<{ lib: Lib }>

    promise.then(({ lib }) => {
        lib.renderElement(this)
    })
}
