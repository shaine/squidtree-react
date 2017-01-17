#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from '../helpers/exec';
import {
    getHelp,
    getIsHelp
} from '../helpers/options';

function main() {
    const watchCmd = 'node webpack/webpack-dev-server.js';
    console.log(watchCmd.yellow);
    exec(watchCmd, {
        NODE_ENV: 'development',
        NODE_PATH: './src',
        ...process.env
    });
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Starts the webpack dev server for hot reloading changed files') :
    main();
