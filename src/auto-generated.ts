
const runTimeDependencies = {
    "load": {
        "@youwol/flux-view": "^1.0.3",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.2"
    },
    "differed": {
        "typescript": "^4.7.4",
        "@typescript/vfs": "^1.3.5",
        "codemirror": "^5.52.0",
        "@youwol/fv-tree": "^0.2.3"
    },
    "includedInBundle": [
        "@typescript/vfs"
    ]
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
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "@youwol/fv-tree": {
        "apiKey": "02",
        "exportedSymbol": "@youwol/fv-tree"
    }
}
export const setup = {
    name:'@youwol/grapes-coding-playgrounds',
        assetId:'QHlvdXdvbC9ncmFwZXMtY29kaW5nLXBsYXlncm91bmRz',
    version:'0.1.1',
    shortDescription:"Various components for grapes for live coding in different languages.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/grapes-coding-playgrounds',
    npmPackage:'https://www.npmjs.com/package/@youwol/grapes-coding-playgrounds',
    sourceGithub:'https://github.com/youwol/grapes-coding-playgrounds',
    userGuide:'https://l.youwol.com/doc/@youwol/grapes-coding-playgrounds',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    }
}
