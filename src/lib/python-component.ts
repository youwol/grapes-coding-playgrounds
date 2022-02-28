import * as grapesjs from 'grapesjs'
import { componentFactoryBase } from './utils'

import { renderPython } from './runner/python/renderer'

import { defaultExeSrcPython, defaultTestSrcPython } from './default-codes'

export function addPythonComponent(editor: grapesjs.Editor) {
    const componentType = 'python-playground'
    let base = componentFactoryBase({
        componentType,
        language: 'python',
        grapesEditor: editor,
        canvasRendering: renderPython,
        defaultExeSrc: defaultExeSrcPython,
        defaultTestSrc: defaultTestSrcPython,
    })
    const packages = ['numpy', 'pandas']
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
