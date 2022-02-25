import * as grapesjs from 'grapesjs'

export function addBlocks(editor: grapesjs.Editor) {
    console.log('grapes-js-playground.addBlocks')
    editor.BlockManager.add('javascript-playground', {
        label: 'JavaScript Playground',
        category: {
            id: 'Education',
            label: 'Education',
            open: false,
        },
        content: {
            type: 'javascript-playground',
        },
        render({ el }: { el: HTMLElement }) {
            el.classList.add('gjs-fonts', 'gjs-f-b2')
        },
    })
    editor.BlockManager.add('typescript-playground', {
        label: 'TypeScript Playground',
        category: {
            id: 'Education',
            label: 'Education',
            open: false,
        },
        content: {
            type: 'typescript-playground',
        },
        render({ el }: { el: HTMLElement }) {
            el.classList.add('gjs-fonts', 'gjs-f-b2')
        },
    })
    editor.BlockManager.add('python-playground', {
        label: 'Python Playground',
        category: {
            id: 'Education',
            label: 'Education',
            open: false,
        },
        content: {
            type: 'python-playground',
        },
        render({ el }: { el: HTMLElement }) {
            el.classList.add('gjs-fonts', 'gjs-f-b2')
        },
    })
}
