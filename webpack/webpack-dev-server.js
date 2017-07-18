var Express = require('express');
var webpack = require('webpack');
var config = require('../config.json');

var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = process.env.DEV_HOST || config.devHost;
if (!host) {
    throw new Error('No host specified! Please re-run command with a DEV_HOST env var present or a devHost in config.json.');
}
var port = process.env.DEV_PORT || config.devPort;
if (!port) {
    throw new Error('No port specified! Please re-run command with a DEV_PORT env var present or a devPort in config.json.');
}

var serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('==> 🚧    Webpack development server listening on port %s', port);
    }
});
