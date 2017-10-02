import _get from 'lodash/get';
import _identity from 'lodash/identity';
import { colorOfAir } from 'the-color-of-air-continuous';
import {
    createSelector
} from 'reselect';
import {
    WEATHER_LOAD_SUCCESS
} from './actions';

export function colorReducer(state = {}, action) {
    switch (action.type) {
        case WEATHER_LOAD_SUCCESS: {
            const temperature = _get(action, 'content.main.temp');

            return {
                temperature,
                temperatureMin: _get(action, 'content.main.temp_min'),
                temperatureMax: _get(action, 'content.main.temp_max'),
                color: colorOfAir('c', temperature)
            };
        }

        default: {
            return state;
        }
    }
}

export const getCurrentColor = createSelector(
    _identity,
    state => _get(state, 'temperature.color')
);
