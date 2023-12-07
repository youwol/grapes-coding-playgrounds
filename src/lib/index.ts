import {
    JsPlaygroundBlock,
    JsPlaygroundComponent,
} from './javascript-component'
import {
    PythonPlaygroundBlock,
    PythonPlaygroundComponent,
} from './python-component'
import {
    TsPlaygroundBlock,
    TsPlaygroundComponent,
} from './typescript-component'
import * as webpmClient from '@youwol/webpm-client'
import { setup } from '../auto-generated'
import { CdnEvent } from '@youwol/webpm-client'

import type * as JsRendererModule from './runner/javascript/js-playground'
import type * as PyRendererModule from './runner/python/py-playground'
import type * as TsRendererModule from './runner/typescript/ts-playground'
import { render } from '@youwol/rx-vdom'
import type { SplitMode } from './runner/common'
export function getComponents() {
    return [
        JsPlaygroundComponent,
        PythonPlaygroundComponent,
        TsPlaygroundComponent,
    ]
}

export function getBlocks() {
    return [JsPlaygroundBlock, PythonPlaygroundBlock, TsPlaygroundBlock]
}

const codeMirrorBasePath = `codemirror#${setup.runTimeDependencies.externals.codemirror}`

const codeMirrorCss = [
    `${codeMirrorBasePath}~codemirror.min.css`,
    `${codeMirrorBasePath}~theme/blackboard.min.css`,
]

function displayLoadingScreen({ logo, container }) {
    container.style.setProperty('position', 'relative')
    const screen = new webpmClient.LoadingScreenView({
        container: container,
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
    screen.render()
    return screen
}
export async function jsPlaygroundView({
    loadingScreenContainer,
    mode,
    src,
    srcTest,
    returnType,
}: {
    loadingScreenContainer?: HTMLElement
    mode: SplitMode
    src: string
    srcTest: string
    returnType: 'html' | 'vdom'
}): Promise<HTMLElement | ReturnType<typeof JsRendererModule.renderElement>> {
    const loadingScreen = loadingScreenContainer
        ? displayLoadingScreen({
              container: loadingScreenContainer,
              logo: `<div style='font-size:x-large'>JavaScript</div>`,
          })
        : undefined

    return await setup
        .installAuxiliaryModule({
            name: 'js-playground',
            cdnClient: webpmClient,
            installParameters: {
                scripts: [`${codeMirrorBasePath}~mode/javascript.min.js`],
                css: codeMirrorCss,
                onEvent: (ev: CdnEvent) => {
                    loadingScreen?.next(ev)
                },
            },
        })
        .then((module: typeof JsRendererModule) => {
            loadingScreen?.done()
            const vdom = module.renderElement({ mode, src, srcTest })
            return returnType == 'html' ? render(vdom) : vdom
        })
}
export async function pyPlaygroundView({
    loadingScreenContainer,
    mode,
    src,
    srcTest,
    pythonModules,
    exportedPyodideInstanceName,
    returnType,
}: {
    loadingScreenContainer?: HTMLElement
    mode: SplitMode
    src: string
    srcTest: string
    pythonModules: string[]
    exportedPyodideInstanceName: string
    returnType: 'html' | 'vdom'
}): Promise<HTMLElement | ReturnType<typeof PyRendererModule.renderElement>> {
    const loadingScreen = loadingScreenContainer
        ? displayLoadingScreen({
              container: loadingScreenContainer,
              logo: `<div style='font-size:xxx-large'>🐍</div>`,
          })
        : undefined
    const pyodideLoaderVersion =
        setup.runTimeDependencies.externals['@youwol/webpm-pyodide-loader']

    return await setup
        .installAuxiliaryModule({
            name: 'py-playground',
            cdnClient: webpmClient,
            installParameters: {
                customInstallers: [
                    {
                        module: `@youwol/webpm-pyodide-loader#${pyodideLoaderVersion}`,
                        installInputs: {
                            modules: pythonModules,
                            warmUp: true,
                            onEvent: (ev) => loadingScreen.next(ev),
                            exportedPyodideInstanceName,
                        } as never,
                    },
                ],
                scripts: [`${codeMirrorBasePath}~mode/python.min.js`],
                css: codeMirrorCss,
                onEvent: (ev: CdnEvent) => {
                    loadingScreen?.next(ev)
                },
            },
        })
        .then((module: typeof PyRendererModule) => {
            loadingScreen?.done()
            const vdom = module.renderElement({
                pyodide: window[exportedPyodideInstanceName],
                mode,
                src,
                srcTest,
            })
            return returnType == 'html' ? render(vdom) : vdom
        })
}

export async function tsPlaygroundView({
    loadingScreenContainer,
    mode,
    src,
    srcTest,
    returnType,
}: {
    loadingScreenContainer?: HTMLElement
    mode: SplitMode
    src: string
    srcTest: string
    returnType: 'html' | 'vdom'
}): Promise<HTMLElement | ReturnType<typeof TsRendererModule.renderElement>> {
    const loadingScreen = loadingScreenContainer
        ? displayLoadingScreen({
              container: loadingScreenContainer,
              logo: `<div style='font-size:x-large'>TypeScript</div>`,
          })
        : undefined

    return await setup
        .installAuxiliaryModule({
            name: 'ts-playground',
            cdnClient: webpmClient,
            installParameters: {
                scripts: [
                    `${codeMirrorBasePath}~mode/javascript.min.js`,
                    `${codeMirrorBasePath}~addons/lint/lint.js`,
                ],
                css: [
                    ...codeMirrorCss,
                    `${codeMirrorBasePath}~addons/lint/lint.css`,
                ],
                onEvent: (ev: CdnEvent) => {
                    loadingScreen?.next(ev)
                },
            },
        })
        .then((module: typeof TsRendererModule) => {
            loadingScreen?.done()
            const vdom = module.renderElement({
                mode,
                src,
                srcTest,
            })
            return returnType == 'html' ? render(vdom) : vdom
        })
}
