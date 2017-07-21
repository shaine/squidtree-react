import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import { createSelector } from 'reselect';
import {
    CONFIG_LOAD
} from './actions';

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
