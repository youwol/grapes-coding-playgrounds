
const runTimeDependencies = {
    "externals": {
        "@youwol/rx-vdom": "^1.0.1",
        "rxjs": "^7.5.6",
        "@youwol/webpm-client": "^3.0.1",
        "codemirror": "^5.52.0",
        "@youwol/rx-tree-views": "^0.3.1",
        "@youwol/webpm-pyodide-loader": "^0.2.0",
        "typescript": "5.2.2",
        "@typescript/vfs": "^1.4.0"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/rx-vdom": {
        "commonjs": "@youwol/rx-vdom",
        "commonjs2": "@youwol/rx-vdom",
        "root": "@youwol/rx-vdom_APIv1"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv7"
    },
    "@youwol/webpm-client": {
        "commonjs": "@youwol/webpm-client",
        "commonjs2": "@youwol/webpm-client",
        "root": "@youwol/webpm-client_APIv3"
    },
    "codemirror": {
        "commonjs": "codemirror",
        "commonjs2": "codemirror",
        "root": "CodeMirror_APIv5"
    },
    "@youwol/rx-tree-views": {
        "commonjs": "@youwol/rx-tree-views",
        "commonjs2": "@youwol/rx-tree-views",
        "root": "@youwol/rx-tree-views_APIv03"
    },
    "@youwol/webpm-pyodide-loader": {
        "commonjs": "@youwol/webpm-pyodide-loader",
        "commonjs2": "@youwol/webpm-pyodide-loader",
        "root": "@youwol/webpm-pyodide-loader_APIv02"
    },
    "typescript": {
        "commonjs": "typescript",
        "commonjs2": "typescript",
        "root": "ts_APIv5"
    },
    "@typescript/vfs": {
        "commonjs": "@typescript/vfs",
        "commonjs2": "@typescript/vfs",
        "root": "@typescript/vfs_APIv1"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv7",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    },
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "@youwol/rx-tree-views": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/rx-tree-views"
    },
    "@youwol/webpm-pyodide-loader": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/webpm-pyodide-loader"
    },
    "typescript": {
        "apiKey": "5",
        "exportedSymbol": "ts"
    },
    "@typescript/vfs": {
        "apiKey": "1",
        "exportedSymbol": "@typescript/vfs"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "@youwol/rx-vdom",
        "rxjs",
        "@youwol/webpm-client"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {
    "js-playground": {
        "entryFile": "./lib/runner/javascript/js-playground.ts",
        "loadDependencies": [
            "@youwol/rx-tree-views",
            "codemirror"
        ],
        "name": "js-playground"
    },
    "py-playground": {
        "entryFile": "./lib/runner/python/py-playground.ts",
        "loadDependencies": [
            "@youwol/rx-tree-views",
            "codemirror",
            "@youwol/webpm-pyodide-loader"
        ],
        "name": "py-playground"
    },
    "ts-playground": {
        "entryFile": "./lib/runner/typescript/ts-playground.ts",
        "loadDependencies": [
            "@youwol/rx-tree-views",
            "codemirror",
            "typescript",
            "@typescript/vfs"
        ],
        "name": "ts-playground"
    }
}

const entries = {
     '@youwol/grapes-coding-playgrounds': './index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/grapes-coding-playgrounds/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/grapes-coding-playgrounds',
        assetId:'QHlvdXdvbC9ncmFwZXMtY29kaW5nLXBsYXlncm91bmRz',
    version:'0.3.0-wip',
    shortDescription:"Various components for grapes for live coding in different languages.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/grapes-coding-playgrounds&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/grapes-coding-playgrounds',
    sourceGithub:'https://github.com/youwol/grapes-coding-playgrounds',
    userGuide:'https://l.youwol.com/doc/@youwol/grapes-coding-playgrounds',
    apiVersion:'03',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/grapes-coding-playgrounds_APIv03`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/grapes-coding-playgrounds#0.3.0-wip~dist/@youwol/grapes-coding-playgrounds/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/grapes-coding-playgrounds/${entry.name}_APIv03`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
