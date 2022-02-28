/**
 * Each of the functions here will be copied in a <script> element in the canvas document
 * No reference to external symbols is allowed.
 * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
 */
type CdnClient = {
    install: (p, p2?) => Promise<Window>
    LoadingScreenView: any
    getUrlBase: any
    CdnMessageEvent: any
}
type Lib = { renderElement: (elem: HTMLElement, ...args) => void }

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

export function renderTypeScript() {
    const cdnClient: CdnClient = window['@youwol/cdn-client']

    let promise = cdnClient
        .install(
            {
                modules: ['@youwol/fv-tree', 'codemirror'],
                scripts: ['codemirror#5.52.0~mode/javascript.min.js'],
                css: [
                    'codemirror#5.52.0~codemirror.min.css',
                    'codemirror#5.52.0~theme/blackboard.min.css',
                ],
            },
            { displayLoadingScreen: this },
        )
        .then((_) => {
            return cdnClient.install({
                scripts: [
                    '@youwol/grapes-coding-playgrounds#latest~dist/@youwol/grapes-coding-playgrounds/ts-playground.js',
                ],
                aliases: {
                    lib: '@youwol/grapes-coding-playgrounds/ts-playground',
                },
            })
        }) as unknown as Promise<{ lib: Lib }>

    promise.then(({ lib }) => {
        lib.renderElement(this)
    })
}

export function renderPython() {
    let logo = `<div style='font-size:xxx-large'>🐍</div>`
    const cdnClient: CdnClient = window['@youwol/cdn-client']
    const elemHTML: HTMLElement = this
    elemHTML.style.setProperty('position', 'relative')
    const loadingScreen = new cdnClient.LoadingScreenView({
        container: this,
        logo,
        wrapperStyle: {
            position: 'absolute',
            top: '0',
            width: '100%',
            height: '100%',
            'font-weight': 'bolder',
        },
    })
    loadingScreen.render()

    let indexPyodide =
        cdnClient.getUrlBase('@pyodide/pyodide', '0.17.0') + '/full'

    async function loadDependencies() {
        await cdnClient.install(
            {
                modules: ['@youwol/fv-tree', 'codemirror', '@pyodide/pyodide'],
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
        loadingScreen.next(
            new cdnClient.CdnMessageEvent('loadNumpy', 'numpy loading...'),
        )
        await pyodide.loadPackage('numpy')
        loadingScreen.next(
            new cdnClient.CdnMessageEvent('loadNumpy', 'numpy installing...'),
        )
        pyodide.runPython('import numpy')
        loadingScreen.next(
            new cdnClient.CdnMessageEvent('loadNumpy', 'numpy installed'),
        )
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
