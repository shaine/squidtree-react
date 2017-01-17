const semver = require('semver');
const pkg = require('../../package');

module.exports = function getClientName(dropPrerelease) {
    const dropPrereleaseBoolean = !!dropPrerelease;

    const clientName = pkg.name;
    const version = pkg.version;

    // If told to, and this is a prerelease, let's drop the RC postfix
    const finalVersion = dropPrereleaseBoolean && version.indexOf('rc') !== -1 ?
        semver.inc(version, 'patch') :
        version;

    return `${clientName}.${finalVersion}`;
};
