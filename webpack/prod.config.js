require('babel-polyfill');

// Webpack config for creating the production bundle.
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');
var Visualizer = require('webpack-visualizer-plugin');
var serverName = require('../scripts/helpers/serverName');
var clientName = require('../scripts/helpers/clientName')();
var clientFileName = require('../scripts/helpers/clientFileName');
var config = require('../config.json');

var publicAssetsPath = path.join(__dirname, '../public');
var privateAssetsPath = path.join(__dirname, '../private');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

// http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var externalMatchers = [
    /.*/
];
var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
})
.forEach(function (mod) {
    externalMatchers.forEach(function(matcher) {
        if (matcher.test(mod)) {
            nodeModules[mod] = 'commonjs ' + mod;
        }
    });
});

var port = process.env.PORT || config.port;
if (!port) {
    throw new Error('No port specified! Please re-run command with a PORT env var present or a port in config.json.');
}

var baseWebpackConfig = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '..'),
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!postcss!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'html!svgo?useConfig=svgoConfig' },
            { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
        ]
    },
    svgoConfig: {
        plugins: [
            { cleanupIDs: false},
            {
                removeDesc: { removeAny: true }
            },
            { removeTitle: true },
            { sortAttrs: true }
        ]
    },
    postcss: function (webpack) {
        return [
            require("postcss-import")({ addDependencyTo: webpack }),
            require("postcss-url")(),
            require("postcss-cssnext")(),
            // add our "plugins" here
            // and if we want to compress,
            // just use css-loader option that already use cssnano under the hood
            require("postcss-browser-reporter")(),
            require("postcss-reporter")()
        ]
    },
    progress: true,
    resolve: {
        modulesDirectories: [
            'src',
            'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx']
    },
    plugins: [
        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};

module.exports = [Object.assign({}, baseWebpackConfig, {
    // This is the production client build
    entry: {
        client: './src/client.js'
    },
    output: {
        path: publicAssetsPath,
        filename: clientFileName('js'),
        chunkFilename: clientFileName('js')
    },
    plugins: baseWebpackConfig.plugins.concat([
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin(clientFileName('css'), {allChunks: true}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },

            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        webpackIsomorphicToolsPlugin,
        new Visualizer({
            filename: clientName + '.stats.html'
        })
    ])
}), Object.assign({}, baseWebpackConfig, {
    // This is the production server build
    target: 'node',
    node: {
        __dirname: true
    },
    entry: {
        'server': './src/server.js'
    },
    output: {
        path: privateAssetsPath,
        filename: serverName + '.js',
        chunkFilename: serverName + '.js'
    },
    plugins: baseWebpackConfig.plugins.concat([
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin(serverName + '.css', {allChunks: true}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                NODE_PATH: '"./src"',
                PORT: port,
                HOST: '"localhost"',
                NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED
            },

            __CLIENT__: false,
            __SERVER__: true,
            __DEVELOPMENT__: false
        })
    ]),
    externals: nodeModules
})];
