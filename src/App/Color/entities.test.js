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
                        temperature: 12.02,
                        temperatureMin: 9,
                        temperatureMax: 14,
                        color: '#e06018'
                    });
            });
        });
    });

    describeSimpleSelector('getCurrentColor', getCurrentColor, 'temperature.color');
});
