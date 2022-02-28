import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'

import { renderPython } from './runner/python/renderer'

const defaultExeSrc = `
import sys

class PythonObject:
    def __init__(self, title, value):
        self.title = title
        self.value = value
    
def processing(debug):    

    obj = PythonObject("hello", 5)
    print(obj)
    debug("pythonObject", obj.__dict__)
    return True
    
processing
`

const defaultTestSrc = `
def test(result, expect) => {
    expect("A dummy passing test", true)
    return true
}
test
`

export function addPythonComponent(editor: grapesjs.Editor) {
    const componentType = 'python-playground'
    let base = componentFactoryBase({
        componentType,
        language: 'python',
        grapesEditor: editor,
        canvasRendering: renderPython,
        defaultExeSrc: defaultExeSrc,
        defaultTestSrc: defaultTestSrc,
    })
    const packages = ['numpy', 'pandas', 'scikit-learn']
    packages.forEach((name) => {
        base.model.defaults.traits.push({
            type: 'checkbox',
            name,
            label: name,
            value: false,
        })
    })

    base.model.initialize = function () {
        packages.forEach((name) => {
            this.on(`change:attributes:${name}`, () => {
                this.view.render()
            })
        })
    }
    editor.DomComponents.addType(componentType, base)
}
