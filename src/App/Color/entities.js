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
            const temperatureMin = _get(action, 'content.main.temp_min');
            const temperatureMax = _get(action, 'content.main.temp_max');
            const temperatureCurrent = _get(action, 'content.main.temp');
            const temperatureAverage = (temperatureMin + temperatureMax) / 2;
            console.log(temperatureMin, temperatureMax, temperatureAverage);

            return {
                temperature: temperatureAverage,
                temperatureMin,
                temperatureMax,
                temperatureCurrent,
                color: colorOfAir('c', temperatureAverage)
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
