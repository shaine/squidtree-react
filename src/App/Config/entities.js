const _isEqual = require('lodash/isEqual');
const _get = require('lodash/get');
const { createSelector } = require('reselect');
const {
    CONFIG_LOAD
} = require('./actions');

exports.configReducer = function configReducer(state = {}, action) {
    switch (action.type) {
        case CONFIG_LOAD: {
            // We don't care about the old config, just replace it
            const newState = {
                ...action.config
            };

            return _isEqual(state, newState) ? state : newState;
        }

        default:
            return state;
    }
};

const getConfig = createSelector(
    state => state,
    state => _get(state, 'config', {})
);
exports.getConfig = getConfig;

const getConfigByName = createSelector(
    getConfig,
    (state, name) => name,
    _get
);
exports.getConfigByName = getConfigByName;
