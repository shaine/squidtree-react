#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from './helpers/exec';
import {
    getHelp,
    getIsHelp,
    getOptions,
    registerFlags
} from './helpers/options';

let flags = []; // eslint-disable-line

flags = flags.concat(registerFlags({
    name: 'skip-mocha',
    type: Boolean,
    description: 'Skips mocha'
}));

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    if (!options['skip-mocha']) {
        console.log('');
        console.log('Running unit tests'.blue);

        const mochaCmd = './node_modules/.bin/mocha -w -R spec src/**/*.test.js';
        console.log(mochaCmd.yellow);

        exec(mochaCmd);

        console.log('Done'.green);
    } else {
        console.log('Skipping running unit tests'.grey);
    }
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Runs the unit tests') :
    main();
