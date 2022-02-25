export const defaultExeSrcJs = `
return async ({debug}) => {
    
    const jsObject = { 
        title: 'hello js playground!'
    }
    debug('jsObject', jsObject)
    
    const div = document.createElement('div')
    div.innerText = "I'm an html div"
    div.classList.add('fv-text-focus', 'text-center', 'p-1', 'border', 'rounded')
    debug('htmlElement', div)
    
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
    debug('tsObject', obj)
       
    return true
}
`
export const defaultTestSrcTs = `
return async (result, {expect}) => {
    expect("A dummy passing test", true)
    return true
}`

export const defaultExeSrcPython = `
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

export const defaultTestSrcPython = `
def test(result, expect) => {
    expect("A dummy passing test", true)
    return true
}
test
`
