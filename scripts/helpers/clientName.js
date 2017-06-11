const pkg = require('../../package');

module.exports = function getClientName() {
    const clientName = pkg.name;
    const version = pkg.version;

    return `${clientName}.${version}`;
};
