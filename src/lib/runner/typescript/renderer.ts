/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import { CdnClient, Lib } from '../types'

export function renderTypeScript() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- I strongly believe it helps readability
    const htmlComponent: HTMLDivElement = this

    const cdnClient: CdnClient = window['@youwol/cdn-client']
    htmlComponent.style.setProperty('position', 'relative')
    const loadingScreen = new cdnClient.LoadingScreenView({
        container: htmlComponent,
        logo: `<div style='font-size:x-large'>TypeScript</div>`,
        wrapperStyle: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            'font-weight': 'bolder',
        },
    })
    loadingScreen.render()
    const apiVersion = htmlComponent.getAttribute('apiVersion')
    const promise = cdnClient
        .install(
            {
                modules: [
                    '@youwol/cdn-client#^2.0.1',
                    '@youwol/fv-tree#^0.2.3',
                    'codemirror#^5.52.0',
                    'typescript#^4.7.4',
                    '@typescript/vfs#^1.4.0',
                ],
                scripts: [
                    'codemirror#5.52.0~mode/javascript.min.js',
                    'codemirror#5.52.0~addons/lint/lint.js',
                ],
                css: [
                    'codemirror#5.52.0~codemirror.min.css',
                    'codemirror#5.52.0~theme/blackboard.min.css',
                    'codemirror#5.52.0~addons/lint/lint.css',
                ],
            },
            {
                onEvent: (ev) => {
                    loadingScreen.next(ev)
                },
            },
        )
        .then((_) => {
            console.log('aaaaaa', _)
            return cdnClient.install(
                {
                    scripts: [
                        '@youwol/grapes-coding-playgrounds#latest~dist/@youwol/grapes-coding-playgrounds/ts-playground.js',
                    ],
                    aliases: {
                        lib: `@youwol/grapes-coding-playgrounds/ts-playground_APIv${apiVersion}`,
                    },
                },
                {
                    onEvent: (ev) => {
                        loadingScreen.next(ev)
                    },
                },
            )
        }) as unknown as Promise<{ lib: Lib }>

    promise.then(({ lib }) => {
        loadingScreen.done()
        lib.renderElement(htmlComponent)
    })
}
