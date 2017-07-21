import { describe, it } from 'mocha';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import {
    CONFIG_LOAD,
    loadConfig
} from './actions';

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
