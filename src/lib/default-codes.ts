export const defaultExeSrcJs = `
return async ({debug}) => {
    
    const jsObject = { 
        title: 'hello js playground!'
    }
    debug({title: 'jsObject', data: jsObject})
    
    const div = document.createElement('div')
    div.innerText = "I'm an html div"
    div.classList.add('fv-text-focus', 'text-center', 'p-1', 'border', 'rounded')
    debug({title: 'htmlElement', data: div})
    
    return true
}
`
export const defaultTestSrcJs = `
return async (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}`

export const defaultExeSrcTs = `
return async ({debug}) => {
    
    class TsObject{
    
        public readonly title: string
        public readonly value: number
        constructor(title: string, value: number){
            this.title = title
            this.value = value
        }
    }
    const obj = new TsObject("hello", 5)
    debug({title: 'tsObject', data: obj})
       
    return true
}
`
export const defaultTestSrcTs = `
return async (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}`
