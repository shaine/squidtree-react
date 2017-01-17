import commandLineArgs from 'command-line-args';
import getUsage from 'command-line-usage';
import { flatten as _flatten } from 'lodash';

export const dryRun = {
    name: 'dry-run',
    type: Boolean,
    description: 'Runs all tasks, but prevents them from submitting information to external systems'
};

export const verbose = {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Enables verbose logging'
};

const help = {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Displays this message'
};

const registeredFlags = [];

export function registerFlags(...flagArgs) {
    let flags = flagArgs;
    // Handle an array of flags instead of a splat, if provided
    if (Array.isArray(flagArgs[0])) {
        flags = flagArgs[0];
    }

    flags.forEach(flag => {
        // If this flag doesn't already exist by name
        if (!registeredFlags.find(registeredFlag => registeredFlag.name === flag.name)) {
            registeredFlags.push(flag);
        }
    });

    return flags;
}

export function registerFlagsFromChildren(scriptPathsArg) {
    let scriptPaths = scriptPathsArg;

    // Standardize into an array
    if (!Array.isArray(scriptPaths)) {
        scriptPaths = [scriptPathsArg];
    }

    // Normalize file paths, then require each module. Each module should
    // register its flags and abort. We're pulling in the exported flags from
    // the module if they exist
    const scripts = scriptPaths.map(scriptPath => scriptPath.replace(/ .*/, ''))
        .map(scriptPath => `${process.cwd()}/${scriptPath}`)
        .map(scriptPath => require(scriptPath).flags || []); // eslint-disable-line

    // This is the list of all flag definitions used by the tree of scripts
    // we're evaluating
    return _flatten(scripts);
}

export function getOptions() {
    return commandLineArgs([...registeredFlags, dryRun, help]);
}

export function getIsHelp() {
    return process.argv.includes('--help') || process.argv.includes(' -h');
}

export function getHelp(description) {
    const scriptPath = process.argv[1];
    const scriptyPath = scriptPath.replace(/.*scripts\/(.*)\.js/, '$1');
    const scriptyNpmScript = scriptyPath.replace(/\//g, ':');

    const helpInfo = [{
        header: `npm run ${scriptyNpmScript}`,
        content: description
    }, {
        header: 'Synopsis',
        content: `$ npm run ${scriptyNpmScript} --[bold]{ }[[bold]{--help}]...\n` +
            `$ ./scripts/${scriptyPath}.js [[bold]{--help}]...`
    }, {
        header: 'Options',
        optionList: [...registeredFlags, dryRun, help]
    }];

    const usage = getUsage(helpInfo);
    console.log(usage);
}
