const { describe, it } = require('mocha');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const {
    CONFIG_LOAD,
    loadConfig
} = require('./actions');

const { expect } = chai;
chai.use(sinonChai);

describe('Config actions', () => {
    describe('loadConfig', () => {
        it('returns a load config action', () => {
            expect(loadConfig('foo'))
                .to.eql({
                    type: CONFIG_LOAD,
                    config: 'foo'
                });
        });
    });
});
