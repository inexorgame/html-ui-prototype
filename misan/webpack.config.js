var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
    cache: true,
    entry: {
        app: './src/index.js',
        vendor: './src/vendor.js',
    },
    output: {
        path: './dist/',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                include: /src/,
                loader: 'style!css!less'
            },
            { test: /\.html$/, include: /src/, loader: 'riotjs' },
            { test: /\.js$/, include: /src/, loader: 'babel', query: { presets: 'es2015-riot' } },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            riot: 'riot'
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: 'assets/**',
                    context: './src/'
                }
            ]
        ),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ],
    devServer: {
        port: 8080,
        outputPath: './dist/',
    },
    devtool: "source-map"
}
