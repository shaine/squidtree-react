/* eslint-disable */
import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import {
    loadWeather,
    WEATHER_LOAD,
    WEATHER_LOAD_SUCCESS,
    WEATHER_LOAD_FAILURE
} from './actions';

chai.use(chaiSubset);

describe('Color actions', () => {
    describe('loadWeather', () => {
        it('dispatches a successful response');

        it('dispatches a failed response');
    });
});
