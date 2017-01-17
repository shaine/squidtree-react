const getClientName = require('./clientName');

module.exports = function clientFileName(type, dropPrerelease) {
    const clientName = getClientName(dropPrerelease);

    return `${clientName}.min.${type}`;
};
