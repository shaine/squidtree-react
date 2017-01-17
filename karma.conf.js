const webpack = require('webpack');
const path = require('path');
const argv = require('yargs').argv;

const karmaConfig = {
    browsers: ['PhantomJS'],

    frameworks: ['mocha', 'sinon'],

    files: [
        // This file will find and execute all of the tests
        'tests.webpack.js'
    ],

    preprocessors: {
        'tests.webpack.js': [
            'webpack',
            'sourcemap'
        ]
    },

    reporters: ['dots'],

    plugins: [
        require('karma-webpack'),
        require('karma-mocha'),
        require('karma-phantomjs-launcher'),
        require('karma-sourcemap-loader'),
        require('karma-sinon')
    ],

    client: {
        captureConsole: true,
        mocha: {
            fullTrace: true
        }
    },

    webpack: {
        devtool: '#module-inline-source-map',
        devtoolLineToLine: true,

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: [
                        path.resolve('node_modules/'),
                        path.resolve('public/'),
                        /\.story\.js$/
                    ],
                    loaders: ['babel', 'eslint-loader']
                },
                { test: /\.json$/, loader: 'json' },
                { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&localIdentName=[local]!postcss!less?outputStyle=expanded' },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'html!svgo' }
            ]
        },

        eslint: {
            failOnError: true,
            failOnWarning: true
        },

        externals: {
            'react/addons': true,
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true
        },

        resolve: {
            modulesDirectories: [
                'src',
                'node_modules'
            ],
            extensions: ['', '.json', '.js']
        },

        plugins: [
            function () {
                this.plugin('done', function (stats) {
                    if (stats.compilation.warnings.length) {
                        // Log each of the warnings
                        stats.compilation.warnings.forEach(function (warning) {
                            console.log(warning.message || warning);
                        });

                        // Pretend no assets were generated. This prevents the tests
                        // from running making it clear that there were warnings.
                        stats.stats = [{
                            toJson: function () {
                                return this;
                            },
                            assets: []
                        }];
                    }
                });
            },
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                __CLIENT__: true,
                __SERVER__: false,
                __DEVELOPMENT__: true
            })
        ]
    },

    webpackServer: {
        noInfo: true
    }
};

module.exports = function (config) {
    config.set(karmaConfig);
};
