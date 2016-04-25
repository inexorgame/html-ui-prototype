var webpack = require('webpack')

module.exports = {
    cache: true,
    entry: {
        app: './src/index.js',
        vendor: './src/vendor.js',
    },
    output: {
        path: './dist/',
        publicPath: '/dist/',
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
                test: /\.(jpe?g|png|gif|svg)$/i,
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
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ],
    devServer: {
        port: 8080
    },
    devtool: "source-map"
}
