
const runTimeDependencies = {
    "externals": {
        "@youwol/flux-view": "^1.0.3",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.2",
        "typescript": "^4.7.4",
        "@typescript/vfs": "^1.3.5",
        "codemirror": "^5.52.0",
        "@youwol/fv-tree": "^0.2.3"
    },
    "includedInBundle": {
        "@typescript/vfs": "^1.3.5"
    }
}
const externals = {
    "@youwol/flux-view": {
        "commonjs": "@youwol/flux-view",
        "commonjs2": "@youwol/flux-view",
        "root": "@youwol/flux-view_APIv1"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv6"
    },
    "@youwol/cdn-client": {
        "commonjs": "@youwol/cdn-client",
        "commonjs2": "@youwol/cdn-client",
        "root": "@youwol/cdn-client_APIv1"
    },
    "typescript": {
        "commonjs": "typescript",
        "commonjs2": "typescript",
        "root": "ts_APIv4"
    },
    "@typescript/vfs": {
        "commonjs": "@typescript/vfs",
        "commonjs2": "@typescript/vfs",
        "root": "@typescript/vfs_APIv1"
    },
    "codemirror": {
        "commonjs": "codemirror",
        "commonjs2": "codemirror",
        "root": "CodeMirror_APIv5"
    },
    "@youwol/fv-tree": {
        "commonjs": "@youwol/fv-tree",
        "commonjs2": "@youwol/fv-tree",
        "root": "@youwol/fv-tree_APIv02"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "typescript": {
        "apiKey": "4",
        "exportedSymbol": "ts"
    },
    "@typescript/vfs": {
        "apiKey": "1",
        "exportedSymbol": "@typescript/vfs"
    },
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "@youwol/fv-tree": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-tree"
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types -- allow to allow no secondary entries
const mainEntry : Object = {
    "entryFile": "./index.ts",
    "loadDependencies": [
        "@youwol/flux-view",
        "rxjs",
        "@youwol/cdn-client"
    ]
}

// eslint-disable-next-line @typescript-eslint/ban-types -- allow to allow no secondary entries
const secondaryEntries : Object = {}
const entries = {
     '@youwol/grapes-coding-playgrounds': './index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/grapes-coding-playgrounds/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/grapes-coding-playgrounds',
        assetId:'QHlvdXdvbC9ncmFwZXMtY29kaW5nLXBsYXlncm91bmRz',
    version:'0.1.2-wip',
    shortDescription:"Various components for grapes for live coding in different languages.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/grapes-coding-playgrounds',
    npmPackage:'https://www.npmjs.com/package/@youwol/grapes-coding-playgrounds',
    sourceGithub:'https://github.com/youwol/grapes-coding-playgrounds',
    userGuide:'https://l.youwol.com/doc/@youwol/grapes-coding-playgrounds',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{cdnClient, installParameters?}) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry['loadDependencies'].map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/grapes-coding-playgrounds_APIv01`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{name: string, cdnClient, installParameters?}) => {
        const entry = secondaryEntries[name]
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/grapes-coding-playgrounds#0.1.2-wip~dist/@youwol/grapes-coding-playgrounds/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/grapes-coding-playgrounds/${entry.name}_APIv01`]
        })
    }
}
