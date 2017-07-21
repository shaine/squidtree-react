import { describe, it } from 'mocha';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';

const { expect } = chai;
chai.use(sinonChai);

const RadarEntryStub = sinon.stub();
RadarEntryStub.findOne = sinon.stub();
RadarEntryStub.prototype.save = sinon.stub();
const mongooseStub = {
    Schema: sinon.stub().returns('foo schema'),
    model: sinon.stub().withArgs('RadarEntry', 'foo schema').returns(RadarEntryStub)
};
mongooseStub.Schema.Types = {
    ObjectId: 'ObjectId'
};
const {
    createRadarEntry
} = proxyquire('./RadarEntry', {
    mongoose: mongooseStub
});

describe('RadarEntry', () => {
    describe('createRadarEntry', () => {
        it('instantiates, saves, and returns a new radar entry', () => {
            // Set up
            const cbStub = sinon.stub();

            // Run unit
            createRadarEntry({
                name: 'Foo',
                description: 'bar',
                quadrant: 'tools',
                ring: 'adopt'
            }, cbStub);

            expect(RadarEntryStub.prototype.save)
                .to.have.been.calledWith(cbStub);
            expect(RadarEntryStub)
                .to.have.been.calledWith({
                name: 'Foo',
                description: 'bar',
                quadrant: 'tools',
                ring: 'adopt'
                });

            // Tear down
            RadarEntryStub.reset();
        });
    });
});
