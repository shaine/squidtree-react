#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from '../helpers/exec';
import {
    getHelp,
    getIsHelp
} from '../helpers/options';

let flags = []; // eslint-disable-line

export { flags }; // eslint-disable-line

function main() {
    console.log('');
    console.log('Running production server'.blue);

    const serverCmd = 'node ./servers/prod-server.js';

    console.log(serverCmd.yellow);
    exec(serverCmd, {
        NODE_ENV: 'production',
        NODE_PATH: './src',
        ...process.env
    });
    console.log('Done running production server'.green);
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Starts the production server') :
    main();
