const getClientName = require('./clientName');

module.exports = function clientFileName(type) {
    const clientName = getClientName();

    return `${clientName}.min.${type}`;
};
