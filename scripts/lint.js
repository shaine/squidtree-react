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
    name: 'skip-lint',
    type: Boolean,
    description: 'Skips the linter'
}));

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    if (!options['skip-lint']) {
        console.log('');
        console.log('Checking code style'.blue);

        const eslintCmd = './node_modules/.bin/eslint -c .eslintrc --quiet src bin scripts/*';
        console.log(eslintCmd.yellow);

        if (process.env.NODE_ENV === 'development') {
            exec(`${eslintCmd} || exit 0`);
        } else {
            exec(eslintCmd);
        }

        console.log('Done'.green);
    } else {
        console.log('Skipping checking code style'.grey);
    }
}

// Run help or script if running in CLI
if (!module.parent) getIsHelp() ? // eslint-disable-line
    getHelp('Lints/style checks source code using eslint') :
    main();
