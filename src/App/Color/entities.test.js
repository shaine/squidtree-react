/* eslint-disable */
import sinon from 'sinon';
import { expect } from 'chai';
import {
    colorReducer,
    getCurrentColor
} from './entities';
import itReturnsTheSameStateIdentityWhenNoStateChange from '../../helpers/itReturnsTheSameStateIdentityWhenNoStateChange';
import describeSimpleSelector from '../../helpers/describeSimpleSelector';
import deepFreeze from 'deep-freeze';

const weatherLoadSuccessAction = {
    type: 'WEATHER_LOAD_SUCCESS',
    content: {
        main: {
            temp: 12.02,
            temp_min: 9,
            temp_max: 14
        }
    }
};
deepFreeze(weatherLoadSuccessAction);

describe('Color entities', () => {
    describe('colorReducer', () => {
        itReturnsTheSameStateIdentityWhenNoStateChange(colorReducer);

        describe('WEATHER_LOAD_SUCCESS', () => {
            itReturnsTheSameStateIdentityWhenNoStateChange(colorReducer, 'WEATHER_LOAD_SUCCESS');

            it('stores the current temperature and color', () => {
                expect(colorReducer({}, weatherLoadSuccessAction))
                    .to.eql({
                        temperature: 11.5,
                        temperatureMin: 9,
                        temperatureMax: 14,
                        temperatureCurrent: 12.02,
                        color: '#f8be29'
                    });
            });
        });
    });

    describeSimpleSelector('getCurrentColor', getCurrentColor, 'temperature.color');
});
