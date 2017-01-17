#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from '../helpers/exec';
import {
    getHelp,
    getIsHelp
} from '../helpers/options';

function main() {
    console.log('');
    console.log('Starting dev server'.blue);

    const serverCmd = 'node ./servers/dev-server.js';
    console.log(serverCmd.yellow);
    exec(serverCmd, {
        NODE_ENV: 'development',
        NODE_PATH: './src',
        ...process.env
    });
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Starts the dev webserver') :
    main();
