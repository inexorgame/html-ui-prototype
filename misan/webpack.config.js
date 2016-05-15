var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
}

module.exports = {
    cache: true,
    entry: {
        app: PATHS.src
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                include: /src/,
                loader: 'style!css!less'
            },
            {
                test: /\.(jpe?g|png|gif|svg|mp4)$/i,
                loader:'file-loader'
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
                },
                {
                    from: 'index.html',
                    context: './src/'
                }
            ]
        ),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ],
    devServer: {
        port: 8080,
        outputPath: PATHS.build,
        contentBase: PATHS.build,
        historyApiFallback: true,
        inline: true,
        progress: true,
    },
    devtool: "source-map"
}
