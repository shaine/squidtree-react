#!/usr/bin/env node_modules/.bin/babel-node
import colors from 'colors';
import exec from '../helpers/exec';
import {
    getHelp,
    getIsHelp,
    getOptions,
    registerFlags
} from '../helpers/options';

let flags = []; // eslint-disable-line

flags = flags.concat(registerFlags({
    name: 'skip-prod-build',
    type: Boolean,
    description: 'Skips the production build'
}));

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    if (!options['skip-prod-build']) {
        console.log('');
        console.log('Running production build'.blue);

        const buildCmd = './node_modules/.bin/webpack --verbose --colors --display-error-details --config webpack/prod.config.js';
        console.log(buildCmd.yellow);
        exec(buildCmd, {
            NODE_ENV: 'production',
            NODE_PATH: './src',
            ...process.env
        });
        console.log('Done running production build'.green);
    } else {
        console.log('Skipping running production build'.grey);
    }
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Runs the production webpack build') :
    main();
