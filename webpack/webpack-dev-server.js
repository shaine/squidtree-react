var Express = require('express');
var webpack = require('webpack');

var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = process.env.DEV_HOST;
if (!host) {
    throw new Error('No host specified! Please re-run command with a DEV_HOST env var present.');
}
var port = process.env.DEV_PORT;
if (!port) {
    throw new Error('No port specified! Please re-run command with a DEV_PORT env var present.');
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
