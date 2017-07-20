const CONFIG_LOAD = 'CONFIG_LOAD';
exports.CONFIG_LOAD = CONFIG_LOAD;

exports.loadConfig = function loadConfig(config) {
    return {
        type: CONFIG_LOAD,
        config
    };
}
