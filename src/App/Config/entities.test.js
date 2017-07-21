import { describe, it } from 'mocha';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import deepFreeze from 'deep-freeze';
import {
    configReducer,
    getConfig,
    getConfigByName
} from './entities';
import {
    CONFIG_LOAD
} from './actions';
import itReturnsTheSameStateIdentityWhenNoStateChange from '../../helpers/itReturnsTheSameStateIdentityWhenNoStateChange';
import describeSimpleSelector from '../../helpers/describeSimpleSelector';

const { expect } = chai;
chai.use(sinonChai);

const configLoadAction = {
    type: CONFIG_LOAD,
    config: {
        foo: 'bar'
    }
};
deepFreeze(configLoadAction);

describe('Config entities', () => {
    describe('configReducer', () => {
        itReturnsTheSameStateIdentityWhenNoStateChange(configReducer);

        describe('CONFIG_LOAD', () => {
            itReturnsTheSameStateIdentityWhenNoStateChange(configReducer, configLoadAction);

            it('stores the config', () => {
                expect(configReducer({}, configLoadAction))
                    .to.eql({
                        foo: 'bar'
                    });
            });
        });
    });

    describeSimpleSelector('getConfig', getConfig, 'config', {});

    describe('getConfigByName', () => {
        it('returns an item from the config by name', () => {
            // Set up
            const state = {
                foo: 'bar'
            };

            // Verify expectations
            expect(getConfigByName.resultFunc(state, 'foo'))
                .to.equal('bar');
        });
    });
});
