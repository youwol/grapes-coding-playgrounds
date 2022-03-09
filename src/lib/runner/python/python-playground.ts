import { render } from '@youwol/flux-view'
import {
    CodeEditorView,
    Displayable,
    PlaygroundView,
    SplitMode,
} from '../common'
import { InterpretError } from '../common/errors.view'
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs'

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
        if (Array.isArray(d)) {
            return d.map((v) => {
                return recFct(v)
            })
        }
        return d
    }
    const jsData = data.toJs && data.toJs()
    return recFct(jsData || data)
}

export function renderElement(element: HTMLElement, pyodide) {
    const uid = Math.floor(Math.random() * 10000)

    window['cdn_client'] = window['@youwol/cdn-client']
    window['js_bridge'] = {
        js: (obj) => outputPython2Js(obj),
        new: (T, ...p) => new T(...p),
        call: (obj: unknown, method: string, ...args) => obj[method](...args),
    }

    console.log('pyodide', { uid, pyodide })
    const startingSrc = element.getAttribute('src')
    const vDOM = new PlaygroundView({
        testSrc: element.getAttribute('src-test'),
        splitMode:
            (element.getAttribute('default-mode') as SplitMode) || 'split',
        codeEditorView: new CodeEditorView({
            src$: new BehaviorSubject(startingSrc),
            language: 'python',
        }),
        toDisplayable: (obj) => {
            return outputPython2Js(obj)
        },
        executor: (src: string, debug) => {
            return run(src, uid, debug, pyodide)
        },
    })
    element.appendChild(render(vDOM))
}

function run(
    src: string,
    uid: number,
    args: unknown,
    pyodide,
): Observable<Displayable> | Displayable {
    try {
        console.log('Run python code', { src, args, uid })
        let fct = pyodide.runPython(src)(args)
        const output$ = new ReplaySubject(1)
        pyodide.globals.set(`fct_${uid}`, fct)
        pyodide.globals.set(`output_${uid}`, output$)
        pyodide.runPythonAsync(`
import asyncio
from typing import Awaitable

if isinstance(fct_${uid}, Awaitable):
    result = await fct_${uid}
    output_${uid}.next(result)
else:
    output_${uid}.next(fct_${uid})
`)
        output$.subscribe(() => {
            pyodide.globals.delete(`fct_${uid}`)
            pyodide.globals.delete(`output_${uid}`)
        })
        return output$ as Observable<Displayable>
    } catch (e) {
        return new InterpretError({
            exception: e,
            view: {
                innerText: e,
            },
        }) as unknown as Displayable
    }
}
