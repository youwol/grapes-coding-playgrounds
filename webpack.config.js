const apiVersion = '003'
const externals = {
    '@youwol/flux-view': '@youwol/flux-view_APIv01',
    rxjs: 'rxjs_APIv6',
    '@youwol/cdn-client': '@youwol/cdn-client_APIv01',
    grapesjs: 'grapesjs_APIv018',
    typescript: 'ts_APIv4',
    codemirror: 'CodeMirror_APIv5',
    '@youwol/fv-tree': '@youwol/fv-tree_APIv01',
    'rxjs/operators': {
        commonjs: 'rxjs/operators',
        commonjs2: 'rxjs/operators',
        root: ['rxjs_APIv6', 'operators'],
    },
}
const path = require('path')
const pkg = require('./package.json')
const ROOT = path.resolve(__dirname, 'src')
const DESTINATION = path.resolve(__dirname, 'dist')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const assetId = Buffer.from(pkg.name).toString('base64')

module.exports = {
    context: ROOT,
    entry: {
        [pkg.name]: './lib/index.ts',
        [pkg.name + '/js-playground']:
            './lib/runner/javascript/js-playground.ts',
        [pkg.name + '/ts-playground']:
            './lib/runner/typescript/ts-playground.ts',
        [pkg.name + '/python-playground']:
            './lib/runner/python/python-playground.ts',
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './bundle-analysis.html',
            openAnalyzer: false,
        }),
    ],
    output: {
        path: DESTINATION,
        publicPath: `/api/assets-gateway/raw/package/${assetId}/${pkg.version}/dist/`,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: `[name]_APIv${apiVersion}`,
        devtoolNamespace: `${pkg.name}_APIv${apiVersion}`,
        filename: '[name].js',
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    resolve: {
        extensions: ['.ts', 'tsx', '.js'],
        modules: [ROOT, 'node_modules'],
    },
    externals,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader' }],
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'source-map',
}
