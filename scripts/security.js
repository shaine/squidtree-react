#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from './helpers/exec';
import {
    getHelp,
    getIsHelp
} from './helpers/options';

function main() {
    console.log('');
    console.log('npm security check'.blue);

    const npmCmd = './node_modules/.bin/nsp check';
    console.log(npmCmd.yellow);
    exec(npmCmd);
    console.log('Done'.green);
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Checks for security flaws in dependencies using nsp') :
    main();
