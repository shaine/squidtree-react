import fetch from 'isomorphic-fetch';

export const WEATHER_LOAD = 'WEATHER_LOAD';
export const WEATHER_LOAD_SUCCESS = 'WEATHER_LOAD_SUCCESS';
export const WEATHER_LOAD_FAILURE = 'WEATHER_LOAD_FAILURE';

export function loadWeather() {
    return async dispatch => {
        dispatch({
            type: WEATHER_LOAD
        });

        try {
            const response = await fetch('http://api.openweathermap.org/data/2.5/weather?id=5780993&appid=d79cc69d29449a84fa71c696c46723b7&units=metric');
            const json = await response.json();

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
    };
}
