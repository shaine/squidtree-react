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
    name: 'perf',
    type: Boolean,
    description: 'Enables --prof node profiling flag for production server run'
}));

export { flags }; // eslint-disable-line

function main() {
    const options = getOptions();

    console.log('');
    console.log('Running production server'.blue);

    let interpreter = 'node';
    if (options.inspector) {
        interpreter = './node_modules/.bin/node-debug -b false';
        console.log(
            'Warning: Starting in debugger mode. Expect performance to be '.yellow +
            '30% of what it would otherwise be.'.yellow
        );
    }

    let serverCmd = './servers/prod-server.js';
    if (options.perf) {
        // I can't believe node cares about the order flags are passed
        serverCmd = `--prof ${serverCmd}`;
    }
    serverCmd = `${interpreter} ${serverCmd}`;

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
