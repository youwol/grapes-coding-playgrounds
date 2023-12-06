/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import { CdnClient, Lib } from '../types'
import { setup } from '../../../auto-generated'

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
                    ` @youwol/cdn-client#${setup.runTimeDependencies.externals['@youwol/cdn-client']}`,
                    `@youwol/fv-tree#${setup.runTimeDependencies.externals['@youwol/fv-tree']}`,
                    `codemirror#${setup.runTimeDependencies.externals['codemirror']}`,
                    `typescript#${setup.runTimeDependencies.externals['typescript']}`,
                    `@typescript/vfs#${setup.runTimeDependencies.externals['@typescript/vfs']}`,
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
                        `@youwol/grapes-coding-playgrounds#${setup.version}~dist/@youwol/grapes-coding-playgrounds/ts-playground.js`,
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
