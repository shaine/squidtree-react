import fetch from 'isomorphic-fetch';
import LRU from 'lru-cache';

export const WEATHER_LOAD = 'WEATHER_LOAD';
export const WEATHER_LOAD_SUCCESS = 'WEATHER_LOAD_SUCCESS';
export const WEATHER_LOAD_FAILURE = 'WEATHER_LOAD_FAILURE';

const cache = LRU({
    maxAge: 1000 * 60 * 60
});

export function loadWeather() {
    return async dispatch => {
        if (__SERVER__) {
            const {
                openWeatherAppId,
                openWeatherLocationId
            } = require('../../../config.json');

            dispatch({
                type: WEATHER_LOAD
            });

            try {
                let json = cache.get('weather');
                if (!json) {
                    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${openWeatherLocationId}&appid=${openWeatherAppId}&units=metric`);
                    json = await response.json();

                    cache.set('weather', json);
                }

                dispatch({
                    type: WEATHER_LOAD_SUCCESS,
                    content: json
                });
            } catch (error) {
                dispatch({
                    type: WEATHER_LOAD_FAILURE,
                    error
                });
            }
        }
    };
}
