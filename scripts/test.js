#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import execWithArgs from './helpers/execWithArgs';
import {
    getHelp,
    getIsHelp,
    getOptions,
    registerFlags,
    registerFlagsFromChildren
} from './helpers/options';

const sanityCmds = [
    './scripts/security.js',
    './scripts/lint.js',
    './scripts/karma.js'
];

let flags = []; // eslint-disable-line

flags = flags.concat(registerFlags({
    name: 'skip-tests',
    type: Boolean,
    description: 'Skips the unit tests, linting, and security check'
}));

flags = flags.concat(registerFlagsFromChildren(sanityCmds));

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    if (!options['skip-tests']) {
        console.log('');
        console.log('Verifying code sanity'.blue);

        // If development, don't abort on failures, otherwise stop testing on failure
        const shouldAbort = process.env.NODE_ENV !== 'development' || process.env.CONTINUOUS_INTEGRATION;

        execWithArgs(sanityCmds, shouldAbort);

        console.log('Done verifying code sanity'.blue);
    } else {
        console.log('Skipping tests'.grey);
    }
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Runs the unit tests, nsp security check, and eslint check') :
    main();
