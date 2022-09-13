
const runTimeDependencies = {
    "load": {
        "@youwol/flux-view": "^1.0.0",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.0"
    },
    "differed": {
        "typescript": "^4.7.4",
        "@typescript/vfs": "^1.3.5",
        "codemirror": "^5.52.0",
        "@youwol/fv-tree": "^0.2.0"
    },
    "includedInBundle": [
        "@typescript/vfs"
    ]
}
const externals = {
    "@youwol/flux-view": "@youwol/flux-view_APIv1",
    "rxjs": "rxjs_APIv6",
    "@youwol/cdn-client": "@youwol/cdn-client_APIv1",
    "typescript": "ts_APIv4",
    "codemirror": "CodeMirror_APIv5",
    "@youwol/fv-tree": "@youwol/fv-tree_APIv02",
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
export const setup = {
    name:'@youwol/grapes-coding-playgrounds',
    assetId:'QHlvdXdvbC9ncmFwZXMtY29kaW5nLXBsYXlncm91bmRz',
    version:'0.1.0',
    shortDescription:"Various components for grapes for live coding in different languages.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/grapes-coding-playgrounds',
    npmPackage:'https://www.npmjs.com/package/@youwol/grapes-coding-playgrounds',
    sourceGithub:'https://github.com/youwol/grapes-coding-playgrounds',
    userGuide:'https://l.youwol.com/doc/@youwol/grapes-coding-playgrounds',
    apiVersion:'01',
    runTimeDependencies,
    externals
}
