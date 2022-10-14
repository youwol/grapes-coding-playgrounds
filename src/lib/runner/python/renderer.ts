/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import { CdnClient } from '../types'

export function renderPython() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- I strongly believe it helps readability
    const htmlComponent: HTMLDivElement = this
    const logo = `<div style='font-size:xxx-large'>🐍</div>`
    const apiVersion = htmlComponent.getAttribute('apiVersion')
    const cdnClient: CdnClient = window['@youwol/cdn-client']

    htmlComponent.style.setProperty('position', 'relative')
    const loadingScreen = new cdnClient.LoadingScreenView({
        container: htmlComponent,
        logo,
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

    const exportedPyodideInstanceName = 'loadedPyodide'
    const packages = ['numpy', 'pandas', 'scikit-learn']
        .filter((name) => htmlComponent.hasAttribute(name))
        .map((p) => `@pyodide/${p}`)

    async function loadDependencies() {
        await cdnClient.install(
            {
                modules: [
                    { name: '@youwol/fv-tree', version: 'latest' },
                    { name: 'codemirror', version: 'latest' },
                ],
                scripts: ['codemirror#5.52.0~mode/python.min.js'],
                css: [
                    'codemirror#5.52.0~codemirror.min.css',
                    'codemirror#5.52.0~theme/blackboard.min.css',
                ],
                customInstallers: [
                    {
                        module: '@youwol/cdn-pyodide-loader',
                        installInputs: {
                            modules: packages,
                            warmUp: true,
                            onEvent: (ev) => loadingScreen.next(ev),
                            exportedPyodideInstanceName,
                        },
                    },
                ],
            },
            {
                onEvent: (ev) => {
                    loadingScreen.next(ev)
                },
            },
        )

        const { lib } = (await cdnClient.install(
            {
                scripts: [
                    '@youwol/grapes-coding-playgrounds#latest~dist/@youwol/grapes-coding-playgrounds/python-playground.js',
                ],
                aliases: {
                    lib: `@youwol/grapes-coding-playgrounds/python-playground_APIv${apiVersion}`,
                },
            },
            {
                onEvent: (ev) => {
                    loadingScreen.next(ev)
                },
            },
        )) as unknown as { lib }
        loadingScreen.done()
        return { lib, pyodide: window[exportedPyodideInstanceName] }
    }

    loadDependencies().then(({ lib, pyodide }) => {
        lib.renderElement(htmlComponent, pyodide)
    })
}
