import colors from 'colors';
import exec from './exec';
import {
    dryRun
} from './options';

// Only use this if the list of commands point to scripts living in the ./scripts dir
export default function (commands, andTasksTogether = true, env) {
    // Get the flags from argv
    const [nodeArg, fileArg, ...cliFlags] = process.argv; // eslint-disable-line no-unused-vars

    // Allow an array or individual comand to be passed in, but normalize to an array
    let commandList = commands;
    if (!Array.isArray(commandList)) {
        commandList = [commandList];
    }

    // Generate map of script path => flag array for script
    const scriptFlags = commandList.map(scriptPath => scriptPath.replace(/ .*/, ''))
        .reduce((scriptFlagsMemo, scriptPath) => {
            const scriptRelativePath = `${process.cwd()}/${scriptPath}`;
            const scriptFlags = require(scriptRelativePath).flags || []; // eslint-disable-line

            return {
                ...scriptFlagsMemo,
                [scriptPath]: scriptFlags
            };
        }, {});


    // Get a list of commands combined only with flags the command is capable
    // of understanding
    const commandListWithArgs = commandList.map(command => {
        const availableFlags = scriptFlags[command] || [];
        // XXX Any universally available flags which should flow down to child
        // scripts should be injected here, as children do not define them
        availableFlags.push(dryRun);

        // Run through all possible flags for this command
        const flagsString = availableFlags.reduce((flagStringMemo, availableFlag) => {
            const flagName = availableFlag.name;
            const flagAlias = availableFlag.alias;
            // Check if the flag or its alias are present in argv
            const flagLocation = cliFlags.indexOf(`--${flagName}`);
            const flagAliasLocation = cliFlags.indexOf(`-${flagAlias}`);
            // If found,
            if (flagLocation !== -1 || flagAliasLocation !== -1) {
                // Get the location of the arg
                const argLocation = flagLocation !== -1 ? flagLocation : flagAliasLocation;
                const argForFlag = cliFlags[argLocation];
                // Grab the following arg
                const nextArg = cliFlags[argLocation + 1];
                // Check if following arg is a value or another flag
                const flagArg = nextArg && nextArg.indexOf('-') !== 0 ?
                    nextArg :
                    '';

                // Concat the flag memo with the new flags
                return `${flagStringMemo} ${argForFlag} ${flagArg}`.trim();
            }

            // There was no hit for the current flag so move along
            return flagStringMemo;
        }, '');

        return `${command} ${flagsString}`;
    });

    // Determines whether a task failure should fail the whole chain
    const separator = andTasksTogether ? ' && ' : '; ';

    // Add the flags to the provided commands
    const commandString = commandListWithArgs.join(separator);

    // Run synchronously
    console.log(commandString.yellow);
    exec(commandString, env);
}
