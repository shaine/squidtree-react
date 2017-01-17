#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from './helpers/exec';
import {
    getHelp,
    getIsHelp,
    getOptions
} from './helpers/options';

let flags = []; // eslint-disable-line

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    console.log('');
    console.log('Running unit tests'.blue);

    let karmaCmd = './node_modules/.bin/karma start';
    if (options.verbose) {
        karmaCmd += ' --verbose';
    }

    console.log(karmaCmd.yellow);

    exec(karmaCmd);

    console.log('Done'.green);
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Run unit tests using Karma, mocha, and PhantomJS') :
    main();
