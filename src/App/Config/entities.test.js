const { describe, it } = require('mocha');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const deepFreeze = require('deep-freeze');
const {
    configReducer,
    getConfig,
    getConfigByName
} = require('./entities');
const {
    CONFIG_LOAD
} = require('./actions');
const itReturnsTheSameStateIdentityWhenNoStateChange = require('../../helpers/itReturnsTheSameStateIdentityWhenNoStateChange');
const describeSimpleSelector = require('../../helpers/describeSimpleSelector');

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
