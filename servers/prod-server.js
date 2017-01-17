#!/usr/bin/env node
/* eslint-env node */
/* eslint global-require:0 */
/* eslint no-var:0 */
/* eslint prefer-arrow-callback: 0 */
var path = require('path');
var serverName = require('../scripts/helpers/serverName');

var rootDir = path.resolve(__dirname, '..');
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

// XXX Global constants used to be redundantly defined here, they've been
// consolidated into webpack/prod.config.js in the production server build config.

global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'));

/* eslint-disable func-names */
global.webpackIsomorphicTools.server(rootDir, function () {
    require('../private/' + serverName); // eslint-disable-line prefer-template, import/no-dynamic-require
});
/* eslint-enable func-names */
