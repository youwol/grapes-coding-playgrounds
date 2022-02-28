import { render } from '@youwol/flux-view'
import { PlaygroundView } from '../common'
import { InterpretError } from '../common/errors.view'

function outputPython2Js(data) {
    if (!data) {
        return data
    }
    let recFct = (d) => {
        if (d instanceof Map) {
            let converted = {}
            d.forEach((v, k) => {
                converted[k] = recFct(v)
            })
            return converted
        }
        return d
    }
    const jsData = data.toJs && data.toJs()

    return recFct(jsData ? jsData : data)
}

export function renderElement(element: HTMLElement, pyodide) {
    const vDOM = new PlaygroundView({
        startingSrc: element.getAttribute('src'),
        testSrc: element.getAttribute('src-test'),
        language: 'python',
        toDisplayable: (obj) => {
            return outputPython2Js(obj)
        },
        executor: (src: string, debug) => {
            return run(src, debug, pyodide)
        },
    })
    element.appendChild(render(vDOM))
}

function run(src: string, debug: unknown, pyodide) {
    try {
        return pyodide.runPython(src)(debug)
    } catch (e) {
        return new InterpretError({
            exception: e,
            view: {
                innerText: e,
            },
        })
    }
}
