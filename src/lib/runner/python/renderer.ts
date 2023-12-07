/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import type * as webpmModule from '@youwol/webpm-client'

export function renderPython() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- I strongly believe it helps readability
    const htmlComponent: HTMLDivElement = this
    const logo = `<div style='font-size:xxx-large'>🐍</div>`
    const apiVersion = htmlComponent.getAttribute('apiVersion')
    // The cdn-client is provided by the hosting application (e.g. stories) which may not have been
    // migrated to webpm-client yet.
    const webpmClient: typeof webpmModule =
        window['@youwol/webpm-client'] || window['@youwol/cdn-client']

    htmlComponent.style.setProperty('position', 'relative')
    const loadingScreen = new webpmClient.LoadingScreenView({
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
    const pyReqs = new Function(htmlComponent.getAttribute('requirements'))()()
    const exportedPyodideInstanceName = 'loadedPyodide'

    async function loadDependencies() {
        await webpmClient.install({
            modules: ['@youwol/rx-tree-views#^0.3.1', 'codemirror#^5.52.0'],
            scripts: ['codemirror#5.52.0~mode/python.min.js'],
            css: [
                'codemirror#5.52.0~codemirror.min.css',
                'codemirror#5.52.0~theme/blackboard.min.css',
            ],
            customInstallers: [
                {
                    module: '@youwol/webpm-pyodide-loader#^0.2.0',
                    installInputs: {
                        modules: pyReqs.pyModules,
                        warmUp: true,
                        onEvent: (ev) => loadingScreen.next(ev),
                        exportedPyodideInstanceName,
                    } as never,
                },
            ],
            onEvent: (ev) => {
                loadingScreen.next(ev)
            },
        })

        const { lib } = (await webpmClient.install({
            scripts: [
                '@youwol/grapes-coding-playgrounds#0.2.0-wip~dist/@youwol/grapes-coding-playgrounds/python-playground.js',
            ],
            aliases: {
                lib: `@youwol/grapes-coding-playgrounds/python-playground_APIv${apiVersion}`,
            },
            onEvent: (ev) => {
                loadingScreen.next(ev)
            },
        })) as unknown as { lib }
        loadingScreen.done()
        return { lib, pyodide: window[exportedPyodideInstanceName] }
    }

    loadDependencies().then(({ lib, pyodide }) => {
        lib.renderElement(htmlComponent, pyodide)
    })
}
