/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
import { CdnClient } from '../types'

export function renderPython() {
    const imports = {
        numpy: 'numpy',
        pandas: 'pandas',
        'scikit-learn': 'sklearn',
    }

    let logo = `<div style='font-size:xxx-large'>🐍</div>`
    const pyodideVersion = '0.19.1'
    const cdnClient: CdnClient = window['@youwol/cdn-client']
    const elemHTML: HTMLElement = this
    elemHTML.style.setProperty('position', 'relative')
    const loadingScreen = new cdnClient.LoadingScreenView({
        container: this,
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

    let indexPyodide =
        cdnClient.getUrlBase('@pyodide/pyodide', pyodideVersion) + '/full'

    async function loadDependencies() {
        await cdnClient.install(
            {
                modules: [
                    { name: '@youwol/fv-tree', version: 'latest' },
                    { name: 'codemirror', version: 'latest' },
                    { name: '@pyodide/pyodide', version: pyodideVersion },
                ],
                scripts: ['codemirror#5.52.0~mode/python.min.js'],
                css: [
                    'codemirror#5.52.0~codemirror.min.css',
                    'codemirror#5.52.0~theme/blackboard.min.css',
                ],
            },
            {
                onEvent: (ev) => {
                    loadingScreen.next(ev)
                },
            },
        )
        if (!window['loadedPyodide']) {
            window['loadedPyodide'] = window['loadPyodide']({
                indexURL: indexPyodide,
            })
        }
        loadingScreen.next(
            new cdnClient.CdnMessageEvent('loadPyodide', 'Loading Pyodide...'),
        )
        const pyodide = await window['loadedPyodide']
        loadingScreen.next(
            new cdnClient.CdnMessageEvent('loadPyodide', 'Pyodide loaded'),
        )
        const messageCallback = (m) => {
            m = m.split('from')[0]
            loadingScreen.next(
                new cdnClient.CdnMessageEvent('load package_', m),
            )
        }
        const promises = ['numpy', 'pandas', 'scikit-learn']
            .filter((name) => elemHTML.hasAttribute(name))
            .map((name) => {
                loadingScreen.next(
                    new cdnClient.CdnMessageEvent(
                        `load${name}`,
                        `${name} loading...`,
                    ),
                )
                return pyodide.loadPackage(name, messageCallback).then(() => {
                    loadingScreen.next(
                        new cdnClient.CdnMessageEvent(
                            `load${name}`,
                            `${name} installing...`,
                        ),
                    )
                    pyodide.runPython(`import ${imports[name]}`)
                    loadingScreen.next(
                        new cdnClient.CdnMessageEvent(
                            `load${name}`,
                            `${name} installed`,
                        ),
                    )
                    return true
                })
            })
        await Promise.all(promises)
        loadingScreen.next(
            new cdnClient.CdnMessageEvent(
                'load python-playground',
                'python-playground installing...',
            ),
        )
        const { lib } = (await cdnClient.install(
            {
                scripts: [
                    '@youwol/grapes-coding-playgrounds#latest~dist/@youwol/grapes-coding-playgrounds/python-playground.js',
                ],
                aliases: {
                    lib: '@youwol/grapes-coding-playgrounds/python-playground',
                },
            },
            {
                onEvent: (ev) => {
                    loadingScreen.next(ev)
                },
            },
        )) as unknown as { lib }
        loadingScreen.done()
        return { lib, pyodide }
    }

    loadDependencies().then(({ lib, pyodide }) => {
        lib.renderElement(this, pyodide)
    })
}
