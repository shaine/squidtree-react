#!/usr/bin/env node

// eslint-disable prefer-import
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const babelRegister = require('babel-register');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = true;

// Hot reload the process when files change
if (!require('piping')({
    hook: true,
    ignore: /(\/\.|~$|\.json$)/i
})) {
    return;
}

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'));

// enable runtime transpilation to use ES6/7 in node

const babelrc = fs.readFileSync('./.babelrc');

try {
    const config = JSON.parse(babelrc);
    babelRegister(config);
} catch (err) {
    console.error('==>         ERROR: Error parsing your .babelrc.');
    console.error(err);
}

global.webpackIsomorphicTools.server(rootDir, () => {
    require('../src/server');
});
