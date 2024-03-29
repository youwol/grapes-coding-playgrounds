import type * as Module from '../../../index'
/**
 * This functions will be copied in a <script> element in the canvas document.
 * NO REFERENCE TO EXTERNAL SYMBOLS IS ALLOWED (besides types).
 */
export function renderTypeScript() {
    // Implicit 'this' is bound to the HTMLElement being rendered
    const version = this.getAttribute('version')
    const symbol = `@youwol/GCP_${version}`
    const installGCPBody = {
        modules: [`@youwol/grapes-coding-playgrounds#^${version} as ${symbol}`],
    }
    const installer = '@youwol/webpm-client'

    // Patched because stories app is still using @youwol/cdn-client (12/7/2024)
    const patchCdnClient = () =>
        window[installer]
            ? Promise.resolve(window)
            : window['@youwol/cdn-client'].install({
                  modules: [`${installer}#^3.0.1`],
              })

    patchCdnClient()
        .then((scope: WindowOrWorkerGlobalScope) => {
            return scope[installer].install(installGCPBody)
        })
        .then((scope: WindowOrWorkerGlobalScope) => {
            return (scope[symbol] as typeof Module).tsPlaygroundView({
                loadingScreenContainer: this,
                mode: this.getAttribute('default-mode'),
                src: this.getAttribute('src'),
                srcTest: this.getAttribute('src-test'),
                returnType: 'html',
            })
        })
        .then((element: HTMLElement) => {
            this.appendChild(element)
        })
}

// /**
//  * Each of the functions here will be copied in a <script> element in the canvas document
//  * No reference to external symbols is allowed.
//  * Implicit argument: 'this' variable is bound to the HTMLElement being rendered
//  */
// import type * as webpmModule from '@youwol/webpm-client'
// import { Lib } from '../types'
//
// export function renderTypeScript() {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias -- I strongly believe it helps readability
//     const htmlComponent: HTMLDivElement = this
//
//     // The cdn-client is provided by the hosting application (e.g. stories) which may not have been
//     // migrated to webpm-client yet.
//     const webpmClient: typeof webpmModule =
//         window['@youwol/webpm-client'] || window['@youwol/cdn-client']
//     htmlComponent.style.setProperty('position', 'relative')
//     const loadingScreen = new webpmClient.LoadingScreenView({
//         container: htmlComponent,
//         logo: `<div style='font-size:x-large'>TypeScript</div>`,
//         wrapperStyle: {
//             position: 'absolute',
//             top: '0',
//             left: '0',
//             width: '100%',
//             height: '100%',
//             'font-weight': 'bolder',
//         },
//     })
//     loadingScreen.render()
//     const promise = webpmClient
//         .install({
//             modules: [
//                 '@youwol/rx-tree-views#^0.3.1',
//                 'codemirror#^5.52.0',
//                 'typescript#^5.2.2',
//                 '@typescript/vfs#^1.4.0',
//             ],
//             scripts: [
//                 'codemirror#5.52.0~mode/javascript.min.js',
//                 'codemirror#5.52.0~addons/lint/lint.js',
//             ],
//             css: [
//                 'codemirror#5.52.0~codemirror.min.css',
//                 'codemirror#5.52.0~theme/blackboard.min.css',
//                 'codemirror#5.52.0~addons/lint/lint.css',
//             ],
//             onEvent: (ev) => {
//                 loadingScreen.next(ev)
//             },
//         })
//         .then((_) => {
//             return webpmClient.install({
//                 scripts: [
//                     '@youwol/grapes-coding-playgrounds#0.2.0-wip~dist/@youwol/grapes-coding-playgrounds/ts-playground.js',
//                 ],
//                 aliases: {
//                     lib: `@youwol/grapes-coding-playgrounds/ts-playground_APIv02`,
//                 },
//                 onEvent: (ev) => {
//                     loadingScreen.next(ev)
//                 },
//             })
//         }) as unknown as Promise<{ lib: Lib }>
//
//     promise.then(({ lib }) => {
//         loadingScreen.done()
//         lib.renderElement(htmlComponent)
//     })
// }
