import type * as Module from '../../../index'
/**
 * This functions will be copied in a <script> element in the canvas document.
 * NO REFERENCE TO EXTERNAL SYMBOLS IS ALLOWED (besides types).
 */
export function renderJavaScript() {
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
            return (scope[symbol] as typeof Module).jsPlaygroundView({
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
