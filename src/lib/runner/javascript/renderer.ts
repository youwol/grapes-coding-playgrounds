/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import { CdnClient, Lib } from '../types'

export function renderJavaScript() {
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
                    '@youwol/grapes-coding-playgrounds#latest~dist/@youwol/grapes-coding-playgrounds/js-playground.js',
                ],
                aliases: {
                    lib: '@youwol/grapes-coding-playgrounds/js-playground',
                },
            })
        }) as unknown as Promise<{ lib: Lib }>

    promise.then(({ lib }) => {
        lib.renderElement(this)
    })
}
