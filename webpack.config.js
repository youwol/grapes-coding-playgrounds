const path = require('path')
const pkg = require('./package.json')
const ROOT = path.resolve(__dirname, 'src')
const DESTINATION = path.resolve(__dirname, 'dist')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
    context: ROOT,
    entry: {
        editor: './lib/index.ts',
        'js-playground': './lib/runner/js-playground.ts',
        'ts-playground': './lib/runner/ts-playground.ts',
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './bundle-analysis.html',
            openAnalyzer: false,
        }),
    ],
    output: {
        publicPath:
            '/api/assets-gateway/raw/package/QHlvdXdvbC9ncmFwZXMtanMtcGxheWdyb3VuZA==/0.0.0-next/dist/',
        path: DESTINATION,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: pkg.name,
        filename: '[name].js',
        globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    resolve: {
        extensions: ['.ts', 'tsx', '.js'],
        modules: [ROOT, 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader' }],
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            root: '_',
        },
        rxjs: 'rxjs',
        'rxjs/operators': {
            commonjs: 'rxjs/operators',
            commonjs2: 'rxjs/operators',
            root: ['rxjs', 'operators'],
        },
        '@youwol/cdn-client': '@youwol/cdn-client',
        '@youwol/flux-view': '@youwol/flux-view',
        grapesjs: 'grapesjs',
        codemirror: 'CodeMirror',
        '@youwol/fv-tree': '@youwol/fv-tree',
        '@youwol/fv-group': '@youwol/fv-group',
    },
    devtool: 'source-map',
}
